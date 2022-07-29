//Imports
import express from "express";
import cors from "cors";
import moment from "moment";
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

const botName = "Fantastic Bot";

//Socket Connection
io.on("connection", (socket) => {
  //Welcome Message
  socket.emit("message", formatMessage(botName, "Welcome to Fantastic Chat"));

  //New connection message
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "New user has joined the chat")
  );

  //Disconnection message
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "Someone has left the chat"));
  });

  socket.on("fromUser", (msg) => {
    io.emit("message", formatMessage(msg.sender, msg.text));
  });
});

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}
