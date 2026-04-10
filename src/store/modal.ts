import { create } from "zustand";
import { Beer } from "@/types/beer";

interface ModalState {
  isOpen: boolean;
  beer: Beer | null;
  openModal: (beer: Beer) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  beer: null,
  openModal: (beer) => set({ isOpen: true, beer }),
  closeModal: () => set({ isOpen: false, beer: null }),
}));
