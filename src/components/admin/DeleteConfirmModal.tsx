"use client";

import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  beerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  beerName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setConfirmed(false);
    onCancel();
  };

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={!isDeleting ? handleClose : undefined}
      />

      <div className="admin-delete-modal relative w-full max-w-md mx-4">
        {/* Header */}
        <div className="admin-delete-header">
          <span style={{ fontFamily: "var(--font-h)", fontSize: "1rem", color: "var(--troebel-gold)" }}>
            pas op!
          </span>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", textTransform: "uppercase", color: "var(--warm-white)", marginTop: ".2rem" }}>
            Bier Verwijderen
          </h2>
        </div>

        <div className="admin-delete-body">
          <p style={{ fontFamily: "var(--font-b)", textAlign: "center", color: "var(--mid)", marginBottom: ".5rem" }}>
            Je staat op het punt om
          </p>
          <p style={{ fontFamily: "var(--font-d)", fontSize: "1.3rem", textAlign: "center", textTransform: "uppercase", color: "var(--dark)", marginBottom: ".75rem" }}>
            &quot;{beerName}&quot;
          </p>
          <p style={{ fontFamily: "var(--font-b)", fontSize: ".875rem", textAlign: "center", color: "var(--mid)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            te verwijderen. Dit verwijdert ook alle varianten en kan{" "}
            <strong style={{ color: "var(--dark)" }}>niet ongedaan</strong> worden gemaakt.
          </p>

          <label className="admin-delete-confirm-check">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isDeleting}
              style={{ width: 18, height: 18, flexShrink: 0, accentColor: "#dc2626" }}
            />
            <span style={{ fontFamily: "var(--font-b)", fontSize: ".875rem", color: "#991b1b" }}>
              Ja, ik wil dit bier permanent verwijderen
            </span>
          </label>

          <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="btn-outline"
              style={{ flex: 1, justifyContent: "center", opacity: isDeleting ? .5 : 1 }}
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!confirmed || isDeleting}
              className="admin-delete-btn"
              style={{ flex: 1, opacity: (!confirmed || isDeleting) ? .5 : 1, cursor: (!confirmed || isDeleting) ? "not-allowed" : "pointer" }}
            >
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
