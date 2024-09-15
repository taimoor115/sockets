import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();

// app.use(cors({ origin: "*", credentials: true }));
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id", socket.id);
  socket.emit("welcome", `Welcome to the server, ${socket.id}`);

  //   socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`);

  socket.on("message", ({ room, message }) => {
    console.log(room, message);
    io.to(room).emit("receive-message", message);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  console.log("Server is working...");
});

server.listen(3000, () => {
  console.log("App is working on port", 3000);
});
