import {create} from "zustand";

interface SidebarState {
  isOpen: boolean;
}

interface SidebarActions {
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

const useSidebar = create<SidebarState & SidebarActions>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebar;
