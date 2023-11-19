import React, { useState, useEffect, useRef } from "react";
//import stomplient from "react-stomp";
//import SockJS from "sockjs-stomplient";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const ChattingRoom = ({ user, room }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  //let stompClient;
  const stompClientRef = useRef(null);
  const currentTime = new Date().toLocaleString("ko-KR", { hour12: false });

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    if (stompClientRef.current === null) {
      // 초기에 렌더링 두번 되서 추가
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        console.log("WebSocket Connected!");
        stompClient.subscribe("/sub/chat/room/" + room, (message) => {
          const content = JSON.parse(message.body);
          setMessageHistory((prevMessages) => [...prevMessages, content]);
        });

        axios
          .get("/api/messages/" + room)
          .then((response) => {
            console.log(response.data);
            setMessageHistory(response.data);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });

        // 입장 메세지 전송
        stompClient.send(
          "/pub/chat/join/" + room,
          {},
          JSON.stringify({
            message: user + "입장",
            user: user,
            roomNo: room,
            timeStamp: currentTime,
          })
        );
      });
    }
  }, [user, room]);

  const handleSendMessage = () => {
    console.log("handleSendMessage!");
    console.log(currentMessage);
    if (stompClientRef.current && currentMessage.trim() !== "") {
      console.log("stompClient true!");
      stompClientRef.current.send(
        "/pub/chat/message/" + room,
        {},
        JSON.stringify({
          message: currentMessage,
          user: user,
          roomNo: room,
          timeStamp: currentTime,
        })
      );
      setCurrentMessage("");
      console.log("handleSendMessage success");

      axios
        .get("/api/messages/" + room)
        .then((response) => {
          console.log(response.data);
          setMessageHistory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  };

  useEffect(() => {
    // 채팅방에 입장할 때 기존 메시지를 가져오는 로직
    axios
      .get("/api/messages/" + room)
      .then((response) => {
        console.log(response.data);
        setMessageHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [room]);

  const disconnectHandler = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect(() => {
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
              {content.user} : {content.message} : {content.timeStamp}
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

export default ChattingRoom;
