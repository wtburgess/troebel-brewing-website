// Beer variant types - bottles, crates (bakken), kegs (vaten), and custom
// Common types for UI suggestions, but any string is allowed for flexibility
export type VariantType = "bottle" | "crate" | "keg" | "custom";

// Common variant type options for UI dropdown
export const VARIANT_TYPE_OPTIONS: { value: VariantType; label: string }[] = [
  { value: "bottle", label: "Flesje" },
  { value: "crate", label: "Bak" },
  { value: "keg", label: "Vat" },
  { value: "custom", label: "Anders" },
];

// Get display label for variant type
export function getVariantTypeLabel(type: VariantType | string): string {
  const option = VARIANT_TYPE_OPTIONS.find(o => o.value === type);
  return option?.label || type;
}

export type BeerCategory =
  | "pale-ale"
  | "ipa"
  | "saison"
  | "seasonal"
  | "tripel"
  | "session"
  | "blond";

export interface BeerVariant {
  id: string;
  beerId: string;
  type: VariantType;
  size: string;           // "33cl", "24x33cl", "20L"
  label: string;          // "Flesje 33cl", "Bak 24 stuks", "Vat 20L"
  price: number;
  stock: number;
  volumeMl: number;
  isAvailable: boolean;
  sortOrder: number;
}

export interface Beer {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  style: string;
  category: BeerCategory;
  description: string;
  longDescription?: string;
  abv: number;
  ibu?: number;
  rating?: number;
  ratingCount?: number;
  image: string;
  tastingNotes?: string[];
  foodPairings?: string[];
  isActive?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  isFeatured?: boolean;  // Show in homepage lineup
  displayOrder?: number;
  sortOrder?: number;
  variants: BeerVariant[];
}

// For cart - stores selected variant
export interface CartItem {
  beer: Beer;
  variant: BeerVariant;
  quantity: number;
}

// Order types
export type OrderStatus = "pending" | "paid" | "completed" | "cancelled";
export type FulfillmentType = "pickup" | "delivery";

export interface OrderItem {
  variantId: string;
  beerId: string;
  beerName: string;
  variantLabel: string;
  quantity: number;
  price: number;
}

export interface OrderCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: OrderCustomer;
  fulfillment: FulfillmentType;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  created: string;
  updated: string;
}

// Helper type for getting the lowest price from variants
export function getLowestPrice(beer: Beer): number {
  if (!beer.variants || beer.variants.length === 0) {
    return 0;
  }
  const availableVariants = beer.variants.filter(v => v.isAvailable);
  if (availableVariants.length === 0) {
    return beer.variants[0].price;
  }
  return Math.min(...availableVariants.map(v => v.price));
}

// Helper to check if beer has any available variants
export function hasAvailableVariants(beer: Beer): boolean {
  return beer.variants.some(v => v.isAvailable && v.stock > 0);
}
