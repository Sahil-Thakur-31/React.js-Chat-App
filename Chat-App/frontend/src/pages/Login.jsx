import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api'
import { connectSocket } from "../socket";

export default function Login() {
  const[form, setForm] = useState({username: "", password: ""});
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(!error) return;
    const timer =setTimeout(() => {
        setError(null);
    }, 5000);

    return ()=> clearTimeout(timer);
  }, [error])

  const submit = async () => {
    setLoading(true);
    setError("");

    try{
      const res = await API.post("/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("token_issued_at", Date.now());
      connectSocket(token);
      navigate("/dashboard");
    }catch(err){
        setError(
          err.response?.data?.message || "Something went wrong"
    )}finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="app-shell">
        <div className="page-center">
          <div className="card">
              <h1>Login</h1>
              <div className="form">
                  <label htmlFor="name">UserName</label>
                  <input type="text" id='name' placeholder='Enter Username' onChange={e => setForm({...form, username : e.target.value})} />
                  <label htmlFor="password">Password</label>
                  <input type="password" id='password' placeholder='Enter Password' onChange={e => setForm({...form, password : e.target.value})} />
                  <button type='submit' onClick={submit} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                  <p>Don't have an Account? <Link to="/signup">Register Here</Link></p>
              </div>
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </>
  )
}
