import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import SockJS from 'sockjs-client';
// Use direct path to avoid webpack picking up the node version
import Stomp from 'stompjs/lib/stomp.js';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import API_BASE_URL, { PUBLIC_API, WS_BASE_URL } from '../../../api/config';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const hasFetchedHistory = useRef(false);
    const [senderId, setSenderId] = useState(null);
    
    // ID người nhận (Admin nhận của User, User nhận của Admin) - Hardcoded for demo/MVP
    const ADMIN_ID = 1; 

    useEffect(() => {
        // Scroll to bottom whenever messages change
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && !hasFetchedHistory.current) {
            fetchHistory();
            hasFetchedHistory.current = true;
        }
    }, [isOpen]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        
        // Security: Header Authorization bắt buộc
        if (!token) {
            console.warn("Chưa đăng nhập, không thể kết nối Chat.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            // Try common claims for User ID
            const extractedId = decoded.userId || decoded.id || decoded.sub;
            setSenderId(extractedId);
            console.log("Decoded Sender ID:", extractedId);
        } catch (e) {
            console.error("Token decode failed:", e);
        }

        // 1. Khởi tạo kết nối SockJS
        // Append token to query param for robust Spring Security auth
        const socket = new SockJS(`${WS_BASE_URL}?access_token=${token}`);
        const StompClient = Stomp.Stomp || Stomp;
        const stompClient = StompClient.over(socket);
        
        // Enable debug logs for troubleshooting
        stompClient.debug = (str) => {
            console.log('[WS-USER]', str);
        }; 

        const headers = {
            'Authorization': `Bearer ${token}`,
            'passcode': token, 
            'login': 'user',
            'X-Authorization': `Bearer ${token}`
        };

        stompClient.connect(headers, (frame) => {
            console.log('Connected: ' + frame);
            // 2. Subscribe kênh riêng để nhận tin nhắn
            stompClient.subscribe('/user/queue/messages', (messageOutput) => {
                const newMessage = JSON.parse(messageOutput.body);
                
                setMessages(prev => {
                    // Deduplicate: Don't add if message with same ID already exists
                    if (newMessage.id && prev.some(m => m.id === newMessage.id)) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
                
                // Nếu đang mở chat thì mark read luôn
                if (isOpen) {
                    markAsRead(ADMIN_ID); 
                }
            });
        }, (error) => {
            console.error('Connection error:', error);
        });

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                try {
                    stompClientRef.current.disconnect(() => {
                        console.log('Disconnected');
                    });
                } catch (e) {
                    console.error('Failed to disconnect cleanly', e);
                }
            }
        };
    }, [isOpen]);

    const fetchHistory = async () => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) return;
        
        try {
            // API: GET /api/messages/{targetUserId}
            // User fetching history with Admin (ID=1)
            // Fix double /api prefix: API_BASE_URL already has /api
            const res = await axios.get(`${API_BASE_URL}/messages/${ADMIN_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
            
            // Mark read ngay khi mở lên
            markAsRead(ADMIN_ID);
        } catch (err) {
            console.error("Lỗi tải lịch sử chat", err);
        }
    };

    const markAsRead = async (senderId) => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) return;
        
        try {
            // Fix double /api prefix
             await axios.put(`${API_BASE_URL}/messages/mark-read/${senderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Lỗi mark read", err);
        }
    }

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
             console.warn("Chưa đăng nhập, không thể gửi ảnh.");
             return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload ảnh lên server
            const res = await axios.post(PUBLIC_API.CHAT_UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const { url, fileName } = res.data;

            // 2. Gửi message WebSocket type = IMAGE
            if (stompClientRef.current && stompClientRef.current.connected) {
                 const chatMessage = {
                    senderId: senderId,
                    content: "Đã gửi một ảnh", // Preview text
                    type: "IMAGE",
                    fileUrl: url,
                    fileName: fileName
                };

                stompClientRef.current.send(
                    "/app/chat", 
                    {}, 
                    JSON.stringify(chatMessage)
                );
                
                // Optimistic UI Update
                setMessages(prev => [...prev, {
                    senderId: 'ME', 
                    content: "Đã gửi một ảnh",
                    type: "IMAGE",
                    fileUrl: url,
                    timestamp: new Date().toISOString() 
                }]);
            }

        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
        } finally {
            // Reset input file
             e.target.value = null; 
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (stompClientRef.current && stompClientRef.current.connected) {
             // AUTO-ASSIGN: User does NOT send receiverId
             const chatMessage = {
                senderId: senderId, // Include senderId from token
                content: inputText
            };
            try {
                stompClientRef.current.send(
                    "/app/chat", 
                    {}, 
                    JSON.stringify(chatMessage)
                );
                
                // Tự hiển thị tin nhắn của mình lên UI
                setMessages(prev => [...prev, {
                    senderId: 'ME', 
                    content: inputText, 
                    timestamp: new Date().toISOString() 
                }]);
                
                setInputText('');
            } catch (error) {
                console.error("Send failed:", error);
            }
        }
    };

    return (
        <div className="chat-widget-container">
            {!isOpen && (
                <button className="chat-button" onClick={toggleChat}>
                    <svg viewBox="0 0 24 24" className="chat-icon">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Chat với Admin</h3>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    <div className="chat-body">
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', marginTop: '20px', color: '#999', fontSize: '14px' }}>
                                Bắt đầu trò chuyện...
                            </div>
                        )}
                        {messages.map((msg, index) => {
                            // Check if message is from me (Optimistic 'ME' or actual ID)
                            const isMine = msg.senderId === 'ME' || (senderId && msg.senderId == senderId);
                            const isImage = msg.type === 'IMAGE';
                            
                            return (
                                <div key={index} className={`message ${isMine ? 'sent' : 'received'} ${isImage ? 'image-message' : ''}`}>
                                    {isImage ? (
                                        <img 
                                            src={msg.fileUrl} 
                                            alt={msg.fileName || 'sent image'} 
                                            style={{maxWidth: '100%', borderRadius: '8px', cursor: 'pointer', display: 'block'}} 
                                            onClick={() => window.open(msg.fileUrl, '_blank')}
                                        />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-footer" onSubmit={handleSend}>
                        <label className="upload-button" style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                style={{display: 'none'}} 
                                onChange={handleImageUpload} 
                            />
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="#00C9FF">
                                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                            </svg>
                        </label>

                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="chat-input"
                            value={inputText}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="send-button" disabled={!inputText.trim()}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
