import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [room, setRoom] = useState("");
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  console.log(messages);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected...");
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((message) => [...message, data]);
    });
    socket.on("welcome", (s) => console.log(s));

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      <Typography variant="p" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outline-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outline-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages?.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
