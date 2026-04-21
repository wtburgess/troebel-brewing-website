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
  toggleAvailability,
  CreateVariantData,
} from "@/lib/api/admin";

interface BeerEditModalProps {
  beer: Beer | null;
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

interface NewVariantForm {
  type: VariantType;
  customType: string;
  size: string;
  label: string;
  price: number;
}

const initialVariantForm: NewVariantForm = {
  type: "bottle",
  customType: "",
  size: "33cl",
  label: "Flesje 33cl",
  price: 2.5,
};

export default function BeerEditModal({
  beer,
  isOpen,
  onClose,
  onSaved,
  onVariantsUpdated,
}: BeerEditModalProps) {
  const isCreating = beer === null;

  const [formData, setFormData] = useState<Partial<CreateBeerData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBeer, setSavedBeer] = useState<Beer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [variants, setVariants] = useState<BeerVariant[]>([]);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editVariantForm, setEditVariantForm] = useState<Partial<BeerVariant>>({});
  const [newVariant, setNewVariant] = useState<NewVariantForm>(initialVariantForm);
  const [variantSaving, setVariantSaving] = useState(false);

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
  }, [beer]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
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
      setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) { setError(validation.error || "Invalid image"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) { setError(validation.error || "Invalid image"); return; }
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
          const newBeer: Beer = { ...result.beer, image: imagePreview || result.beer.image, variants: [] };
          setSavedBeer(newBeer);
          setError(null);
        } else {
          setError(result.error || "Aanmaken mislukt");
        }
      } else {
        const result = await updateBeer(savedBeer.id, formData, imageFile || undefined);
        if (result.success && result.beer) {
          const updatedBeer: Beer = { ...result.beer, variants, image: imagePreview || savedBeer.image };
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
    if (savedBeer && (isCreating || variants !== beer?.variants)) {
      onSaved({ ...savedBeer, variants });
    }
    onClose();
  };

  const updateVariantLabel = (type: VariantType | string, size: string, customType: string): string => {
    if (type === "custom" && customType) return `${customType} ${size}`;
    const labels: Record<string, string> = { bottle: `Flesje ${size}`, crate: `Bak ${size}`, keg: `Vat ${size}` };
    return labels[type] || `${type} ${size}`;
  };

  const handleAddVariant = async () => {
    if (!savedBeer) return;
    setVariantSaving(true);
    setError(null);
    const variantType = (newVariant.type === "custom" ? newVariant.customType : newVariant.type) as VariantType;
    const data: CreateVariantData = {
      beer: savedBeer.id,
      type: variantType,
      size: newVariant.size,
      label: newVariant.label,
      price: newVariant.price,
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
    setEditVariantForm({ label: variant.label, size: variant.size, price: variant.price });
  };

  const handleSaveVariantEdit = async () => {
    if (!editingVariantId || !savedBeer) return;
    setVariantSaving(true);
    setError(null);
    const result = await updateVariant(editingVariantId, {
      label: editVariantForm.label,
      size: editVariantForm.size,
      price: editVariantForm.price,
    });
    if (result.success && result.variant) {
      const updatedVariants = variants.map((v) => v.id === editingVariantId ? result.variant! : v);
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

  const handleToggleAvailability = async (variantId: string) => {
    if (!savedBeer) return;
    setVariantSaving(true);
    const result = await toggleAvailability(variantId);
    if (result.success && result.isAvailable !== undefined) {
      const updatedVariants = variants.map((v) => v.id === variantId ? { ...v, isAvailable: result.isAvailable! } : v);
      setVariants(updatedVariants);
      onVariantsUpdated?.(savedBeer.id, updatedVariants);
    }
    setVariantSaving(false);
  };

  const canAddVariants = savedBeer !== null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/70 p-4 md:p-6 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="admin-modal-v2 w-full max-w-[960px] my-auto"
        style={{ display: "flex", flexDirection: "column", background: "var(--warm-white)", border: "3px solid var(--dark)", boxShadow: "10px 10px 0 var(--dark)", maxHeight: "calc(100vh - 3rem)" }}
      >

        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-eyebrow">{isCreating ? "nieuw bier" : "bewerken"}</span>
            <h2 className="admin-modal-title">{isCreating ? "Bier Toevoegen" : beer?.name}</h2>
          </div>
          <button onClick={handleClose} className="admin-modal-close" aria-label="Sluiten">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSaveDetails} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
          <div className="admin-modal-v2-body" style={{ padding: "1.5rem 1.75rem", overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}>
            {error && (
              <div className="admin-error-banner" style={{ marginBottom: "1.25rem" }}>{error}</div>
            )}

            {/* ── Row 1: two-column grid ── */}
            <div
              className="admin-modal-v2-grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 38%) minmax(0, 1fr)", gap: "1.75rem", marginBottom: "1.25rem" }}
            >

              {/* Left: image + status */}
              <div className="admin-modal-v2-left" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div className="admin-v2-section-head">
                  <span className="admin-v2-eyebrow">afbeelding</span>
                </div>
                <div
                  className="admin-v2-image-drop"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {(imagePreview || (beer && beer.image)) ? (
                    <>
                      <div className="admin-v2-image-preview">
                        <Image src={imagePreview || beer?.image || ""} alt="Preview" fill className="object-contain" sizes="240px" />
                      </div>
                      <span className="admin-v2-image-hint">Wijzig afbeelding</span>
                    </>
                  ) : (
                    <>
                      <div className="admin-v2-image-icon">📷</div>
                      <div className="admin-v2-image-hint">Klik of sleep</div>
                      <div className="admin-v2-image-sub">JPG, PNG, WebP · max 5MB</div>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} className="hidden" />
                </div>

                <div className="admin-v2-section-head" style={{ marginTop: "1.25rem" }}>
                  <span className="admin-v2-eyebrow">status</span>
                </div>
                <div className="admin-v2-status-box" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label className="admin-v2-checkbox-row" style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem" }}>
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured || false} onChange={handleInputChange} className="admin-v2-checkbox" />
                    <span>Homepage line-up</span>
                  </label>
                  <label className="admin-v2-checkbox-row" style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem" }}>
                    <input type="checkbox" name="isNew" checked={formData.isNew || false} onChange={handleInputChange} className="admin-v2-checkbox" />
                    <span>Markeer als NIEUW</span>
                  </label>
                  <label className="admin-v2-checkbox-row" style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", fontSize: "0.85rem" }}>
                    <input type="checkbox" name="isLimited" checked={formData.isLimited || false} onChange={handleInputChange} className="admin-v2-checkbox" />
                    <span>Markeer als SEIZOEN</span>
                  </label>
                </div>
              </div>

              {/* Right: basis info */}
              <div className="admin-modal-v2-right" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div className="admin-v2-section-head">
                  <span className="admin-v2-eyebrow">basis</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Naam *</label>
                  <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} required className="form-input" placeholder="Bijv. Brews Almighty" />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug (URL)</label>
                  <input type="text" name="slug" value={formData.slug || ""} onChange={handleInputChange} disabled={!isCreating} className="form-input" style={{ opacity: isCreating ? 1 : 0.55 }} placeholder="brews-almighty" />
                </div>
                <div className="admin-v2-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Categorie *</label>
                    <select name="category" value={formData.category || "blond"} onChange={handleInputChange} required className="form-select">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Stijl Label</label>
                    <input type="text" name="style" value={formData.style || ""} onChange={handleInputChange} className="form-input" placeholder="Tripel" />
                  </div>
                </div>
                <div className="admin-v2-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginTop: "1rem" }}>
                  <div className="form-group mb-0">
                    <label className="form-label">ABV (%)</label>
                    <input type="number" name="abv" value={formData.abv ?? ""} onChange={handleInputChange} step="0.1" min="0" max="20" className="form-input" />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">IBU</label>
                    <input type="number" name="ibu" value={formData.ibu ?? ""} onChange={handleInputChange} min="0" max="150" className="form-input" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="admin-modal-divider" />

            {/* ── Teksten (full-width) ── */}
            <div className="admin-v2-section-head">
              <span className="admin-v2-eyebrow">teksten</span>
            </div>
            <div className="form-group">
              <label className="form-label">Korte beschrijving (card)</label>
              <textarea name="description" value={formData.description || ""} onChange={handleInputChange} className="form-textarea" rows={2} placeholder="Een krachtige tripel met fruitige toetsen en een zachte afdronk." />
            </div>
            <div className="form-group">
              <label className="form-label">Lange beschrijving (detailpagina)</label>
              <textarea name="longDescription" value={formData.longDescription || ""} onChange={handleInputChange} className="form-textarea" rows={4} placeholder="Onze klassieker. Brews Almighty is een eerbetoon aan de traditionele Belgische tripel..." />
            </div>
            <div className="admin-v2-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="form-group mb-0">
                <label className="form-label">Proefnotities (komma gescheiden)</label>
                <input type="text" name="tastingNotes" value={formData.tastingNotes || ""} onChange={handleInputChange} className="form-input" placeholder="Peer, Banaan, Kaneel" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Food pairings (komma gescheiden)</label>
                <input type="text" name="foodPairings" value={formData.foodPairings || ""} onChange={handleInputChange} className="form-input" placeholder="Geitenkaas, Witlof" />
              </div>
            </div>

            <hr className="admin-modal-divider" />

            {/* ── Varianten (full-width) ── */}
            <div className="admin-v2-section-head">
              <span className="admin-v2-eyebrow">varianten</span>
            </div>

            <div className="admin-v2-variants-wrap">
              {!canAddVariants ? (
                <div className="admin-variant-locked-panel">
                  <span className="admin-variant-locked-eyebrow">stap 2</span>
                  <span className="admin-variant-locked-title">Nog niet beschikbaar</span>
                  <p className="admin-variant-locked-body">
                    Sla eerst de bierdetails op via <strong>“Bier Aanmaken”</strong> hieronder. Daarna kun je varianten (flesjes, bakken, vaten) toevoegen.
                  </p>
                </div>
              ) : variants.length === 0 ? (
                <div className="admin-variant-empty">
                  <span className="admin-variant-empty-title">Geen varianten</span>
                  <span className="admin-variant-empty-body">Dit bier heeft nog geen varianten. Klanten kunnen het niet bestellen tot je er minstens één toevoegt.</span>
                </div>
              ) : (
                <div className="admin-variant-list">
                  {variants.map((variant) => (
                    <div key={variant.id} className="admin-variant-row">
                      {editingVariantId === variant.id ? (
                        <div className="admin-variant-edit-form">
                          <div className="admin-v2-three-col">
                            <div>
                              <label className="form-label">Label</label>
                              <input type="text" value={editVariantForm.label || ""} onChange={(e) => setEditVariantForm({ ...editVariantForm, label: e.target.value })} className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Maat</label>
                              <input type="text" value={editVariantForm.size || ""} onChange={(e) => setEditVariantForm({ ...editVariantForm, size: e.target.value })} className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Prijs (€)</label>
                              <input type="number" step="0.01" value={editVariantForm.price ?? ""} onChange={(e) => setEditVariantForm({ ...editVariantForm, price: parseFloat(e.target.value) })} className="form-input" />
                            </div>
                          </div>
                          <div className="admin-variant-edit-actions">
                            <button type="button" onClick={handleSaveVariantEdit} disabled={variantSaving} className="admin-variant-save-btn">Opslaan</button>
                            <button type="button" onClick={() => { setEditingVariantId(null); setEditVariantForm({}); }} className="admin-variant-cancel-btn">Annuleren</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-variant-label-cell">
                            <span className="admin-variant-label-name">{variant.label}</span>
                            <span className="admin-variant-label-size">{variant.size}</span>
                          </div>
                          <span className="admin-variant-price">€ {variant.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(variant.id)}
                            disabled={variantSaving}
                            className={`admin-variant-pill ${variant.isAvailable ? "admin-variant-pill--avail" : "admin-variant-pill--sold"}`}
                          >
                            {variant.isAvailable ? "✓ BESCHIKBAAR" : "✗ UITVERKOCHT"}
                          </button>
                          <div className="admin-variant-actions">
                            <button type="button" onClick={() => handleStartEditVariant(variant)} className="admin-action-btn" title="Bewerken">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2L12 4.5L4.5 12H2V9.5L9.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                            </button>
                            <button type="button" onClick={() => handleDeleteVariant(variant.id)} disabled={variantSaving} className="admin-action-btn admin-action-btn--delete" title="Verwijderen">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add new variant form */}
              {canAddVariants && (
              <div className="admin-variant-add-form">
                <div className="admin-variant-add-fields" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
                  <div className="form-group mb-0">
                    <label className="form-label">Type</label>
                    <select
                      value={newVariant.type}
                      onChange={(e) => {
                        const type = e.target.value as VariantType;
                        setNewVariant({ ...newVariant, type, label: updateVariantLabel(type, newVariant.size, newVariant.customType) });
                      }}
                      className="form-select"
                    >
                      {VARIANT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {newVariant.type === "custom" && (
                    <div className="form-group mb-0">
                      <label className="form-label">Type naam</label>
                      <input
                        type="text"
                        value={newVariant.customType}
                        onChange={(e) => {
                          const customType = e.target.value;
                          setNewVariant({ ...newVariant, customType, label: updateVariantLabel("custom", newVariant.size, customType) });
                        }}
                        placeholder="Bijv. Growler"
                        className="form-input"
                      />
                    </div>
                  )}

                  <div className="form-group mb-0">
                    <label className="form-label">Maat</label>
                    <input
                      type="text"
                      value={newVariant.size}
                      onChange={(e) => {
                        const size = e.target.value;
                        setNewVariant({ ...newVariant, size, label: updateVariantLabel(newVariant.type, size, newVariant.customType) });
                      }}
                      placeholder="33cl"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Label</label>
                    <input type="text" value={newVariant.label} onChange={(e) => setNewVariant({ ...newVariant, label: e.target.value })} placeholder="Flesje 33cl" className="form-input" />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Prijs €</label>
                    <input type="number" step="0.01" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })} placeholder="0.00" className="form-input" />
                  </div>

                  <div className="admin-variant-add-btn-wrap">
                    <label className="form-label">&nbsp;</label>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      disabled={variantSaving || !newVariant.label}
                      className="admin-variant-add-btn"
                    >
                      {variantSaving ? "..." : "+ Voeg toe"}
                    </button>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="admin-modal-v2-footer" style={{ padding: "1rem 1.75rem", borderTop: "3px solid var(--dark)", background: "var(--cream)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, gap: "1rem" }}>
            <button type="button" onClick={handleClose} className="btn-outline">
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn"
              style={{ opacity: saving ? 0.55 : 1 }}
            >
              {saving ? "Opslaan..." : isCreating && !savedBeer ? "BIER AANMAKEN" : "OPSLAAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
