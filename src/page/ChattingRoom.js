import React, { useState, useEffect, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

import {
  ChatBoxContainer,
  InlineContainer,
  TimeStamp,
  SmallTextSpan,
} from "../component/StyledComponents";

const ChatBox = ({ children }) => {
  return <ChatBoxContainer>{children}</ChatBoxContainer>;
};

const ChattingRoom = ({ user, room }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const stompClientRef = useRef(null);
  //let stompClient = useRef(null);

  //const currentTime = new Date().toLocaleString("ko-KR", { hour12: false });
  const currentTime = new Date().toLocaleString("ko-KR", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    if (stompClientRef.current === null) {
      // 초기에 렌더링 두번 되서 추가
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        console.log("WebSocket 연결 완료!");

        // 연결되자마자 기존 메세지 불러옴
        getMessage();

        // 구독 시작
        stompClient.subscribe("/sub/chat/room/" + room, (message) => {
          const content = JSON.parse(message.body);
          setMessageHistory((prevMessages) => [
            ...prevMessages,
            content,
            // {
            //   message: content.message,
            //   user: content.user,
            //   roomNo: content.room,
            //   timeStamp: content.currentTime,
            //   type: content.type,
            // },
          ]);
        });

        // 입장 메세지 전송
        stompClient.send(
          "/pub/chat/join/" + room,
          {},
          JSON.stringify({
            message: user + "입장이요",
            user: user,
            roomNo: room,
            timeStamp: currentTime,
            type: "In",
          })
        );
        // 스크롤
        messageEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, []);

  const messageEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/messages/" + room)
      .then((response) => {
        console.log(response.data);
        setMessageHistory((prevMessages) => [...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [setCurrentMessage]);

  const handleSendMessage = () => {
    //console.log(currentMessage);
    if (stompClientRef.current && currentMessage.trim() !== "") {
      stompClientRef.current.send(
        "/pub/chat/message/" + room,
        {},
        JSON.stringify({
          message: currentMessage,
          user: user,
          roomNo: room,
          timeStamp: currentTime,
          type: "msg",
        })
      );
      console.log("handleSendMessage success");

      //   setMessageHistory((prevMessages) => [
      //     ...prevMessages,
      //     {
      //       message: currentMessage,
      //       user: user,
      //       timeStamp: currentTime,
      //       type: "msg",
      //     },
      //   ]);
      //console.log("check!!!!!!!!!!!!!! " + messageHistory);
      setCurrentMessage("");
      getMessage();
    }
  };

  const getMessage = () => {
    axios
      .get("/api/messages/" + room)
      .then((response) => {
        console.log(response.data);
        setMessageHistory((prevMessages) => [...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const disconnectHandler = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect(() => {
        console.log("disconnectHandler");
        //window.location.href = "/";
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
            <InlineContainer key={index}>
              <SmallTextSpan>{content.user}</SmallTextSpan>
              <ChatBox>{content.message}</ChatBox>
              <TimeStamp>{content.timeStamp}</TimeStamp>
            </InlineContainer>
          ))}
        </ul>
        <input
          type="text"
          name="message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button className="send" onClick={handleSendMessage}>
          보내기
        </button>
      </div>
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default ChattingRoom;
