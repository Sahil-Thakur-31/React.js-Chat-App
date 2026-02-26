import { useState } from "react";
import API from "../api";

export default function Options({ chat, myUserId, onChatCleared }) {
  if (!chat || !Array.isArray(chat.participants)) {
    return (
      <div className="options empty-options">
        <p>Select a chat to view details</p>
      </div>
    );
  }

  const me = chat.participants.find(
    u => u && u._id === myUserId
  );

  const otherUser = chat?.participants.find(
    u => u && u._id !== myUserId
  );


  if (!me || !otherUser) {
    return (
      <div className="options empty-options">
        <p>User information unavailable</p>
      </div>
    );
  }

  const isBlocked = me?.blockedUsers?.some(
    id => id.toString() === otherUser._id.toString()
  );

  const toggleBlock = async () => {
    try {
      const endpoint = isBlocked
        ? `/users/${otherUser._id}/unblock`
        : `/users/${otherUser._id}/block`;

      await API.post(endpoint);
      window.location.reload();
    } catch (err) {
      console.error(
        "Block toggle failed",
        err.response?.data?.message
      );
    }
  };

  const clearChat = async () => {
    const confirm = window.confirm(
      "Are you sure you want to clear this chat?"
    );
    if (!confirm) return;

    try {
      await API.delete(`/messages/chat/${chat._id}`);
      onChatCleared?.(chat._id);
    } catch (err) {
      console.error("Failed to clear chat", err);
      alert("Failed to clear chat");
    }
  };

  return (
    <div className="options">
      {/* Profile */}
      <div className="options-profile">
        <div className="options-pic">
          <img
            src={otherUser.profilePic || "/avatar.png"}
            alt={otherUser.username}
          />
        </div>

        <h3 className="options-name">{otherUser.username}</h3>

        <p className="options-about">
          {otherUser.about || "No bio provided."}
        </p>
      </div>

      {/* Shared media (Dummy) */}
      <div className="options-shared">
        <h4>Shared Media</h4>
      </div>

      <div className="shared-grid">
        <div className="shared-item">—</div>
        <div className="shared-item">—</div>
        <div className="shared-item">—</div>
        <div className="shared-item">—</div>
      </div>

      {/* Actions */}
      <div className="options-actions">
        <button className="danger" onClick={toggleBlock}>
          {isBlocked ? "Unblock User" : "Block User"}
        </button>

        <button onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}
