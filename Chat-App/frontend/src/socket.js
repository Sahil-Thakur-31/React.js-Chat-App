import { io } from "socket.io-client";

let socket = null;

export const connectSocket = token => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      auth: { token },
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
