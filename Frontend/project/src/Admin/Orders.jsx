import React, { useEffect, useState } from "react";
import "./Orders.css";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) return;

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");

      const sorted = response.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrders(sorted);

    } catch (err) {
      console.log(err);
    }
  };

  fetchOrders();

}, []);

  const getFilteredOrders = () => {
    if (dateFilter === "all") return orders;

    const now = new Date();
    const cutoff = new Date();

    if (dateFilter === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (dateFilter === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (dateFilter === "3months") {
      cutoff.setMonth(now.getMonth() - 3);
    } else if (dateFilter === "year") {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    return orders.filter(order => new Date(order.orderDate) >= cutoff);
  };

  const filtered = getFilteredOrders();

  return (
    <div className="order-container">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="order-heading m-0">Orders List</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted fw-bold text-sm" style={{ fontSize: "0.9rem" }}>Filter:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#eef2f3",
              borderRadius: "10px",
              padding: "6px 12px",
              fontWeight: "600",
              outline: "none"
            }}
          >
            <option value="all">All Orders</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No orders found for the selected period.</p>
      ) : (
        filtered.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header-row">
              <div className="order-meta">
                <span className="order-badge">Order ID: {order.id}</span>
                <span className="order-date">{new Date(order.orderDate).toLocaleString()}</span>
              </div>
              <div className="order-total-price">
                Total: <span>${order.totalPrice}</span>
              </div>
            </div>
            
            <div className="order-details-grid">
              <div>
                <b>User:</b> {order.userEmail}
              </div>
              <div>
                <b>Payment:</b> {order.paymentMethod.toUpperCase()}
              </div>
              <div>
                <b>Status:</b> <span className={`status-badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </div>
            </div>

            <div className="order-items-section">
              <h6>Items Ordered</h6>
              <div className="order-items-list">
                {order.items.map(item => (
                  <div key={item.id} className="order-item-row">
                    <img src={item.image} alt={item.name} className="order-item-thumb" />
                    <span className="item-name">{item.name} <small>({item.inch}")</small></span>
                    <span className="item-qty">Qty: {item.qty}</span>
                    <span className="item-subtotal">${item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
