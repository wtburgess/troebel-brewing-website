"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Beer, BeerCategory } from "@/types/beer";
import {
  createBeer,
  createDefaultVariants,
  validateImageFile,
  generateSlug,
  CreateBeerData,
} from "@/lib/api/admin";

interface AddBeerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (beer: Beer) => void;
}

const CATEGORY_OPTIONS: { value: BeerCategory; label: string }[] = [
  { value: "blond", label: "Blond" },
  { value: "pale-ale", label: "Pale Ale" },
  { value: "ipa", label: "IPA" },
  { value: "tripel", label: "Tripel" },
  { value: "saison", label: "Saison" },
  { value: "session", label: "Session" },
  { value: "seasonal", label: "Seizoens" },
];

const initialFormData: CreateBeerData & { isFeatured?: boolean } = {
  slug: "",
  name: "",
  style: "",
  category: "blond",
  description: "",
  longDescription: "",
  abv: 5.0,
  ibu: undefined,
  tastingNotes: "",
  foodPairings: "",
  isNew: true,
  isLimited: false,
  isFeatured: false,
  sortOrder: 0,
};

export default function AddBeerForm({
  isOpen,
  onClose,
  onCreated,
}: AddBeerFormProps) {
  const [formData, setFormData] = useState<CreateBeerData>(initialFormData);
  const [bottlePrice, setBottlePrice] = useState(3.0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "variants">("details");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } else if (name === "name") {
      // Auto-generate slug from name
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.style || !formData.description) {
      setError("Vul alle verplichte velden in");
      return;
    }

    if (!imageFile) {
      setError("Voeg een afbeelding toe");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Step 1: Create the beer
      const beerResult = await createBeer(formData, imageFile);

      if (!beerResult.success || !beerResult.beer) {
        setError(beerResult.error || "Bier aanmaken mislukt");
        setSaving(false);
        return;
      }

      // Step 2: Create default variants
      const variantsResult = await createDefaultVariants(beerResult.beer.id, bottlePrice);

      if (!variantsResult.success || !variantsResult.variants) {
        // Beer was created but variants failed - notify user
        setError(
          `Bier aangemaakt, maar varianten mislukt: ${variantsResult.error}. Voeg varianten handmatig toe.`
        );
        onCreated({ ...beerResult.beer, variants: [] });
        handleClose();
        return;
      }

      // Success - return beer with variants
      const completeBeer: Beer = {
        ...beerResult.beer,
        image: imagePreview || beerResult.beer.image,
        variants: variantsResult.variants,
      };

      onCreated(completeBeer);
      handleClose();
    } catch {
      setError("Er ging iets mis bij het aanmaken");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setBottlePrice(3.0);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setStep("details");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 border-4 border-dark"
        style={{ boxShadow: "8px 8px 0px var(--color-yellow)" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark text-yellow px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-xl">NIEUW BIER TOEVOEGEN</h2>
          <button
            onClick={handleClose}
            className="text-yellow hover:text-white text-2xl leading-none"
            aria-label="Sluiten"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 font-body text-sm">
              {error}
            </div>
          )}

          {step === "details" && (
            <>
              {/* Image Upload */}
              <div>
                <label className="block font-heading text-sm text-dark mb-2">
                  Afbeelding *
                </label>
                <div
                  className={`border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                    imagePreview ? "border-green-500" : "border-gray-300 hover:border-yellow"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreview ? (
                    <div className="relative w-32 h-40 mx-auto mb-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="128px"
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="text-4xl text-gray-300 mb-2">📷</div>
                    </div>
                  )}
                  <p className="font-body text-sm text-gray-600">
                    Sleep een afbeelding hierheen of{" "}
                    <span className="text-yellow font-semibold">klik om te uploaden</span>
                  </p>
                  <p className="font-body text-xs text-gray-400 mt-1">
                    JPG, PNG of WebP. Max 5MB.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Naam *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="bijv. Moeskop"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                </div>
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Slug (auto)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-gray-300 font-body text-gray-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* Style & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Stijl *
                  </label>
                  <input
                    type="text"
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    required
                    placeholder="bijv. Winter Ale, Blond"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                </div>
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Categorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ABV & IBU */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    ABV (%) *
                  </label>
                  <input
                    type="number"
                    name="abv"
                    value={formData.abv}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                </div>
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    IBU (optioneel)
                  </label>
                  <input
                    type="number"
                    name="ibu"
                    value={formData.ibu || ""}
                    onChange={handleInputChange}
                    step="1"
                    min="0"
                    max="150"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-heading text-sm text-dark mb-2">
                  Korte beschrijving *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Eén zin over het bier"
                  className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block font-heading text-sm text-dark mb-2">
                  Lange beschrijving
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription || ""}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Uitgebreide beschrijving voor de detailpagina"
                  className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow resize-none"
                />
              </div>

              {/* Tasting Notes & Food Pairings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Proefnotities
                  </label>
                  <input
                    type="text"
                    name="tastingNotes"
                    value={formData.tastingNotes || ""}
                    onChange={handleInputChange}
                    placeholder="Honing, Citrus, Graan"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                  <p className="font-body text-xs text-gray-400 mt-1">
                    Gescheiden door komma&apos;s
                  </p>
                </div>
                <div>
                  <label className="block font-heading text-sm text-dark mb-2">
                    Food Pairings
                  </label>
                  <input
                    type="text"
                    name="foodPairings"
                    value={formData.foodPairings || ""}
                    onChange={handleInputChange}
                    placeholder="Mosselen, Zachte kazen"
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                  <p className="font-body text-xs text-gray-400 mt-1">
                    Gescheiden door komma&apos;s
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew || false}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-dark accent-yellow"
                  />
                  <span className="font-body text-sm text-dark">
                    &quot;Nieuw&quot; badge tonen
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isLimited"
                    checked={formData.isLimited || false}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-dark accent-yellow"
                  />
                  <span className="font-body text-sm text-dark">
                    &quot;Seizoen&quot; badge tonen
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured || false}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-green-500 accent-green-500"
                  />
                  <span className="font-body text-sm text-dark">
                    Tonen op homepage (Line-up)
                  </span>
                </label>
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep("variants")}
                  className="px-6 py-2 bg-yellow text-dark font-heading border-2 border-dark hover:bg-dark hover:text-yellow transition-colors"
                  style={{ boxShadow: "4px 4px 0px var(--color-dark)" }}
                >
                  Volgende: Prijzen →
                </button>
              </div>
            </>
          )}

          {step === "variants" && (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="font-body text-sm text-gray-600 hover:text-dark mb-4"
                >
                  ← Terug naar details
                </button>

                <h3 className="font-heading text-lg text-dark mb-4">
                  Standaard varianten
                </h3>

                <p className="font-body text-sm text-gray-600 mb-6">
                  Stel de prijs in voor een flesje. De prijzen voor bakken en vaten worden
                  automatisch berekend (met korting).
                </p>

                {/* Bottle Price Input */}
                <div className="max-w-xs">
                  <label className="block font-heading text-sm text-dark mb-2">
                    Flesje prijs (€) *
                  </label>
                  <input
                    type="number"
                    value={bottlePrice}
                    onChange={(e) => setBottlePrice(parseFloat(e.target.value) || 0)}
                    step="0.10"
                    min="0"
                    required
                    className="w-full px-3 py-2 border-2 border-dark font-body focus:outline-none focus:border-yellow"
                  />
                </div>

                {/* Preview of variants */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-heading text-sm text-dark">
                    Preview varianten:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200">
                      <span className="font-body text-sm">Flesje 33cl</span>
                      <span className="font-heading text-sm">
                        €{bottlePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200">
                      <span className="font-body text-sm">Bak 24 stuks</span>
                      <span className="font-heading text-sm">
                        €{(Math.round(bottlePrice * 24 * 0.9 * 100) / 100).toFixed(2)}
                        <span className="text-gray-500 text-xs ml-1">(10% korting)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200">
                      <span className="font-body text-sm">Vat 20L</span>
                      <span className="font-heading text-sm">
                        €{(Math.round(bottlePrice * 60 * 0.85 * 100) / 100).toFixed(2)}
                        <span className="text-gray-500 text-xs ml-1">(15% korting)</span>
                      </span>
                    </div>
                  </div>
                  <p className="font-body text-xs text-gray-500">
                    Je kunt de prijzen later aanpassen in de variant manager.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 font-heading text-dark border-2 border-dark hover:bg-gray-100 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-yellow text-dark font-heading border-2 border-dark hover:bg-dark hover:text-yellow transition-colors disabled:opacity-50"
                  style={{ boxShadow: "4px 4px 0px var(--color-dark)" }}
                >
                  {saving ? "Aanmaken..." : "Bier Aanmaken"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
