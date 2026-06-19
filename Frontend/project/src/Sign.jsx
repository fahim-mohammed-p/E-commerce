import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sign.css";
import api from "../src/api/axios";
import { toast } from "react-toastify";



function Sign() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSign = async (e) => {
  e.preventDefault();


  setError("");

  if (!name || !email || !password) {
    setError("Please fill in all required fields.");
    toast.error("Please fill in all required fields.");
    return;
  }

  if (password.length < 6) {
    setError("Password should be at least 6 characters");
    toast.error("Password should be at least 6 characters");
    return;
  }

  setLoading(true);

  try {
    await api.post(
      "accounts/register/",
      {
        username: name,
        email: email,
        password: password,
      }
    );

    toast.success("Registered successfully! Please login.");
    navigate("/login");
  } 
  catch (error) {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (typeof errorData === "object") {
        const keys = Object.keys(errorData);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const messages = errorData[firstKey];
          let errMsg = "";
          if (Array.isArray(messages) && messages.length > 0) {
            errMsg = `${firstKey}: ${messages[0]}`;
          } else if (typeof messages === "string") {
            errMsg = `${firstKey}: ${messages}`;
          } else {
            errMsg = JSON.stringify(errorData);
          }
          setError(errMsg);
          toast.error(errMsg);
        } else {
          setError("Registration failed");
          toast.error("Registration failed");
        }
      } else {
        const errMsg = errorData.detail || "Registration failed";
        setError(errMsg);
        toast.error(errMsg);
      }
    } else {
      setError("Backend server not running");
      toast.error("Backend server not running");
    }
  }

  setLoading(false);
};

  const disabled =
    !name.trim() || !email.trim() || password.length < 6 || loading;

  return (
    <div className="sign-page">
      <div className="sign-card">
        <h1 className="sign-heading">Sign up</h1>

        <form className="sign-form" onSubmit={handleSign} autoComplete="off">
          <div className="form-row">
            <input
              className="input-field"
              type="text"
              name="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-row">
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-row">
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
              disabled={disabled}
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="signup-row">
          <small>
            Already signed up?{" "}
            <button
              className="btn-link"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Sign;
