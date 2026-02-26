export default function Chatlist({
  chats = [],
  selectedChatId,
  onSelectChat,
  myUserId,
  typingChats = {},
}) {
  return (
    <div className="chatlist">
      <div className="userlist">
        {chats.map(chat => {
          // find the other participant (1-to-1 chat)
          const otherUser = chat.participants.find(
            u => u._id !== myUserId
          );

          if (!otherUser) return null;

          return (
            <div
              key={chat._id}
              className={`user ${
                selectedChatId === chat._id ? "active" : ""
              }`}
              onClick={() => onSelectChat(chat._id)}
            >
              <div className="profilepic">
                {otherUser.profilePic ? (
                  <img
                    src={otherUser.profilePic}
                    alt={otherUser.username}
                  />
                ) : (
                  <div className="placeholder-pic">👤</div>
                )}
              </div>

              <div className="detail">
                <div className="name-row">
                  <span className="name">{otherUser.username}</span>

                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <div className="last">
                  {typingChats[chat._id] ? (
                    <span className="typing-preview">Typing…</span>
                  ) : (
                    chat.lastMessage?.text || "No messages yet"
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {chats.length === 0 && (
          <div className="empty-chatlist">
            No chats yet. Start one from “New Chat”.
          </div>
        )}
      </div>
    </div>
  );
}
