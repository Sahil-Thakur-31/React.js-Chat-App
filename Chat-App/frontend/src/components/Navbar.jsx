import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { disconnectSocket } from "../socket";
import { jwtDecode } from "jwt-decode";

export default function Navbar({ onOpenChat }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const myUserId = token ? jwtDecode(token).id : null;

  const logout = () => {
    disconnectSocket();
    localStorage.removeItem("selectedChatId");
    localStorage.removeItem("token");
    localStorage.removeItem("token_issued_at");
    navigate("/", { replace: true });
  };

  const handleSearch = async e => {
    const value = e.target.value;
    try {
      const res = await API.get(`/users?username=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error("User search failed", err);
    }
  };

  const startChat = async userId => {
    try {
      const res = await API.post("/chats", { userId });

      onOpenChat(res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="brand">SecureChat</span>
        </div>

        <div className="navbar-right">
          <button
            className="logout-btn"
            onClick={() => setShowModal(true)}
          >
            + New Chat
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h3>Start New Chat</h3>

            <input
              type="text"
              placeholder="Search username..."
              onChange={handleSearch}
            />

            <div className="userlist">
              {results
                .filter(user => user._id !== myUserId)
                .map(user => (
                <div
                  key={user._id}
                  className="user"
                  onClick={() => startChat(user._id)}
                >
                  <div className="profilepic">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                      />
                    ) : (
                      <div className="placeholder-pic">👤</div>
                    )}
                  </div>

                  <div className="detail">
                    <div className="name">{user.username}</div>
                    <div className="last">
                      {user.about || "No bio available"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
