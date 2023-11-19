import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

import ChattingList from "./page/ChattingList";
import ChattingRoom from "./page/ChattingRoom";
import ModalInfo from "./component/ModalInfo";

function App() {
  // const [data, setData] = useState();

  // useEffect(() => {
  //   getMain();
  // }, []);

  // const getMain = () =>
  //   axios
  //     .get("/main")
  //     .then(function (response) {
  //       setData(response.data);
  //       console.log(response.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="App">
      {/* <h2>{data}</h2> */}
      {/* <ChattingList /> */}

      <div>
        {!user ? (
          <ModalInfo setUser={setUser} setRoom={setRoom} />
        ) : (
          <ChattingRoom user={user} room={room} />
        )}
      </div>
    </div>
  );
}

export default App;
