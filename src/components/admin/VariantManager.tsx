"use client";

import { useState } from "react";
import { BeerVariant, VariantType, VARIANT_TYPE_OPTIONS } from "@/types/beer";
import {
  createVariant,
  updateVariant,
  deleteVariant,
  adjustStock,
  toggleAvailability,
  CreateVariantData,
} from "@/lib/api/admin";

interface VariantManagerProps {
  beerId: string;
  variants: BeerVariant[];
  onVariantsChange: (variants: BeerVariant[]) => void;
}

interface NewVariantForm {
  type: VariantType;
  size: string;
  label: string;
  price: number;
  stock: number;
}

export default function VariantManager({
  beerId,
  variants,
  onVariantsChange,
}: VariantManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BeerVariant>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariant, setNewVariant] = useState<NewVariantForm>({
    type: "bottle",
    size: "33cl",
    label: "Flesje 33cl",
    price: 3.0,
    stock: 100,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockAdjust = async (variantId: string, adjustment: number) => {
    setSaving(true);
    setError(null);

    const result = await adjustStock(variantId, adjustment);

    if (result.success && result.newStock !== undefined) {
      const updatedVariants = variants.map((v) =>
        v.id === variantId
          ? { ...v, stock: result.newStock!, isAvailable: v.isAvailable && result.newStock! > 0 }
          : v
      );
      onVariantsChange(updatedVariants);
    } else {
      setError(result.error || "Stock aanpassen mislukt");
    }

    setSaving(false);
  };

  const handleToggleAvailability = async (variantId: string) => {
    setSaving(true);
    setError(null);

    const result = await toggleAvailability(variantId);

    if (result.success && result.isAvailable !== undefined) {
      const updatedVariants = variants.map((v) =>
        v.id === variantId ? { ...v, isAvailable: result.isAvailable! } : v
      );
      onVariantsChange(updatedVariants);
    } else {
      setError(result.error || "Beschikbaarheid wijzigen mislukt");
    }

    setSaving(false);
  };

  const handleStartEdit = (variant: BeerVariant) => {
    setEditingId(variant.id);
    setEditForm({
      label: variant.label,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    setSaving(true);
    setError(null);

    const result = await updateVariant(editingId, {
      label: editForm.label,
      size: editForm.size,
      price: editForm.price,
      stock: editForm.stock,
    });

    if (result.success && result.variant) {
      const updatedVariants = variants.map((v) =>
        v.id === editingId ? result.variant! : v
      );
      onVariantsChange(updatedVariants);
      setEditingId(null);
      setEditForm({});
    } else {
      setError(result.error || "Opslaan mislukt");
    }

    setSaving(false);
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Weet je zeker dat je deze variant wilt verwijderen?")) {
      return;
    }

    setSaving(true);
    setError(null);

    const result = await deleteVariant(variantId);

    if (result.success) {
      const updatedVariants = variants.filter((v) => v.id !== variantId);
      onVariantsChange(updatedVariants);
    } else {
      setError(result.error || "Verwijderen mislukt");
    }

    setSaving(false);
  };

  const handleAddVariant = async () => {
    setSaving(true);
    setError(null);

    const data: CreateVariantData = {
      beer: beerId,
      type: newVariant.type,
      size: newVariant.size,
      label: newVariant.label,
      price: newVariant.price,
      stock: newVariant.stock,
      isAvailable: true,
      sortOrder: variants.length,
    };

    const result = await createVariant(data);

    if (result.success && result.variant) {
      onVariantsChange([...variants, result.variant]);
      setShowAddForm(false);
      setNewVariant({
        type: "bottle",
        size: "33cl",
        label: "Flesje 33cl",
        price: 3.0,
        stock: 100,
      });
    } else {
      setError(result.error || "Toevoegen mislukt");
    }

    setSaving(false);
  };

  const updateNewVariantLabel = (type: VariantType, size: string) => {
    const labels: Record<VariantType, string> = {
      bottle: `Flesje ${size}`,
      crate: `Bak ${size}`,
      keg: `Vat ${size}`,
      custom: `Anders ${size}`,
    };
    return labels[type];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-dark">Varianten</h3>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || saving}
          className="px-3 py-1 text-sm font-heading bg-yellow text-dark border-2 border-dark hover:bg-dark hover:text-yellow transition-colors disabled:opacity-50"
        >
          + Variant
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-3 py-2 font-body text-sm">
          {error}
        </div>
      )}

      {/* Variant List */}
      <div className="space-y-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className={`border-2 p-3 ${
              variant.isAvailable
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            {editingId === variant.id ? (
              /* Edit Mode */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs text-gray-600 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={editForm.label || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, label: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-dark text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-gray-600 mb-1">
                      Grootte
                    </label>
                    <input
                      type="text"
                      value={editForm.size || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, size: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-dark text-sm font-body"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs text-gray-600 mb-1">
                      Prijs (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price || 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: parseFloat(e.target.value) })
                      }
                      className="w-full px-2 py-1 border border-dark text-sm font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-gray-600 mb-1">
                      Voorraad
                    </label>
                    <input
                      type="number"
                      value={editForm.stock || 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, stock: parseInt(e.target.value) })
                      }
                      className="w-full px-2 py-1 border border-dark text-sm font-body"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-3 py-1 text-xs font-heading bg-yellow text-dark border border-dark hover:bg-dark hover:text-yellow disabled:opacity-50"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-3 py-1 text-xs font-body text-gray-600 hover:text-dark"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-sm text-dark">
                      {variant.label}
                    </span>
                    <span className="font-body text-sm text-gray-600">
                      €{variant.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body text-xs text-gray-500">
                      Voorraad:
                    </span>
                    <button
                      onClick={() => handleStockAdjust(variant.id, -10)}
                      disabled={saving || variant.stock < 10}
                      className="w-6 h-6 text-xs border border-dark hover:bg-gray-200 disabled:opacity-50"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleStockAdjust(variant.id, -1)}
                      disabled={saving || variant.stock < 1}
                      className="w-6 h-6 text-xs border border-dark hover:bg-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-body text-sm font-semibold min-w-[40px] text-center">
                      {variant.stock}
                    </span>
                    <button
                      onClick={() => handleStockAdjust(variant.id, 1)}
                      disabled={saving}
                      className="w-6 h-6 text-xs border border-dark hover:bg-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleStockAdjust(variant.id, 10)}
                      disabled={saving}
                      className="w-6 h-6 text-xs border border-dark hover:bg-gray-200 disabled:opacity-50"
                    >
                      +10
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailability(variant.id)}
                    disabled={saving}
                    className={`px-2 py-1 text-xs font-body border ${
                      variant.isAvailable
                        ? "border-green-600 text-green-700 hover:bg-green-100"
                        : "border-red-600 text-red-700 hover:bg-red-100"
                    } disabled:opacity-50`}
                  >
                    {variant.isAvailable ? "Beschikbaar" : "Niet beschikbaar"}
                  </button>
                  <button
                    onClick={() => handleStartEdit(variant)}
                    disabled={saving}
                    className="px-2 py-1 text-xs font-body text-gray-600 hover:text-dark border border-gray-300 hover:border-dark disabled:opacity-50"
                  >
                    Bewerk
                  </button>
                  <button
                    onClick={() => handleDeleteVariant(variant.id)}
                    disabled={saving}
                    className="px-2 py-1 text-xs font-body text-red-600 hover:text-red-800 border border-red-300 hover:border-red-600 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Variant Form */}
      {showAddForm && (
        <div className="border-2 border-dashed border-yellow p-4 bg-yellow/10">
          <h4 className="font-heading text-sm text-dark mb-3">Nieuwe variant</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-xs text-gray-600 mb-1">
                Type
              </label>
              <select
                value={newVariant.type}
                onChange={(e) => {
                  const type = e.target.value as VariantType;
                  const label = updateNewVariantLabel(type, newVariant.size);
                  setNewVariant({ ...newVariant, type, label });
                }}
                className="w-full px-2 py-1 border border-dark text-sm font-body"
              >
                {VARIANT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-xs text-gray-600 mb-1">
                Grootte
              </label>
              <input
                type="text"
                value={newVariant.size}
                onChange={(e) => {
                  const size = e.target.value;
                  const label = updateNewVariantLabel(newVariant.type, size);
                  setNewVariant({ ...newVariant, size, label });
                }}
                placeholder="bijv. 33cl, 24x33cl, 20L"
                className="w-full px-2 py-1 border border-dark text-sm font-body"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block font-body text-xs text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={newVariant.label}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, label: e.target.value })
                }
                className="w-full px-2 py-1 border border-dark text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-body text-xs text-gray-600 mb-1">
                Prijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={newVariant.price}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, price: parseFloat(e.target.value) })
                }
                className="w-full px-2 py-1 border border-dark text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-body text-xs text-gray-600 mb-1">
                Voorraad
              </label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })
                }
                className="w-full px-2 py-1 border border-dark text-sm font-body"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddVariant}
              disabled={saving}
              className="px-4 py-2 text-sm font-heading bg-yellow text-dark border-2 border-dark hover:bg-dark hover:text-yellow disabled:opacity-50"
            >
              {saving ? "Toevoegen..." : "Toevoegen"}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-body text-gray-600 hover:text-dark"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {variants.length === 0 && !showAddForm && (
        <p className="font-body text-sm text-gray-500 text-center py-4">
          Geen varianten. Klik op &quot;+ Variant&quot; om toe te voegen.
        </p>
      )}
    </div>
  );
}
