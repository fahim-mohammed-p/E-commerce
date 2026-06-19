import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import api from "../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

function Category() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login");
      return;
    }
    api.get("products/category/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Fetch categories error", err));
  }, [navigate]);

  const addCategory = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const exists = categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editId
    );
    if (exists) {
      toast.warning("This category already exists");
      return;
    }

    if (editId) {
      try {
        const res = await api.put(`products/category/${editId}/`, {
          name: name.trim(),
        });
        const updatedCategory = res.data;
        setCategories(
          categories.map((c) => (c.id === editId ? updatedCategory : c))
        );
        clearForm();
        toast.success("Category updated successfully");
      } catch (err) {
        console.log("Update category failed", err);
        toast.error("Failed to update category");
      }
      return;
    }

    try {
      const res = await api.post("products/category/", {
        name: name.trim(),
      });
      const savedCategory = res.data;
      setCategories([...categories, savedCategory]);
      clearForm();
      toast.success("Category added successfully");
    } catch (err) {
      console.log("Create category failed", err);
      toast.error("Failed to add category");
    }
  };

  const deleteCategory = (id, catName) => {
    setDeleteTarget({ id, name: catName });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`products/category/${deleteTarget.id}/`);
      setCategories(categories.filter((c) => c.id !== deleteTarget.id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.log("Delete category failed", err);
      toast.error("Failed to delete category");
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const editCategory = (category) => {
    setName(category.name);
    setEditId(category.id);
  };

  const clearForm = () => {
    setName("");
    setEditId(null);
  };

  return (
    <div className="dash-container">
      <h2 className="dash-title">Admin Categories</h2>

      <div className="add-category-card">
        <h3>{editId ? "Edit Category" : "Add Category"}</h3>

        <input
          className="dash-input"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="btn-group-row">
          <button className="dash-btn" onClick={addCategory}>
            <IoMdAddCircle />
            {editId ? "Update Category" : "Add Category"}
          </button>
          {editId && (
            <button className="cancel-btn" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <hr />

      <h3 className="list-title">All Categories</h3>

      <div className="category-list">
        {categories.length === 0 && (
          <p className="text-muted text-center">No categories found</p>
        )}

        {categories.map((c) => (
          <div key={c.id} className="category-item">
            <div className="category-info">
              <strong>{c.name}</strong>
            </div>

            <div className="action-buttons">
              <button className="edit-btn" onClick={() => editCategory(c)}>
                <BiSolidEdit />
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteCategory(c.id, c.name)}
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? Associated products will also be deleted.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

export default Category;
