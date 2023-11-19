// import React, { useState } from "react";
// import ChattingRoom from "./ChattingRoom";

// export default function ChattingList() {
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   const createRoom = () => {
//     // 방 생성 로직 구현
//     const newRoom = {
//       id: Date.now().toString(),
//       name: `Room ${rooms.length + 1}`,
//     };
//     setRooms([...rooms, newRoom]);
//   };

//   const joinRoom = (roomId) => {
//     // 선택한 방에 참여하는 로직 구현
//     setSelectedRoom(roomId);
//   };

//   return (
//     <div>
//       <div>
//         <h2>Available Chat Rooms</h2>
//         <button onClick={createRoom}>Create Room</button>
//         <ul>
//           {rooms.map((room) => (
//             <li key={room.id}>
//               {room.name}{" "}
//               <button onClick={() => joinRoom(room.id)}>Join</button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {selectedRoom && <ChattingRoom roomId={selectedRoom} />}
//     </div>
//   );
// }
