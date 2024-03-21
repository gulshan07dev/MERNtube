import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isOpenInMobile: boolean;
}

const initialState: SidebarState = {
  isOpen: true,
  isOpenInMobile: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onClose: (state) => {
      state.isOpen = false;
    },
    onToggle: (state) => {
      state.isOpen = !state.isOpen;
      state.isOpenInMobile = !state.isOpenInMobile;
    },
    resetBydefault: (state) => {
      state.isOpen = true;
      state.isOpenInMobile = false;
    },
  },
});

export default sidebarSlice.reducer;
export const { onClose, onToggle, resetBydefault } = sidebarSlice.actions;
