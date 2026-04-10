import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Beer, BeerVariant, CartItem } from "@/types/beer";

// Re-export CartItem for backward compatibility
export type { CartItem } from "@/types/beer";

// Generate unique key for cart item (beer + variant combination)
function getCartItemKey(beerId: string, variantId: string): string {
  return `${beerId}-${variantId}`;
}

interface CartState {
  items: CartItem[];
  addItem: (beer: Beer, variant: BeerVariant, quantity?: number) => void;
  removeItem: (beerId: string, variantId: string) => void;
  updateQuantity: (beerId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemKey: (item: CartItem) => string;
  syncWithBackend: (latestBeers: Beer[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      syncWithBackend: (latestBeers) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            const freshBeer = latestBeers.find((b) => b.id === item.beer.id);
            if (!freshBeer) return item; // Beer no longer exists, keep as is (or could remove)

            const freshVariant = freshBeer.variants.find((v) => v.id === item.variant.id);
            if (!freshVariant) return item; // Variant no longer exists

            // Return item with updated beer and variant data (prices, stock, names, etc.)
            // Maintain the current quantity
            return {
              ...item,
              beer: freshBeer,
              variant: freshVariant,
            };
          });

          // Optional: Filter out items that are strictly no longer available if desired, 
          // but updating them to show "Out of Stock" in UI is usually better UX.
          // For now, we just update the data so the price is correct.
          
          return { items: updatedItems };
        });
      },

      addItem: (beer, variant, quantity = 1) => {
        set((state) => {
          const itemKey = getCartItemKey(beer.id, variant.id);
          const existingItem = state.items.find(
            (item) => getCartItemKey(item.beer.id, item.variant.id) === itemKey
          );

          if (existingItem) {
            // Update quantity of existing item
            return {
              items: state.items.map((item) =>
                getCartItemKey(item.beer.id, item.variant.id) === itemKey
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Add new item
          return {
            items: [...state.items, { beer, variant, quantity }],
          };
        });
      },

      removeItem: (beerId, variantId) => {
        const itemKey = getCartItemKey(beerId, variantId);
        set((state) => ({
          items: state.items.filter(
            (item) => getCartItemKey(item.beer.id, item.variant.id) !== itemKey
          ),
        }));
      },

      updateQuantity: (beerId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(beerId, variantId);
          return;
        }

        const itemKey = getCartItemKey(beerId, variantId);
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemKey(item.beer.id, item.variant.id) === itemKey
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        );
      },

      getItemKey: (item) => {
        return getCartItemKey(item.beer.id, item.variant.id);
      },
    }),
    {
      name: "troebel-cart",
      // Version the storage to handle migration from old format
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          // Clear cart on upgrade to variant-based system
          // Old cart items don't have variants, so we start fresh
          return { items: [] };
        }
        return persistedState as CartState;
      },
    }
  )
);
