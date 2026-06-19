import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Adlogin.css";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../api/axios";

function Adlogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
  if (!username || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const response = await api.post("accounts/login/", {username,password,});
    const data = response.data;

    console.log(data);

    if (data.is_superuser || data.is_staff) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("isAdmin", "true");

      toast.success("Welcome Admin!");
      navigate("/AdHome");
    } else {
      toast.error("You are not authorized as Admin");
    }
  } catch (err) {
  console.log(err.response?.data);
  toast.error("Invalid Credentials");
}
};


  return (
    <div className="admin-login">
      <h2 className="admin-title">Admin Login</h2>

      <form onSubmit={(e) => {e.preventDefault();handleLogin();}}autoComplete="off">
        <input
          className="admin-input"
          type="text"
          name="username"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />

        <input
          className="admin-input"
          type="password"
          name="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button className="admin-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Adlogin;



