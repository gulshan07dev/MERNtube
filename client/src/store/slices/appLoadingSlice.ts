import { createSlice } from "@reduxjs/toolkit";

interface AppLoadingState {
  isAppLoading: boolean;
}

const initialState: AppLoadingState = {
  isAppLoading: true,
};

const appLoadingSlice = createSlice({
  name: "appLoading",
  initialState,
  reducers: {
    setAppLoading: (state, action) => {
      state.isAppLoading = action.payload;
    },
  },
});

export const { setAppLoading } = appLoadingSlice.actions;
export default appLoadingSlice.reducer;
