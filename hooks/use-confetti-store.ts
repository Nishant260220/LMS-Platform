import { create } from "zustand";

type ConfettiStore = {
    isOpen: boolean;
    onopen: () => void;
    onClose: () => void;
}

export const useConfettiStore = create<ConfettiStore>((set) => ({
    isOpen: false,
    onopen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
}));