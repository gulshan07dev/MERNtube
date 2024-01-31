import { createSlice } from "@reduxjs/toolkit";

interface AppLoadingState {
  user: boolean;
}

const initialState: AppLoadingState = {
  user: false,
};

const appLoadingSlice = createSlice({
  name: "appLoading",
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUserLoading } = appLoadingSlice.actions;
export default appLoadingSlice.reducer;
