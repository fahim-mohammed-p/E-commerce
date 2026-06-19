import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./pay.css";
import Navbar from "./Navbar";
import api from "./api/axios";
import { toast } from "react-toastify";

function Pay() {
  const [method, setMethod] = useState("")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExp, setCardExp] = useState("")
  const [address, setAddress] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const singleItem = location.state?.singleItem;

  const orderPay = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      let itemsToOrder = [];
      if (singleItem) {
        itemsToOrder = [singleItem];
      } else if (location.state?.cartItems) {
        itemsToOrder = location.state.cartItems;
      } else {
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
        if (userId) {
          const cartRes = await api.get(`cart/?user=${userId}`);
          itemsToOrder = cartRes.data;
        }
      }

      if (itemsToOrder.length === 0) {
        console.log("Cart empty");
        return;
      }

      const totalPrice = itemsToOrder.reduce(
        (sum, item) => sum + Number(item.price) * item.qty,
        0
      );

      const order = {
        userEmail: user.email,
        items: itemsToOrder,
        totalPrice,
        paymentStatus: "paid",
        paymentMethod: method,
        orderDate: new Date().toISOString(),
        address: method === "cod" ? address : undefined,
      };

      try {
        const orderRes = await api.post("orders/", order);
        console.log("Order stored in Django backend successfully", orderRes.data);
      } catch (apiErr) {
        console.error("Order API failed, but proceeding with cart clearance:", apiErr);
      }

      if (singleItem) {
        await api.delete(`cart/${singleItem.id}/`);
      } else {
        for (let item of itemsToOrder) {
          await api.delete(`cart/${item.id}/`);
        }
      }

    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  const handlePay = async () => {
    if (method.length === 0) {
      toast.warning("Select a Payment Method");
      return;
    }

    if (method === "cod" && !address.trim()) {
      toast.error("Enter Delivery Address");
      return;
    }
    if (method === "upi" && !upiId) {
      toast.error("Enter UPI ID");
      return;
    }
    if (method === "card" && (!cardNumber || !cardExp)) {
      toast.error("Complete Card Details");
      return;
    }
    await orderPay();

    toast.success("Payment received");
    navigate("/Cart");
  }

  return (
    <>
      <Navbar />
      <div className="payment-container">
        <h2 className="payment-heading">Payment Section</h2>

        <div className="payment-option">
          <label>
            <input
              type="radio"
              name="payment"
              value="upi"
              onChange={(e) => setMethod(e.target.value)} />
            UPI
          </label>
        </div>

        <div className="payment-option">
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              onChange={(e) => setMethod(e.target.value)} />
            Cash On Delivery(COD)
          </label>
        </div>

        <div className="payment-option">
          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              onChange={(e) => setMethod(e.target.value)} />
            Debit / Credit Card
          </label>
        </div>

        {method === "cod" && (
          <div className="payment-details">
            <input
              type="text"
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}

        {method === "upi" && (
          <div className="payment-details">
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {method === "card" && (
          <div className="payment-details">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />

            <input
              type="text"
              placeholder="Expiry MM/DD/YY"
              value={cardExp}
              onChange={(e) => setCardExp(e.target.value)}
            />
          </div>
        )}

        <button className="payment-btn" onClick={handlePay}>
          Place Order
        </button>
      </div>
    </>
  )
}

export default Pay
