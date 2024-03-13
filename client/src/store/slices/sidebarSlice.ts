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
       state.isOpenInMobile = true;
    },
    onToggle: (state) => {
      state.isOpen = !state.isOpen;
      state.isOpenInMobile = !state.isOpenInMobile;
    },
  },
});

export default sidebarSlice.reducer;
export const { onClose, onToggle } = sidebarSlice.actions;
