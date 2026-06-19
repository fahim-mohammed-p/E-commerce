import React, { useState, useEffect } from "react";
import "./Dash.css";
import api from "../api/axios";

function Dash() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [ordersData, setOrdersData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    Promise.all([
      api.get("accounts/users/").then((res) => res.data),
      api.get("products/").then((res) => res.data),
      api.get("orders/").then((res) => res.data),
    ])
      .then(([users, products, orders]) => {
        setUserCount(users.length);
        setProductCount(products.length);
        setOrderCount(orders.length);
        setOrdersData(orders);

        const revenue = orders.reduce(
          (sum, order) => sum + Number(order.totalPrice || 0),
          0
        );
        setTotalRevenue(revenue);

        // Find available unique years in database
        const yearsSet = new Set(
          orders.map((o) => new Date(o.orderDate).getFullYear())
        );
        setAvailableYears(Array.from(yearsSet).sort((a, b) => b - a));
      })
      .catch((err) => console.log("Fetch Error", err));
  }, []);

  const monthlyNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Group orders by month (Jan - Dec) based on the filtered year
  const monthly = Array(12).fill(0);
  ordersData.forEach((order) => {
    const date = new Date(order.orderDate);
    const year = date.getFullYear();
    if (selectedYear === "All" || String(year) === selectedYear) {
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      if (month >= 0 && month < 12) {
        monthly[month] += Number(order.totalPrice || 0);
      }
    }
  });

  const maxVal = Math.max(...monthly, 1000); // Prevent division by zero

  return (
    <div className="dash-wrapper">
      <h2 className="dash-heading">Dashboard</h2>

      <div className="dash-cards">
        <div className="dash-card green">
          <h4>Total Users</h4>
          <p>{userCount}</p>
        </div>

        <div className="dash-card blue">
          <h4>Total Products</h4>
          <p>{productCount}</p>
        </div>

        <div className="dash-card orange">
          <h4>Total Orders</h4>
          <p>{orderCount}</p>
        </div>

        <div className="dash-card revenue">
          <h4>Total Revenue</h4>
          <p>${totalRevenue}</p>
        </div>
      </div>

      <div className="chart-card">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="chart-title m-0">Revenue Performance</h3>
          
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted fw-bold" style={{ fontSize: "0.85rem" }}>
              Filter Year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#eef2f3",
                borderRadius: "10px",
                padding: "4px 10px",
                fontWeight: "600",
                fontSize: "0.88rem",
                outline: "none",
              }}
            >
              <option value="All">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={String(yr)}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="chart-container">
          <svg viewBox="0 0 600 300" className="revenue-svg">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ffcc33" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffd400" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines */}
            <line x1="40" y1="50" x2="565" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="40" y1="120" x2="565" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="40" y1="190" x2="565" y2="190" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="40" y1="250" x2="565" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Render 12 Bars */}
            {monthly.map((val, idx) => {
              const barHeight = (val / maxVal) * 180;
              const xPos = 40 + idx * 44;
              const yPos = 250 - barHeight;

              return (
                <g key={idx} className="bar-group">
                  {/* Tooltip value displayed on hover */}
                  <text
                    x={xPos + 12}
                    y={yPos - 12}
                    textAnchor="middle"
                    className="bar-value"
                    fill="#ffd400"
                    fontSize="11"
                    fontWeight="800"
                  >
                    ${val}
                  </text>

                  {/* Bar shape */}
                  <rect
                    x={xPos}
                    y={yPos}
                    width="24"
                    height={barHeight || 4}
                    rx="4"
                    fill="url(#barGrad)"
                    className="bar-rect"
                  />

                  {/* Label under bar */}
                  <text
                    x={xPos + 12}
                    y="272"
                    textAnchor="middle"
                    fill="#9ea3a8"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {monthlyNames[idx]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Dash;
