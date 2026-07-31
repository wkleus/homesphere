import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import "./ConfirmModal.css";

/* Generic confirmation modal (portal, same overlay/window animation
   pattern as MapModal). Used e.g. for "delete entry" confirmations in
   the admin dashboard, replacing the native window.confirm() dialog
   for a consistent look and feel with the rest of the app. */
const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirming = false,
}) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <motion.div
      className="confirm-overlay"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="confirm-window"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <AlertTriangle size={32} className="confirm-icon" />
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-cancel-btn"
            onClick={onCancel}
            disabled={confirming}
          >
            {cancelLabel}
          </button>
          <button
            className="confirm-delete-btn"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "..." : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    modalRoot,
  );
};

export default ConfirmModal;
