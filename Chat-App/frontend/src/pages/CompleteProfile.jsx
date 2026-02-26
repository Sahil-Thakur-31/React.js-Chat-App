import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api";

export default function CompleteProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const userId = state?.userId;
  const [about, setAbout] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    navigate("/");
    return null;
  }

  const submit = async () => {
    setLoading(true);

    try {
      await API.put(`/users/${userId}/profile`, {
        about,
        profilePic,
      });

      navigate("/");
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-center">
        <div className="card">
          <h1>Complete Your Profile</h1>

          <label>Profile Image URL</label>
          <input
            type="text"
            placeholder="https://..."
            onChange={e => setProfilePic(e.target.value)}
          />

          <label>About</label>
          <input
            type="text"
            placeholder="Tell something about yourself"
            onChange={e => setAbout(e.target.value)}
          />

          <button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Continue to Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
