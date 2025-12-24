import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import SockJS from 'sockjs-client';
// Use direct path to avoid webpack picking up the node version
import Stomp from 'stompjs/lib/stomp.js';
import axios from 'axios';
import API_BASE_URL from '../../../api/config';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const hasFetchedHistory = useRef(false);
    
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
        
        // 1. Khởi tạo kết nối SockJS
        const socket = new SockJS('http://localhost:8080/ws');
        // Retrieve the Stomp object correctly depending on how it's exported
        const StompClient = Stomp.Stomp || Stomp;
        const stompClient = StompClient.over(socket);
        
        stompClient.debug = null; 

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        stompClient.connect(headers, (frame) => {
            console.log('Connected: ' + frame);
            // 2. Subscribe kênh riêng để nhận tin nhắn
            stompClient.subscribe('/user/queue/messages', (messageOutput) => {
                const newMessage = JSON.parse(messageOutput.body);
                setMessages(prev => [...prev, newMessage]);
                
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
            const res = await axios.get(`${API_BASE_URL}/api/messages/${ADMIN_ID}`, {
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
             await axios.put(`${API_BASE_URL}/api/messages/mark-read/${senderId}`, {}, {
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

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (stompClientRef.current && stompClientRef.current.connected) {
             const chatMessage = {
                receiverId: ADMIN_ID,
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
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.senderId === 'ME' ? 'sent' : 'received'}`}>
                                {msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-footer" onSubmit={handleSend}>
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
