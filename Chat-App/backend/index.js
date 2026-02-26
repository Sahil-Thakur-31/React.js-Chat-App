require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connect = require("./db");
const setupSocket = require("./socket");

connect();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/chats", require("./routes/chats"));

setupSocket(io);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port", process.env.PORT);
});
