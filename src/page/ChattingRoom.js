import React, { useState, useEffect } from "react";
import SockJsClient from "react-stomp";
import { Modal, Box, TextField, Button } from "@mui/material";

export default function ChattingRoom() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleSendMessage = () => {
    if (
      client &&
      client.ws &&
      client.ws.readyState === WebSocket.OPEN &&
      inputMessage.trim() !== ""
    ) {
      const message = {
        message: inputMessage,
        user: user,
        timeStamp: new Date().getTime(),
      };
      handleMessage(message);
      client.sendMessage("/app/chat", JSON.stringify(message));
      setInputMessage("");
    } else {
      console.error("WebSocket connection not established yet.");
    }
  };

  const handleUserSubmit = () => {
    const newClient = new SockJsClient("http://localhost:8080/chat-websocket");
    newClient.onConnectFailure(() => {
      console.error("Failed to connect to the WebSocket server.");
    });

    newClient.onConnect(() => {
      setClient(newClient);
      setIsConnected(true);
      setIsModalOpen(false);
      localStorage.setItem("user", user);
    });
  };

  const handleClose = () => {
    if (client && client.ws && client.ws.readyState === WebSocket.OPEN) {
      client.sendMessage("/app/disconnect", "");
      client.close();
    }
    window.close();
  };

  return (
    <div>
      <Modal open={isModalOpen} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            label="Enter Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <Button onClick={handleUserSubmit}>Submit</Button>
        </Box>
      </Modal>

      {isConnected && <div>WebSocket connection is established.</div>}

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.user}: {message.message}
          </div>
        ))}
      </div>
      <TextField
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage}>Send</Button>

      <Button onClick={handleClose}>Close</Button>

      {client && (
        <SockJsClient
          url="http://localhost:8080/chat-websocket"
          topics={[`/topic/chat/`]}
          onMessage={(msg) => handleMessage(JSON.parse(msg.body))}
        />
      )}
    </div>
  );
}
