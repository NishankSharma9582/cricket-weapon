import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert } from "lucide-react";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onCancel?.();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="glass-strong relative w-full max-w-sm rounded-2xl p-6 shadow-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
              <TriangleAlert size={24} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
            <p className="mt-1.5 text-sm text-ink-500">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancel} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;