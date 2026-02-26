import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getSocket } from "../socket";

import Chat from "../components/Chat";
import Chatlist from "../components/Chatlist";
import Options from "../components/Options";
import API from "../api";

export default function Dashboard() {
  const {
    selectedChatId,
    setSelectedChatId,
    pendingChat,
    setPendingChat,
  } = useOutletContext();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingChats, setTypingChats] = useState({});
  const [deliveredMap, setDeliveredMap] = useState({});
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedChatId, setJoinedChatId] = useState(null);

  const socketRef = useRef(null);
  const token = localStorage.getItem("token");

  /* =====================
     🔐 Decode user
     ===================== */
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setMyUserId(decoded.id);
    } catch {
      setMyUserId(null);
    }
  }, [token]);

  /* =====================
     🔌 Init socket ONCE
     ===================== */
  useEffect(() => {
    socketRef.current = getSocket();
  }, []);

  const socket = socketRef.current;

  /* =====================
     📂 Fetch chats (HTTP)
     ===================== */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get("/chats");
        setChats(
          res.data.map(chat => ({
            ...chat,
            unreadCount: chat.unreadCount || 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  /* =====================
     ➕ Insert new chat
     ===================== */
  useEffect(() => {
    if (!pendingChat) return;

    setChats(prev =>
      prev.some(c => c._id === pendingChat._id)
        ? prev
        : [pendingChat, ...prev]
    );

    setPendingChat(null);
  }, [pendingChat, setPendingChat]);

  /* =====================
     💬 Fetch messages (HTTP)
     ===================== */
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${selectedChatId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  /* =====================
     🚪 Join / Leave chat
     ===================== */
    useEffect(() => {
      if (!socket || !selectedChatId) return;

      socket.emit("join-chat", selectedChatId);
      setJoinedChatId(selectedChatId);

      return () => {
        socket.emit("leave-chat", selectedChatId);
        setJoinedChatId(null);
      };
    }, [socket, selectedChatId]);

  /* =====================
     📨 receive-message
     (ONLY active chat)
     ===================== */
  useEffect(() => {
    if (!socket) return;

    const handler = msg => {
      if (msg.chat === selectedChatId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("receive-message", handler);
    return () => socket.off("receive-message", handler);
  }, [socket, selectedChatId]);

  /* =====================
     📬 chat-updated
     (ALL chats)
     ===================== */
  useEffect(() => {
    if (!socket) return;

    const handler = ({ chatId, lastMessage }) => {
      setChats(prev =>
        prev
          .map(chat => {
            if (chat._id !== chatId) return chat;

            const isActive = chatId === selectedChatId;

            return {
              ...chat,
              lastMessage,
              updatedAt: lastMessage.createdAt,
              unreadCount: isActive
                ? 0
                : (chat.unreadCount || 0) + 1,
            };
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    };

    socket.on("chat-updated", handler);
    return () => socket.off("chat-updated", handler);
  }, [socket, selectedChatId]);

  /* =====================
     ✓ Delivered ticks
     ===================== */
  useEffect(() => {
    if (!socket) return;

    const handler = ({ messageId }) => {
      setDeliveredMap(prev =>
        prev[messageId] ? prev : { ...prev, [messageId]: true }
      );
    };

    socket.on("message-delivered", handler);
    return () => socket.off("message-delivered", handler);
  }, [socket]);

  /* =====================
     ✍️ Typing indicator
     ===================== */
  useEffect(() => {
    if (!socket) return;

    const typing = ({ chatId, userId }) => {
      if (userId === myUserId) return;
      setTypingChats(prev => ({ ...prev, [chatId]: true }));
    };

    const stopTyping = ({ chatId, userId }) => {
      if (userId === myUserId) return;
      setTypingChats(prev => {
        const copy = { ...prev };
        delete copy[chatId];
        return copy;
      });
    };

    socket.on("typing", typing);
    socket.on("stop-typing", stopTyping);

    return () => {
      socket.off("typing", typing);
      socket.off("stop-typing", stopTyping);
    };
  }, [socket, myUserId]);

  const handleTypingStart = chatId => {
    socket.emit("typing", { chatId });
  };

  const handleTypingStop = chatId => {
    socket.emit("stop-typing", { chatId });
  };

  /* =====================
     📤 Send message
     ===================== */
  const handleSendMessage = text => {
    if (!socket || !socket.connected || !selectedChatId) {
      console.warn("Socket not Ready")
      return;
    };

    socket.emit("send-message", {
      chatId: selectedChatId,
      text,
    });
  };

  /* =====================
     ⏳ Loading
     ===================== */
  if (loading || !myUserId) {
    return <div className="page-center">Loading…</div>;
  }

  const selectedChat = chats.find(c => c._id === selectedChatId);

  const isBlocked = selectedChat
    ? selectedChat.participants
        .find(p => p._id === myUserId)
        ?.blockedUsers?.includes(
          selectedChat.participants.find(p => p._id !== myUserId)?._id
        )
    : false;

  /* =====================
     🧱 Render
     ===================== */
  return (
    <div className="app-shell1">
      <div className="page-center">
        <div className="card dashboard">
          <Chatlist
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            myUserId={myUserId}
            typingChats={typingChats}
          />

          {selectedChat ? (
            <Chat
              chat={selectedChat}
              messages={messages}
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              myUserId={myUserId}
              isBlocked={isBlocked}
              isTyping={Boolean(typingChats[selectedChatId])}
              joinedChatId={joinedChatId}
              deliveredMap={deliveredMap}
            />
          ) : (
            <div className="empty-chat">
              Select a chat to start messaging
            </div>
          )}

          <Options
            chat={selectedChat}
            myUserId={myUserId}
            onChatCleared={() => setMessages([])}
            isBlocked={isBlocked}
          />
        </div>
      </div>
    </div>
  );
}
