import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {};

const createTweet = createAsyncThunk(
  "/subscriptions/channelId",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/tweets", data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {},
  extraReducers: (_builder) => {},
});

export default tweetSlice.reducer;
export const {} = tweetSlice.actions;
export { createTweet };
