import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const isSessionValid = () => !!localStorage.getItem("token");

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isSessionValid()
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
