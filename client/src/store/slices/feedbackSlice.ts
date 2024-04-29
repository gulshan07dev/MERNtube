import axiosInstance from "@/helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {};

const sendFeedback = createAsyncThunk(
  "/feedbacks/send",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/feedbacks", { query });
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
});

export default feedbackSlice.reducer;
export { sendFeedback };
