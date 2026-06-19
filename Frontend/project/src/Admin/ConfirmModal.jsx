import React from "react";
import "./ConfirmModal.css";
import { MdDelete, MdCancel } from "react-icons/md";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-btn-yes" onClick={onConfirm}>
            <MdDelete size={18} /> Delete
          </button>
          <button className="confirm-btn-no" onClick={onCancel}>
            <MdCancel size={18} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
