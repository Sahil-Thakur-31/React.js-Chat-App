import { useEffect, useRef, useState, Fragment } from "react";

export default function Chat({
  chat,
  messages,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  myUserId,
  isBlocked,
  isTyping,
  joinedChatId,
  deliveredMap = {},
}) {
  const [text, setText] = useState("");
  const isTypingRef = useRef(false);
  const bottomRef = useRef(null);

  const participants = Array.isArray(chat?.participants)
    ? chat.participants
    : [];

  const otherUser = participants.find(u => u?._id !== myUserId);

  const otherUserId = participants.find(p => p._id !== myUserId)?._id;
  const lastSeenAt = chat.lastRead?.[otherUserId];

  /* ======================
     ✍️ INPUT CHANGE
     ====================== */
  const handleChange = e => {
    const value = e.target.value;
    setText(value);

    if (isBlocked || !chat?._id || joinedChatId !== chat._id) return;

    if (value.trim() && !isTypingRef.current) {
      onTypingStart(chat._id);
      isTypingRef.current = true;
    }

    if (!value.trim() && isTypingRef.current) {
      onTypingStop(chat._id);
      isTypingRef.current = false;
    }
  };

  /* ======================
     📤 SEND MESSAGE
     ====================== */
  const send = () => {
    if (!text.trim() || isBlocked) return;

    onSendMessage(text);

    if (isTypingRef.current) {
      onTypingStop(chat._id);
      isTypingRef.current = false;
    }

    setText("");
  };

  /* ======================
     🚪 STOP TYPING ON BLUR
     ====================== */
  const handleBlur = () => {
    if (!isTypingRef.current) return;
    onTypingStop(chat._id);
    isTypingRef.current = false;
  };

  /* ======================
     🔽 AUTOSCROLL
     ====================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-header">
        <h3>{otherUser?.username || "Chat"}</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const msgDate = new Date(msg.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;

          const showDate = msgDate !== prevDate;
          const isSentByMe = msg.sender === myUserId;

          return (
            <Fragment key={msg._id}>
              {showDate && (
                <div className="date-separator">{msgDate}</div>
              )}

              <div
                className={`message-wrapper ${
                  isSentByMe ? "sent" : "received"
                }`}
              >
                <div className="message">
                  {msg.text}

                  <div className="message-meta">
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isSentByMe && (
                      <span className="message-status">
                        {lastSeenAt &&
                        new Date(msg.createdAt) <= new Date(lastSeenAt)
                          ? "✓✓"
                          : deliveredMap[msg._id]
                          ? "✓✓"
                          : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}

        {isTyping && (
          <div className="typing-bubble">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isBlocked && (
        <div className="blocked-banner">
          You have blocked this user. You can’t send messages.
        </div>
      )}

      <div className="chat-input">
        <input
          disabled={isBlocked}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={
            isBlocked
              ? "Unblock user to send messages"
              : "Type a message…"
          }
        />
        <button disabled={isBlocked} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
