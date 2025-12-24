import React, { useState, useEffect, useRef } from 'react';
import './ChatManagement.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import StompLib from 'stompjs/lib/stomp.js';
import axios from 'axios';
import API_BASE_URL from '../../../api/config';

const ChatManagement = () => {
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, selectedUser]);

  // Connect WebSocket on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    // Connect WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const StompClient = StompLib.Stomp || StompLib;
    const stompClient = StompClient.over(socket);
    stompClient.debug = null; 

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    stompClient.connect(headers, (frame) => {
        console.log('Admin Connected: ' + frame);
        setIsConnected(true);
        
        // Listen for incoming messages
        stompClient.subscribe('/user/queue/messages', (messageOutput) => {
            const newMessage = JSON.parse(messageOutput.body);
            handleIncomingMessage(newMessage);
        });
    }, (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
    });

    stompClientRef.current = stompClient;

    return () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
             try {
                stompClientRef.current.disconnect();
            } catch (e) {
                console.error("Disconnect error", e);
            }
        }
    };
  }, []);

  // Fetch history when selecting a user
  useEffect(() => {
    if (selectedUser) {
        fetchHistory(selectedUser);
    }
  }, [selectedUser]);

  const fetchHistory = async (userId) => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) return;

      try {
          // GET /api/messages/{targetUserId}
          const res = await axios.get(`${API_BASE_URL}/api/messages/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          setConversations(prev => ({
              ...prev,
              [userId]: res.data
          }));

          // Mark as read
          await axios.put(`${API_BASE_URL}/api/messages/mark-read/${userId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });

      } catch (err) {
          console.error(`Error fetching history with user ${userId}:`, err);
      }
  };

  const handleIncomingMessage = (message) => {
    // message: { senderId, receiverId, content, ... }
    
    // If I am Admin (ID=1), and receiver is ME, then sender is the User.
    // If sender is ME, receiver is the User (echo message).
    
    // Assuming Admin ID = 1.
    const otherId = message.senderId === 1 ? message.receiverId : message.senderId;
    
    setConversations(prev => {
        const currentMessages = prev[otherId] || [];
        // Prevent duplicates if backend sends duplicates
        // Simple check by timestamp or assume order is fine
        return {
            ...prev,
            [otherId]: [...currentMessages, message]
        };
    });
    
    // If currently selected user is the sender, mark as read
    if (selectedUser === otherId && message.senderId !== 1) {
         markAsRead(otherId);
    }
  };

  const markAsRead = async (userId) => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      try {
           await axios.put(`${API_BASE_URL}/api/messages/mark-read/${userId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
      } catch (err) {
          console.error("Error marking as read", err);
      }
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;

    if (stompClientRef.current && isConnected) {
        const chatMessage = {
            receiverId: selectedUser,
            content: inputText
        };

        try {
            stompClientRef.current.send(
                "/app/chat", 
                {}, 
                JSON.stringify(chatMessage)
            );

            // Optimistic update
            const newMessage = {
                senderId: 1, // Me (Admin)
                receiverId: selectedUser,
                content: inputText,
                timestamp: new Date().toISOString()
            };
            
            setConversations(prev => {
                const currentMessages = prev[selectedUser] || [];
                return {
                    ...prev,
                    [selectedUser]: [...currentMessages, newMessage]
                };
            });

            setInputText('');
        } catch (error) {
            console.error("Send failed", error);
        }
    }
  };

  // Convert conversations object to array for list
  // Note: Only users we have loaded messages for will appear here. 
  // Ideally we should have an endpoint to get "List of conversations".
  // For now, we rely on incoming messages or manually added simulated users if needed.
  // Or we might need to fetch a list of users who have messaged us first.
  // Assuming the `conversations` map populates as we discover users or from a "Recent Chats" API.
  // If the API /api/messages/{targetUserId} is only for specific history, we might miss an initial list.
  // Let's assume for this step we rely on incoming messages to populate the list OR 
  // we would need a `/api/conversations` endpoint. 
  // Since the user didn't provide `/api/conversations`, I will keep it as is. 
  
  const conversationList = Object.keys(conversations).map(userId => ({
      userId: parseInt(userId),
      lastMessage: conversations[userId][conversations[userId].length - 1]
  }));

  return (
    <div className="chat-management">
      {/* Sidebar List */}
      <div className="chat-sidebar">
        <div className="chat-search">
            <input type="text" placeholder="Tìm kiếm người dùng..." />
        </div>
        <div className="conversation-list">
            {conversationList.length === 0 && (
                <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                    <p>Chưa có cuộc hội thoại nào.</p>
                    <small>Tin nhắn mới sẽ xuất hiện ở đây.</small>
                </div>
            )}
            {conversationList.map(conv => (
                <div 
                    key={conv.userId} 
                    className={`conversation-item ${selectedUser === conv.userId ? 'active' : ''}`}
                    onClick={() => setSelectedUser(conv.userId)}
                >
                    <div className="user-avatar">
                        <i className="bi bi-person"></i>
                    </div>
                    <div className="conversation-info">
                        <h4>User #{conv.userId}</h4>
                        <p>{conv.lastMessage?.content}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedUser ? (
            <>
                <div className="chat-main-header">
                    <div className="user-avatar" style={{width: 30, height: 30, fontSize: 14}}>
                         <i className="bi bi-person"></i>
                    </div>
                    <h3>Chat với User #{selectedUser}</h3>
                </div>
                
                <div className="chat-messages">
                    {(conversations[selectedUser] || []).map((msg, idx) => (
                        <div key={idx} className={`admin-message-item ${msg.senderId === 1 ? 'sent' : 'received'}`}>
                            {msg.content}
                            <span className="message-time">
                                {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <form className="input-wrapper" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Nhập tin nhắn..." 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" disabled={!inputText.trim()}>
                            Gửi
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="no-chat-selected">
                <i className="bi bi-chat-dots"></i>
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
