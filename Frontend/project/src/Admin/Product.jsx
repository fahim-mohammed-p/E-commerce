import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import api from "../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

import { BiSolidEdit } from "react-icons/bi";
import { MdDelete, MdCancel } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [inch, setInch] = useState("");
  const [editId, setEditId]= useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login");
      return;

    }

    api.get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Fetch products error", err));

    api.get("products/category/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Fetch categories error", err));
  }, [navigate]);

  const addProduct = async() => {
    if (!name.trim() || !category || !price || !image.trim() || !inch) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      product_name: name,
      category: Number(category),
      price: Number(price),
      inch: Number(inch),
      image_url: image,
    };

    if(editId){
      try{
        const res=await api.put(`products/${editId}/`, payload);
        const updateProduct = res.data;
        setProducts(products.map((p)=>(p.id===editId ? updateProduct : p)))
        clearform();
        toast.success("Product updated successfully");
      }catch(err){
        console.log("failed",err);
        let errMsg = "Failed to update product";
        if (err.response && err.response.data) {
          const errorData = err.response.data;
          if (typeof errorData === "object") {
            const keys = Object.keys(errorData);
            if (keys.length > 0) {
              const firstKey = keys[0];
              const messages = errorData[firstKey];
              errMsg = Array.isArray(messages) ? `${firstKey}: ${messages[0]}` : `${firstKey}: ${messages}`;
            }
          }
        }
        toast.error(errMsg);
      }
      return;
    }
    try{
      const res=await api.post("products/", payload);
      const savedProduct= res.data;
      setProducts([...products,savedProduct]);
      clearform();
      toast.success("Product added successfully");
    }catch(err){
      console.log("Failed",err);
      let errMsg = "Failed to add product";
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (typeof errorData === "object") {
          const keys = Object.keys(errorData);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const messages = errorData[firstKey];
            errMsg = Array.isArray(messages) ? `${firstKey}: ${messages[0]}` : `${firstKey}: ${messages}`;
          }
        }
      }
      toast.error(errMsg);
    }
  }

  const deleteProduct = (id, prodName) => {
    setDeleteTarget({ id, name: prodName });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`products/${deleteTarget.id}/`);
      setProducts(products.filter((p) => p.id !== deleteTarget.id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.log("Failed", err);
      toast.error("Failed to delete product");
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const editProduct=(product)=>{
    setName(product.product_name);
    setCategory(product.category);
    setPrice(product.price);
    setImage(product.image_url);
    setInch(product.inch);
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearform=()=>{
    setName("");
    setCategory("");
    setPrice("");
    setImage("");
    setInch("");
    setEditId(null);
  }


  return (
    <div className="dash-container">
      <h2 className="dash-title">Admin Products</h2>

      <div className="add-product">
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>

        <input
          className="dash-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="dash-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          className="dash-input"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="dash-input"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          className="dash-input"
          placeholder="Inch"
          value={inch}
          onChange={(e) => setInch(e.target.value)}
        />

        <div className="btn-group">
          <button className="dash-btn" onClick={addProduct}>
            {editId ? <BiSolidEdit /> : <IoMdAddCircle />}
            {editId ? "Update Product" : "Add Product"}
          </button>
          {editId && (
            <button className="cancel-btn" onClick={clearform}>
              <MdCancel />Cancel
            </button>
          )}
        </div>
      </div>

      <hr />

      <h3 className="list-title">All Products</h3>

      <div className="product-list">
        {products.length === 0 && <p>No products found</p>}

        {products.map((p) => (
          <div key={p.id} className="product-item">
            <img src={p.image_url} alt={p.product_name} className="product-img" />

            <div className="product-info">
              <strong>{p.product_name}</strong>
              <p>Category: {p.category_name}</p>
              <p>Price: ${p.price}</p>
              <p>Inch: {p.inch}</p>
            </div>
            <button className="edit-btn" onClick={()=> editProduct(p)}>
              <BiSolidEdit />
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteProduct(p.id, p.product_name)}
            >
              <MdDelete />
              Delete
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Product"
        message={`Are you sure you want to delete product "${deleteTarget?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

export default Product;


