import React from "react";
import { useNavigate } from "react-router-dom";
import "./Ban.css";

function Ban() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="ban-page">
      <div className="ban-card">
        <div className="ban-icon">🚫</div>
        <h1 className="ban-heading">Access Denied</h1>
        <p className="ban-message">
          Your account has been suspended by the administrator. If you believe this is an error, please contact support.
        </p>
        <button className="btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Ban;
