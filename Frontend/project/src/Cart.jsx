import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";
import Navbar from "./Navbar";
import api from "./api/axios";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    let userId = localStorage.getItem("user_id");
    if (userId === "undefined" || userId === "null") {
      userId = null;
    }
    if (!userId) {
      const token = localStorage.getItem("access");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          if (payload && payload.user_id) {
            userId = payload.user_id.toString();
            localStorage.setItem("user_id", userId);
          }
        } catch (e) {
          console.log("Failed to parse JWT payload", e);
        }
      }
    }

    if (!userId) return;

    try {
      const res = await api.get(`cart/?user=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.log("Failed to fetch cart", err);
    }
  };

  const handleIncrease = async (item) => {
    try {
      await api.patch(`cart/${item.id}/`, { qty: item.qty + 1 });
      fetchCart();
    } catch (err) {
      console.log("Failed to increase quantity", err);
    }
  };

  const handleDecrease = async (item) => {
    if (item.qty > 1) {
      try {
        await api.patch(`cart/${item.id}/`, { qty: item.qty - 1 });
        fetchCart();
      } catch (err) {
        console.log("Failed to decrease quantity", err);
      }
    }
  };

  const handleRemove = async (item) => {
    try {
      await api.delete(`cart/${item.id}/`);
      fetchCart();
    } catch (err) {
      console.log("Failed to remove item", err);
    }
  };

  const handleBuy = (item) => {
    navigate("/Pay", { state: { singleItem: item } });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty, 0
  );

  const handleCheckout = () => {
    navigate("/Pay", { state: { cartItems, totalPrice } });
  };

  return (
    <>
      <Navbar />
      <div className="cart-container mt-5">
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <button className="cart-back-btn" onClick={() => navigate("/")}>
            ← Back to Store
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h5>{item.name}</h5>
                    <p>Inch: {item.inch}</p>
                    <p className="price">
                      ${(Number(item.price) * item.qty).toFixed(2)}
                    </p>

                    <div className="qty-controls">
                      <button onClick={() => handleDecrease(item)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleIncrease(item)}>+</button>
                    </div>
                  </div>
                  <button
                    className="buy-btn"
                    onClick={() => handleBuy(item)}
                  >
                    Buy
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <div className="cart-summary-card">
                <h4>Order Summary</h4>
                <hr />
                <p>Total Items: {cartItems.reduce((sum, item) => sum + item.qty, 0)}</p>
                <h5>Total: ${totalPrice.toFixed(2)}</h5>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
