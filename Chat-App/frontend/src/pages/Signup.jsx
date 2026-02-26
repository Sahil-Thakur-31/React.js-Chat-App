import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/signup", form);

      navigate("/complete-profile", {
        state: { userId: res.data.userId },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-shell">
        <div className="page-center">
          <div className="card">
            <h1>Register</h1>

            <label>Username</label>
            <input
              type="text"
              onChange={e =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <label>Email</label>
            <input
              type="email"
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <label>Password</label>
            <input
              type="password"
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button onClick={submit} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
    </>
  );
}
