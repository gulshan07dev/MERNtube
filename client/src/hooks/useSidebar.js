import { create } from "zustand";

const useSidebar = create((set) => ({
    isOpen: false,
    onOpen: () => set((state) => ({ isOpen: true })),
    onClose: () => set((state) => ({ isOpen: false })),
    onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebar;
