import { create } from "zustand";

const useSidebar = create((set) => ({
    isOpen: false,
    onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebar;
