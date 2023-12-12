import { create } from "zustand";

const useSidebar = create((set) => ({
    isOpen: true,
    onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebar;
