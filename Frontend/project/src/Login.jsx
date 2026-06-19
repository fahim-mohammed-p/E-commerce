import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../src/api/axios";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
  setError("");

  if (!username.trim()) {
    setError("Enter Username");
    return;
  }

  if (!password) {
    setError("Enter Password");
    return;
  }

  setLoading(true);

  try {
    const response = await api.post("accounts/login/",{username,password,});

     const data = response.data;

console.log(data);

localStorage.setItem("access", data.access);
localStorage.setItem("refresh", data.refresh);

try {
  const base64Url = data.access.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  if (payload && payload.user_id) {
    localStorage.setItem("user_id", payload.user_id.toString());
  }
} catch (e) {
  console.log("Failed to parse JWT payload", e);
}

localStorage.setItem("isLoggedIn", "true");

localStorage.setItem(
  "user",
  JSON.stringify({
    username: username,
  })
);

toast.success("Welcome back!");
navigate("/");

  }catch (error) {
  console.log(error.response?.data);
  const errMsg = error.response?.data?.detail || "Login Failed";
  setError(errMsg);
  toast.error(errMsg);
}

  setLoading(false);
};

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-heading">Login</h1>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} autoComplete="off">
          <div className="form-group">
            <input
              className="input-field"
              type="text"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </div>
        </form>

        <div className="signup-row">
          <small>
            New here?{" "}
            <button
              className="btn-link"
              onClick={() => navigate("/sign")}
              type="button"
            >
              Sign Up
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
