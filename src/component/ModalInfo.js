// ModalInfo.js

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

const ModalInfo = ({ setUser, setRoom }) => {
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoinChat = () => {
    setUser(username);
    setRoom(roomNumber);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="modal-title">
      <DialogTitle id="modal-title">Enter Your Information</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Room Number"
          variant="outlined"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleJoinChat} color="primary" variant="contained">
          Join Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalInfo;
