import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "./socket";

export default function Layout() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }
  }, []);

  const [selectedChatId, setSelectedChatId] = useState(
    localStorage.getItem("selectedChatId")
  );
  const [pendingChat, setPendingChat] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, []);
  
  return (
    <div className="app-shell">
      <Navbar
        onOpenChat={chat => {
          setPendingChat(chat);
          setSelectedChatId(chat._id);
          localStorage.setItem("selectedChatId", chat._id);
        }}
      />

      <Outlet
        context={{
          selectedChatId,
          setSelectedChatId: id => {
            setSelectedChatId(id);
            if (id) localStorage.setItem("selectedChatId", id);
            else localStorage.removeItem("selectedChatId");
          },
          pendingChat,
          setPendingChat,
        }}
      />
    </div>
  );
}
