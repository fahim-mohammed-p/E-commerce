import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BsCart3 } from "react-icons/bs";
import { AiFillExclamationCircle } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function Navbar({ searchTerm = "", setSearchTerm = () => {}, showSearch = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const userStr = localStorage.getItem("user");

    if (userStr) {
    const user = JSON.parse(userStr);
    setUserName(user.username || "");
    } else {
    setUserName("");
      }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  const handleAboutClick = () => {
    if (currentPath === "/") {
      const element = document.getElementById("about-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#about");
    }
  };

  const isHomeActive = currentPath === "/" && !location.hash.includes("about");
  const isAboutActive = currentPath === "/" && location.hash.includes("about");
  const isCartActive = currentPath.toLowerCase() === "/cart" || currentPath.toLowerCase() === "/pay";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand">
          Welcome, {userName ? userName : "Guest"}
        </span>

        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <span
              className={`nav-link ${isHomeActive ? "active" : ""}`}
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <GoHomeFill /> Home
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${isCartActive ? "active" : ""}`}
              onClick={() => navigate("/cart")}
            >
              <BsCart3 /> Cart
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${isAboutActive ? "active" : ""}`}
              onClick={handleAboutClick}
            >
              <AiFillExclamationCircle /> About
            </span>
          </li>
        </ul>

        {showSearch && (
          <div className="search-container mx-auto">
            <CiSearch className="search-icon" />
            <input
              type="text"
              className="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <button
          className="logout-btn"
          onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
        >
          {isLoggedIn ? (
            <>
              <MdOutlineLogout /> Logout
            </>
          ) : (
            <>
              <MdOutlineLogin /> Login
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
