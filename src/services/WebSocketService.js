import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

let stompClient = null;
let listeners = [];

const WebSocketService = {
  connect: () => {
    // Get token for private channel auth
    // Note: Assuming token is stored in localStorage 'token' or similar
    const token = localStorage.getItem('token'); 

    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Local
      // webSocketFactory: () => new SockJS('https://tripgo-api.onrender.com/ws'), // Production
      
      // Add connect headers if needed for initial connection (often not needed for STOMP over SockJS if using query params or if auth is done on subscribe)
      // connectHeaders: {
      //   Authorization: `Bearer ${token}`
      // },

      onConnect: (frame) => {
        console.log('Connected to WebSocket');
        
        // 1. Subscribe to PUBLIC channel (No auth required usually, or open to all)
        stompClient.subscribe('/topic/public/notifications', (message) => {
            handleNotification(message);
        });

        // 2. Subscribe to PRIVATE channel (User specific)
        // Only if user is logged in
        if (token) {
            stompClient.subscribe('/user/queue/notifications', (message) => {
                handleNotification(message);
            }, {
                Authorization: `Bearer ${token}` // Pass token in header for this subscription if backend requires it here
                // Or backend often identifies user by the session established during connection
            });
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient !== null) {
      stompClient.deactivate();
      console.log("Disconnected");
    }
  },

  // Allow components to subscribe to notifications locally
  subscribe: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  sendMessage: (destination, payload) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
    } else {
      console.error("WebSocket is not connected");
    }
  }
};

const handleNotification = (message) => {
    if (message.body) {
        try {
            const notification = JSON.parse(message.body);
            console.log("WS Received:", notification);
            
            // 1. Show global toast based on type
            // e.g. SYSTEM, PROMOTION, BOOKING
            if(notification.title && notification.message) {
                 // Use a custom toast layout or simple text
                 toast.info(`${notification.title}: ${notification.message}`);
            }

            // 2. Notify all local listeners (Header, etc.)
            listeners.forEach(listener => listener(notification));

        } catch (e) {
            console.error("Error parsing notification", e);
        }
    }
};

export default WebSocketService;
