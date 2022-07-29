//Imports
import express from "express";
import cors from "cors";
import moment from "moment";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

//Routers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Global Variables
const app = express();
app.use(
  express.static(path.join(__dirname, "../Front-End-Fantastic-Chat-App"))
);
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
let users = [];

//Socket Connection
io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    newUser(socket.id, username);

    //Welcome Message
    socket.emit("message", formatMessage(botName, "Welcome to Fantastic Chat"));

    //New connection message
    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${username} has joined the chat`)
    );

    //Passing online user list
    io.emit("users", users);
  });

  //Disconnection message
  socket.on("disconnect", () => {
    const user = findUser(socket.id);
    io.emit(
      "message",
      formatMessage(botName, `${user.username} has left the chat`)
    );

    //Remove the disconnected user
    users = users.filter((user) => user.id !== socket.id);
    //Passing user list after user left
    io.emit("users", users);
  });

  //Messages from users
  socket.on("fromUser", (msg) => {
    const user = findUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });
});

//Function to return the user object
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}
//Adding new user to array
function newUser(id, username) {
  const user = { id, username };
  users.push(user);
}

//Finding the user by its socket id
function findUser(id) {
  return users.find((user) => user.id === id);
}
