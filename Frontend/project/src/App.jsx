import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import Home from "./Home";
import Cart from "./Cart";
import Login from "./Login";
import Sign from "./Sign";
import Pay from "./Pay";
import Ban from "./Ban";

import Adlogin from "./Admin/Adlogin";
import Adhome from "./Admin/AdHome";
import Product from "./Admin/Product";
import Users from "./Admin/Users";
import Orders from "./Admin/Orders";
import Dash from "./Admin/Dash";
import Category from "./Admin/Category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/Ban" element={<Ban />} />

        <Route path="/Adlogin" element={<Adlogin />} />

        <Route path="/Adhome" element={<Adhome />}>
          <Route index element={<Dash />} />
          <Route path="product" element={<Product />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="dash" element={<Dash />} />
          <Route path="categories" element={<Category />} />
        </Route>

        <Route path="*" element={<Home />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;