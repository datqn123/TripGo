import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

const WebSocketService = {
  connect: (onMessageReceived) => {
    stompClient = new Client({
      // webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Local
      webSocketFactory: () => new SockJS('https://tripgo-api.onrender.com/ws'), // Production
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        // Example subscription
        // stompClient.subscribe('/topic/public', (message) => {
        //   if (onMessageReceived) onMessageReceived(JSON.parse(message.body));
        // });
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

  sendMessage: (destination, payload) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
    } else {
      console.error("WebSocket is not connected");
    }
  },
  
  getStompClient: () => {
      return stompClient;
  }
};

export default WebSocketService;
