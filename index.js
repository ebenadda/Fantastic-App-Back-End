//Imports
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

//Global Variables
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//CORS
app.use(cors());

//Socket Connection
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
