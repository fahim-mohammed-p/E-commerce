import React, { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Adhome.css";

import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineReviews } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { FaTags } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";

function Adhome() {
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === "/adhome" || path === "/adhome/") {
      navigate("dash", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/Adlogin");
  };

  const handleUI = () => {
    navigate("/");
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h3><CgProfile />Admin</h3>
        <ul>
          <li className="nav-item">
            <NavLink className="nav-link" to="dash"><RiDashboardFill />Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="product"><FaTags />Products</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="categories"><BiCategory />Categories</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="users"><HiUsers />Users</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="orders"><FaBoxOpen />Orders</NavLink>
          </li>
        </ul>

        <button className="admin-btn" onClick={handleLogout}><MdOutlineLogout />Logout</button>
        <button onClick={handleUI}><MdOutlineReviews />UI</button>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Adhome;

