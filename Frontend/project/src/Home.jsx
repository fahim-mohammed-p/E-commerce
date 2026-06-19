import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import Navbar from "./Navbar";
import { FaCartArrowDown } from "react-icons/fa6";
import api from "../src/api/axios";
import { toast } from "react-toastify";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    if (user.banned === true || user.banned === "true") {
      toast.warning("You are banned by admin");
      navigate("/Ban");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.hash === "#about" || location.hash.includes("about")) {
      const element = document.getElementById("about-section");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location.hash]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const productRes = await api.get("products/");
      setProducts(productRes.data);

      const categoryRes = await api.get("products/category/");
      setCategories(categoryRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);

    const addToCart = async (product) => {
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

  if (!userId) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  try {
    await api.post("cart/", {user: userId, product: product.id,});

    toast.success(`${product.product_name} Added To Cart`);
  } catch (error) {
    console.log(error.response?.data);
    toast.error("Failed to add cart item");
  }
};

  const filter = (category) =>
    products.filter((p) => {
      const matchesCategory = p.category_name === category;
      if (!matchesCategory) return false;

     
      const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      
      if (priceRange === "under150") return p.price < 150;
      if (priceRange === "150to200") return p.price >= 150 && p.price <= 200;
      if (priceRange === "over200") return p.price > 200;

      return true;
    });

  
  
  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} showSearch={true} />

      {!searchTerm.trim() && (
        <>
          <div className="hero-video">
            <video autoPlay loop muted playsInline className="hero-video-tag">
              <source src="/video/main.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay">
              <h1 className="hero-title">Premium Alloy Wheels</h1>
              <p className="hero-sub">Performance • Style • Precision</p>
            </div>
          </div>

          <div className="container mt-4 mb-2">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="text-muted fw-bold me-2">Category:</span>
                <button
                  className={`filter-pill ${selectedCategory === "All" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("All")}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-pill ${selectedCategory === cat.name ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted fw-bold me-2">Price:</span>
                <select
                  className="price-select"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#eef2f3",
                    borderRadius: "12px",
                    padding: "6px 12px",
                    fontWeight: "600",
                    outline: "none"
                  }}
                >
                  <option value="All">All Prices</option>
                  <option value="under150">Under $150</option>
                  <option value="150to200">$150 - $200</option>
                  <option value="over200">Over $200</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {searchTerm.trim() ? (
        <div className="container mt-5">
          <h2 className="product-head">Search Results for "{searchTerm}"</h2>
          <div className="row g-3">
            {products
              .filter((p) => p.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((p) => (
                <ProductCard key={p.id} p={p} addToCart={addToCart} />
              ))}
            {products.filter((p) => p.product_name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <p className="text-center text-muted mt-5">No products found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="container mt-4">
          {categories
            .filter((cat) => selectedCategory === "All" || cat.name === selectedCategory)
            .map((cat) => {
              const catProducts = filter(cat.name);
              return (
                <div key={cat.id} className="mb-5">
                  <h2 className="product-head mt-4">
                    {cat.name.toLowerCase().includes("racing") ||
                    cat.name.toLowerCase().includes("wheels")
                      ? cat.name
                      : `${cat.name} Wheels`}
                  </h2>
                  <div className="row g-3">
                    {catProducts.map((p) => (
                      <ProductCard key={p.id} p={p} addToCart={addToCart} />
                    ))}
                    {catProducts.length === 0 && (
                      <p className="text-center text-muted py-3">
                        No products available in this category
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* About Section */}
      <div id="about-section" className="about-section mt-5 py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 about-content">
              <h2 className="about-heading mb-4">About AlloyCraft</h2>
              <p className="about-text">
                At AlloyCraft, we believe that wheels are not just a component of your vehicle, but a statement of your personal style and a commitment to performance. We curate the finest selection of premium alloy wheels from world-class manufacturers like Advan, BBS, and Volk Racing.
              </p>
              <p className="about-text">
                Every product in our catalog represents the pinnacle of automotive engineering, combining lightweight strength, precise geometry, and timeless aesthetic designs. Whether you're tracking your car or elevating your daily commute, AlloyCraft delivers the perfect match.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="about-cards-grid">
                <div className="about-feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h4>Lightweight Strength</h4>
                  <p>Forged and flow-formed designs engineered to reduce unsprung weight while keeping peak structural integrity.</p>
                </div>
                <div className="about-feature-card">
                  <div className="feature-icon">⚡</div>
                  <h4>Optimal Performance</h4>
                  <p>Enhanced heat dissipation and aerodynamic efficiency for superior handling and braking response.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <h3 className="footer-logo">Alloy Craft</h3>

          <p className="footer-text">
            Alloy Craft provides premium alloy wheels crafted for performance,
            durability, and style.
          </p>

          <p className="footer-since">
            Established since <strong>2025</strong>
          </p>

          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Alloy Craft. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

function ProductCard({ p, addToCart }) {
  return (
    <div className="col-12 col-md-6 col-lg-4 card-wrap">
      <div className="card product-card">
        <img src={p.image_url} className="card-img-top" alt={p.product_name} />
        <div className="card-body text-center">
          <h5>{p.product_name}</h5>
          <p>Inch: {p.inch}</p>
          <h6>Price: ${p.price}</h6>
          <button className="button-card" onClick={() => addToCart(p)}>
            <FaCartArrowDown />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
