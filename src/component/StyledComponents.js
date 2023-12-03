import styled from "styled-components";

export const ChatBoxContainer = styled.div`
  background-color: #ffd700; /* 노란색 배경 */
  border-radius: 10px; /* 라운드 처리 */
  padding: 10px;
  width: 300px; /* 원하는 너비 설정 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  margin: 10px;
`;

export const InlineContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SmallTextSpan = styled.span`
  font-size: 15px; /* 원하는 글자 크기 */
  color: gray; /* 회색 글자 색상 */
`;

export const TimeStamp = styled.span`
  font-size: 12px; /* 원하는 글자 크기 */
  color: gray; /* 회색 글자 색상 */
`;
