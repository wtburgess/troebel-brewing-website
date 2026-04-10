"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Beer, BeerCategory, BeerVariant, VariantType, VARIANT_TYPE_OPTIONS } from "@/types/beer";
import {
  createBeer,
  updateBeer,
  validateImageFile,
  generateSlug,
  CreateBeerData,
  createVariant,
  updateVariant,
  deleteVariant,
  adjustStock,
  toggleAvailability,
  CreateVariantData,
} from "@/lib/api/admin";

interface BeerEditModalProps {
  beer: Beer | null; // null = creating new beer
  isOpen: boolean;
  onClose: () => void;
  onSaved: (beer: Beer) => void;
  onVariantsUpdated?: (beerId: string, variants: BeerVariant[]) => void;
}

const CATEGORY_OPTIONS: { value: BeerCategory; label: string }[] = [
  { value: "tripel", label: "Tripel" },
  { value: "blond", label: "Blond" },
  { value: "ipa", label: "IPA" },
  { value: "pale-ale", label: "Pale Ale" },
  { value: "saison", label: "Saison" },
  { value: "session", label: "Session" },
  { value: "seasonal", label: "Seizoens" },
];

type TabType = "details" | "variants";

interface NewVariantForm {
  type: VariantType;
  customType: string;
  size: string;
  label: string;
  price: number;
  stock: number;
}

const initialVariantForm: NewVariantForm = {
  type: "bottle",
  customType: "",
  size: "33cl",
  label: "Flesje 33cl",
  price: 2.5,
  stock: 100,
};

export default function BeerEditModal({
  beer,
  isOpen,
  onClose,
  onSaved,
  onVariantsUpdated,
}: BeerEditModalProps) {
  const isCreating = beer === null;
  const [activeTab, setActiveTab] = useState<TabType>("details");

  // Form state for beer details
  const [formData, setFormData] = useState<Partial<CreateBeerData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBeer, setSavedBeer] = useState<Beer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variant management state
  const [variants, setVariants] = useState<BeerVariant[]>([]);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editVariantForm, setEditVariantForm] = useState<Partial<BeerVariant>>({});
  const [newVariant, setNewVariant] = useState<NewVariantForm>(initialVariantForm);
  const [variantSaving, setVariantSaving] = useState(false);

  // Initialize form data when beer changes
  useEffect(() => {
    if (beer) {
      setFormData({
        name: beer.name,
        slug: beer.slug,
        style: beer.style,
        category: beer.category,
        description: beer.description,
        longDescription: beer.longDescription || "",
        abv: beer.abv,
        ibu: beer.ibu || undefined,
        rating: beer.rating || undefined,
        ratingCount: beer.ratingCount || undefined,
        tastingNotes: beer.tastingNotes?.join(", ") || "",
        foodPairings: beer.foodPairings?.join(", ") || "",
        isNew: beer.isNew || false,
        isLimited: beer.isLimited || false,
        isFeatured: beer.isFeatured || false,
        sortOrder: beer.sortOrder || 0,
      });
      setVariants(beer.variants || []);
      setSavedBeer(beer);
      setImagePreview(null);
      setImageFile(null);
    } else {
      // New beer - reset form
      setFormData({
        name: "",
        slug: "",
        style: "",
        category: "blond",
        description: "",
        longDescription: "",
        abv: 5.0,
        ibu: undefined,
        isNew: true,
        isLimited: false,
        isFeatured: false,
        sortOrder: 0,
      });
      setVariants([]);
      setSavedBeer(null);
      setImagePreview(null);
      setImageFile(null);
    }
    setError(null);
    setActiveTab("details");
  }, [beer]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    } else if (name === "name" && isCreating) {
      // Auto-generate slug from name when creating
      const slug = generateSlug(value);
      setFormData((prev) => ({ ...prev, name: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isCreating || !savedBeer) {
        // Validate required fields for new beer
        if (!formData.name || !formData.style || !formData.description) {
          setError("Vul alle verplichte velden in");
          setSaving(false);
          return;
        }

        if (!imageFile && !imagePreview) {
          setError("Voeg een afbeelding toe");
          setSaving(false);
          return;
        }

        const result = await createBeer(formData as CreateBeerData, imageFile || undefined);

        if (result.success && result.beer) {
          const newBeer: Beer = {
            ...result.beer,
            image: imagePreview || result.beer.image,
            variants: [],
          };
          setSavedBeer(newBeer);
          setActiveTab("variants"); // Switch to variants tab after creating
          setError(null);
        } else {
          setError(result.error || "Aanmaken mislukt");
        }
      } else {
        // Updating existing beer
        const result = await updateBeer(savedBeer.id, formData, imageFile || undefined);

        if (result.success && result.beer) {
          const updatedBeer: Beer = {
            ...result.beer,
            variants: variants,
            image: imagePreview || savedBeer.image,
          };
          setSavedBeer(updatedBeer);
          onSaved(updatedBeer);
          setError(null);
        } else {
          setError(result.error || "Opslaan mislukt");
        }
      }
    } catch {
      setError("Er ging iets mis bij het opslaan");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // If we created/updated a beer, call onSaved before closing
    if (savedBeer && (isCreating || variants !== beer?.variants)) {
      onSaved({ ...savedBeer, variants });
    }
    onClose();
  };

  // ============ Variant Management Functions ============

  const updateVariantLabel = (type: VariantType | string, size: string, customType: string): string => {
    if (type === "custom" && customType) {
      return `${customType} ${size}`;
    }
    const labels: Record<string, string> = {
      bottle: `Flesje ${size}`,
      crate: `Bak ${size}`,
      keg: `Vat ${size}`,
    };
    return labels[type] || `${type} ${size}`;
  };

  const handleAddVariant = async () => {
    if (!savedBeer) return;

    setVariantSaving(true);
    setError(null);

    const variantType = newVariant.type === "custom" ? newVariant.customType : newVariant.type;

    const data: CreateVariantData = {
      beer: savedBeer.id,
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
      const updatedVariants = [...variants, result.variant];
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
      setNewVariant(initialVariantForm);
    } else {
      setError(result.error || "Variant toevoegen mislukt");
    }

    setVariantSaving(false);
  };

  const handleStartEditVariant = (variant: BeerVariant) => {
    setEditingVariantId(variant.id);
    setEditVariantForm({
      label: variant.label,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
    });
  };

  const handleSaveVariantEdit = async () => {
    if (!editingVariantId || !savedBeer) return;

    setVariantSaving(true);
    setError(null);

    const result = await updateVariant(editingVariantId, {
      label: editVariantForm.label,
      size: editVariantForm.size,
      price: editVariantForm.price,
      stock: editVariantForm.stock,
    });

    if (result.success && result.variant) {
      const updatedVariants = variants.map((v) =>
        v.id === editingVariantId ? result.variant! : v
      );
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
      setEditingVariantId(null);
      setEditVariantForm({});
    } else {
      setError(result.error || "Opslaan mislukt");
    }

    setVariantSaving(false);
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!savedBeer) return;
    if (!confirm("Weet je zeker dat je deze variant wilt verwijderen?")) return;

    setVariantSaving(true);
    setError(null);

    const result = await deleteVariant(variantId);

    if (result.success) {
      const updatedVariants = variants.filter((v) => v.id !== variantId);
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
    } else {
      setError(result.error || "Verwijderen mislukt");
    }

    setVariantSaving(false);
  };

  const handleStockAdjust = async (variantId: string, adjustment: number) => {
    if (!savedBeer) return;

    setVariantSaving(true);

    const result = await adjustStock(variantId, adjustment);

    if (result.success && result.newStock !== undefined) {
      const updatedVariants = variants.map((v) =>
        v.id === variantId
          ? { ...v, stock: result.newStock!, isAvailable: v.isAvailable && result.newStock! > 0 }
          : v
      );
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
    }

    setVariantSaving(false);
  };

  const handleToggleAvailability = async (variantId: string) => {
    if (!savedBeer) return;

    setVariantSaving(true);

    const result = await toggleAvailability(variantId);

    if (result.success && result.isAvailable !== undefined) {
      const updatedVariants = variants.map((v) =>
        v.id === variantId ? { ...v, isAvailable: result.isAvailable! } : v
      );
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
    }

    setVariantSaving(false);
  };

  const canAccessVariants = savedBeer !== null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 md:p-10 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white w-full max-w-[900px] rounded-sm shadow-xl flex flex-col my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-heading text-2xl text-dark m-0 !text-2xl">
            {isCreating ? "Nieuw Bier Toevoegen" : `Bier Bewerken: ${beer?.name}`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-dark text-2xl leading-none transition-colors"
            aria-label="Sluiten"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-heading text-base border-b-3 transition-colors ${
                activeTab === "details"
                  ? "text-dark border-primary"
                  : "text-gray-500 border-transparent hover:text-dark"
              }`}
            >
              Details & Info
            </button>
            <button
              onClick={() => canAccessVariants && setActiveTab("variants")}
              disabled={!canAccessVariants}
              className={`px-6 py-3 font-heading text-base border-b-3 transition-colors ${
                activeTab === "variants"
                  ? "text-dark border-primary"
                  : "text-gray-500 border-transparent hover:text-dark"
              } ${!canAccessVariants ? "opacity-50 cursor-not-allowed" : ""}`}
              title={!canAccessVariants ? "Sla eerst de bierdetails op" : ""}
            >
              Varianten & Voorraad
              {!canAccessVariants && (
                <span className="ml-2 text-xs text-gray-400">(eerst opslaan)</span>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 mb-4 rounded-sm text-sm">
              {error}
            </div>
          )}

          {/* Tab Content: Details */}
          {activeTab === "details" && (
            <form onSubmit={handleSaveDetails}>
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                {/* Left Column - Main Info */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">Naam *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Bijv. Brews Almighty"
                    />
                  </div>

                  {/* Slug */}
                  <div className="form-group">
                    <label className="form-label">Slug (URL)</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug || ""}
                      onChange={handleInputChange}
                      disabled={!isCreating}
                      className="form-input bg-gray-50"
                      placeholder="brews-almighty"
                    />
                  </div>

                  {/* Category & Style */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Categorie *</label>
                      <select
                        name="category"
                        value={formData.category || "blond"}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stijl Label</label>
                      <input
                        type="text"
                        name="style"
                        value={formData.style || ""}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Tripel"
                      />
                    </div>
                  </div>

                  {/* ABV & IBU */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">ABV (%)</label>
                      <input
                        type="number"
                        name="abv"
                        value={formData.abv ?? ""}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        max="20"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">IBU</label>
                      <input
                        type="number"
                        name="ibu"
                        value={formData.ibu ?? ""}
                        onChange={handleInputChange}
                        min="0"
                        max="150"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="form-group">
                    <label className="form-label">Korte Beschrijving (Card)</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={3}
                      placeholder="Een krachtige tripel met fruitige toetsen en een zachte afdronk."
                    />
                  </div>

                  {/* Long Description */}
                  <div className="form-group">
                    <label className="form-label">Lange Beschrijving (Detail Page)</label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription || ""}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={4}
                      placeholder="Onze klassieker. Brews Almighty is een eerbetoon aan de traditionele Belgische tripel..."
                    />
                  </div>
                </div>

                {/* Right Column - Image & Status */}
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="form-group">
                    <label className="form-label">Afbeelding</label>
                    <div
                      className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer h-[200px] flex flex-col items-center justify-center bg-gray-50 hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {(imagePreview || (beer && beer.image)) ? (
                        <>
                          <div className="relative h-[120px] w-full mb-2">
                            <Image
                              src={imagePreview || beer?.image || ""}
                              alt="Preview"
                              fill
                              className="object-contain"
                              sizes="200px"
                            />
                          </div>
                          <span className="text-xs text-gray-600 underline">Wijzig afbeelding</span>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl text-gray-300 mb-2">📷</div>
                          <span className="text-sm text-gray-500">Klik of sleep een afbeelding</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Max 5MB</span>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Status & Visibility */}
                  <div className="form-group">
                    <label className="form-label">Status & Zichtbaarheid</label>
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured || false}
                          onChange={handleInputChange}
                          className="w-[18px] h-[18px] accent-primary"
                        />
                        <span className="text-sm">Toon op Homepage (Line-up)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew || false}
                          onChange={handleInputChange}
                          className="w-[18px] h-[18px] accent-primary"
                        />
                        <span className="text-sm">Markeer als NIEUW</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isLimited"
                          checked={formData.isLimited || false}
                          onChange={handleInputChange}
                          className="w-[18px] h-[18px] accent-primary"
                        />
                        <span className="text-sm">Markeer als SEIZOEN</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button for Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-primary text-dark font-heading uppercase tracking-wide border-2 border-dark hover:bg-dark hover:text-primary transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Opslaan..."
                    : isCreating && !savedBeer
                    ? "Opslaan & Ga naar Varianten"
                    : "Wijzigingen Opslaan"}
                </button>
              </div>
            </form>
          )}

          {/* Tab Content: Variants */}
          {activeTab === "variants" && canAccessVariants && (
            <div>
              {/* Existing Variants List */}
              <div className="bg-gray-50 p-4 border border-gray-200 mb-6">
                {variants.length > 0 ? (
                  <div className="space-y-3">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        {editingVariantId === variant.id ? (
                          /* Inline Edit Mode */
                          <div className="w-full">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Label</label>
                                <input
                                  type="text"
                                  value={editVariantForm.label || ""}
                                  onChange={(e) =>
                                    setEditVariantForm({ ...editVariantForm, label: e.target.value })
                                  }
                                  className="form-input text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Maat</label>
                                <input
                                  type="text"
                                  value={editVariantForm.size || ""}
                                  onChange={(e) =>
                                    setEditVariantForm({ ...editVariantForm, size: e.target.value })
                                  }
                                  className="form-input text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Prijs (€)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editVariantForm.price ?? ""}
                                  onChange={(e) =>
                                    setEditVariantForm({ ...editVariantForm, price: parseFloat(e.target.value) })
                                  }
                                  className="form-input text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                                <input
                                  type="number"
                                  value={editVariantForm.stock ?? ""}
                                  onChange={(e) =>
                                    setEditVariantForm({ ...editVariantForm, stock: parseInt(e.target.value) })
                                  }
                                  className="form-input text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveVariantEdit}
                                disabled={variantSaving}
                                className="px-3 py-1 text-sm bg-primary text-dark border border-dark hover:bg-dark hover:text-primary disabled:opacity-50"
                              >
                                Opslaan
                              </button>
                              <button
                                onClick={() => {
                                  setEditingVariantId(null);
                                  setEditVariantForm({});
                                }}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-dark"
                              >
                                Annuleren
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* View Mode */
                          <>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                              <strong className="w-[120px]">{variant.label}</strong>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  variant.isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {variant.isAvailable ? "Beschikbaar" : "Niet beschikbaar"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                              <span className="text-sm">€ {variant.price.toFixed(2)}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-500">Voorraad:</span>
                                <button
                                  onClick={() => handleStockAdjust(variant.id, -1)}
                                  disabled={variantSaving || variant.stock < 1}
                                  className="w-6 h-6 border border-gray-300 hover:border-dark text-xs disabled:opacity-30"
                                >
                                  -
                                </button>
                                <strong className="w-10 text-center">{variant.stock}</strong>
                                <button
                                  onClick={() => handleStockAdjust(variant.id, 1)}
                                  disabled={variantSaving}
                                  className="w-6 h-6 border border-gray-300 hover:border-dark text-xs disabled:opacity-30"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleToggleAvailability(variant.id)}
                                disabled={variantSaving}
                                className={`px-2 py-1 text-xs border ${
                                  variant.isAvailable
                                    ? "border-green-500 text-green-700 hover:bg-green-50"
                                    : "border-red-500 text-red-700 hover:bg-red-50"
                                } disabled:opacity-30`}
                              >
                                {variant.isAvailable ? "Deactiveren" : "Activeren"}
                              </button>
                              <button
                                onClick={() => handleStartEditVariant(variant)}
                                className="px-3 py-1 text-sm border border-gray-300 hover:border-dark"
                              >
                                Bewerk
                              </button>
                              <button
                                onClick={() => handleDeleteVariant(variant.id)}
                                disabled={variantSaving}
                                className="px-2 py-1 text-red-500 hover:text-red-700 text-lg"
                              >
                                ×
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Nog geen varianten. Voeg hieronder je eerste variant toe.
                  </p>
                )}
              </div>

              {/* Add New Variant Form */}
              <div className="border-t-2 border-dashed border-gray-300 pt-6">
                <h4 className="font-heading text-lg mb-4 !text-lg">Nieuwe Variant Toevoegen</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                  <div className="form-group mb-0 col-span-2 md:col-span-1">
                    <label className="form-label text-xs">Type</label>
                    <select
                      value={newVariant.type}
                      onChange={(e) => {
                        const type = e.target.value as VariantType;
                        const label = updateVariantLabel(type, newVariant.size, newVariant.customType);
                        setNewVariant({ ...newVariant, type, label });
                      }}
                      className="form-select"
                    >
                      {VARIANT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newVariant.type === "custom" && (
                    <div className="form-group mb-0">
                      <label className="form-label text-xs">Type Naam</label>
                      <input
                        type="text"
                        value={newVariant.customType}
                        onChange={(e) => {
                          const customType = e.target.value;
                          const label = updateVariantLabel("custom", newVariant.size, customType);
                          setNewVariant({ ...newVariant, customType, label });
                        }}
                        placeholder="Bijv. Growler"
                        className="form-input"
                      />
                    </div>
                  )}

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Maat</label>
                    <input
                      type="text"
                      value={newVariant.size}
                      onChange={(e) => {
                        const size = e.target.value;
                        const label = updateVariantLabel(newVariant.type, size, newVariant.customType);
                        setNewVariant({ ...newVariant, size, label });
                      }}
                      placeholder="bv. 33cl"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Label</label>
                    <input
                      type="text"
                      value={newVariant.label}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, label: e.target.value })
                      }
                      placeholder="bv. Flesje 33cl"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Prijs (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Stock</label>
                    <input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="form-input"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddVariant}
                  disabled={variantSaving || !newVariant.label}
                  className="mt-4 w-full py-3 bg-primary text-dark font-heading uppercase tracking-wide border-2 border-dark hover:bg-dark hover:text-primary transition-colors disabled:opacity-50"
                >
                  {variantSaving ? "Toevoegen..." : "+ Toevoegen"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-100 flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-dark font-heading border-2 border-dark hover:bg-gray-200 transition-colors"
          >
            {savedBeer ? "Sluiten" : "Annuleren"}
          </button>
        </div>
      </div>

      {/* Form Styles */}
      <style jsx>{`
        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #525252;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .border-b-3 {
          border-bottom-width: 3px;
        }
      `}</style>
    </div>
  );
}
