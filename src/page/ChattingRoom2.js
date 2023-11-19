import React, { useState, useEffect } from "react";
//import stomplient from "react-stomp";
//import SockJS from "sockjs-stomplient";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const ChattingRoom2 = ({ user, room }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  let stompClient;

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket Connected!");
      stompClient.subscribe("/sub/chat/room/" + room, (message) => {
        const content = JSON.parse(message.body);
        setMessageHistory((prevMessages) => [...prevMessages, content]);
      });
      stompClient.send(
        "/pub/chat/join/" + room,
        {},
        JSON.stringify({
          message: "연결성공",
          user: user,
          roomNo: room,
          timeStamp: new Date().getTime(),
        })
      );
    });
  }, [user, room]);

  //   stompClient.connect({}, () => {
  //     console.log("WebSocket Connected!");
  //     stompClient("/sub/chat/room/${room}", (message) => {
  //       const content = JSON.parse(message.body);
  //       setMessageHistory((prevMessages) => [...prevMessages, content]);
  //     });
  //     stompClient.send("/pub/chat/join/${room}", {}, JSON.stringify({ user }));
  //   });

  // return () => {
  //   stompClient.disconnect(() => {
  //     console.log("WebSocket Disconnected!");
  //   });
  // };

  const handleSendMessage = () => {
    console.log("handleSendMessage!");
    console.log(stompClient);
    console.log(currentMessage);
    if (stompClient && currentMessage.trim() !== "") {
      console.log("stompClient true!");
      stompClient.send(
        "/pub/chat/message/" + room,
        {},
        JSON.stringify({
          message: currentMessage,
          user: user,
          roomNo: room,
          timeStamp: new Date().getTime(),
        })
      );
      setCurrentMessage("");
      console.log("handleSendMessage success");
    }
  };

  const disconnectHandler = () => {
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("disconnectHandler");
        //window.location.href = "/"; // 예시로 홈페이지로 이동
      });
    }
  };

  return (
    <div>
      <h1>Chatting Room {room}</h1>
      <button onClick={disconnectHandler}>나가기</button>
      <div className="content" room={room} user={user}>
        <ul className="chat_box">
          {messageHistory.map((content, index) => (
            <li key={index}>
              {content.message} ({content.user})
            </li>
          ))}
        </ul>
        <input
          type="text"
          name="message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button className="send" onClick={handleSendMessage}>
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChattingRoom2;
