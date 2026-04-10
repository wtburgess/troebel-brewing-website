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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={!isDeleting ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-md mx-4 border-4 border-dark"
        style={{ boxShadow: "8px 8px 0px var(--color-red, #ef4444)" }}
      >
        {/* Header */}
        <div className="bg-red-500 text-white px-6 py-4">
          <h2 className="font-heading text-xl">BIER VERWIJDEREN</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Icon */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-500 text-4xl rounded-full mb-4">
              !
            </div>
          </div>

          <p className="font-body text-center text-gray-700 mb-2">
            Je staat op het punt om
          </p>
          <p className="font-heading text-xl text-center text-dark mb-4">
            &quot;{beerName}&quot;
          </p>
          <p className="font-body text-center text-gray-600 mb-6">
            te verwijderen. Dit verwijdert ook alle varianten (flesjes, bakken,
            vaten) en kan <strong>niet ongedaan</strong> worden gemaakt.
          </p>

          {/* Confirmation Checkbox */}
          <label className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 cursor-pointer mb-6 hover:bg-red-100 transition-colors">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isDeleting}
              className="w-5 h-5 border-2 border-red-500 accent-red-500"
            />
            <span className="font-body text-sm text-red-800">
              Ja, ik weet zeker dat ik dit bier wil verwijderen
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 font-heading text-dark border-2 border-dark hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!confirmed || isDeleting}
              className="flex-1 px-4 py-3 font-heading text-white bg-red-500 border-2 border-red-600 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: confirmed ? "4px 4px 0px var(--color-dark)" : "none",
              }}
            >
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
