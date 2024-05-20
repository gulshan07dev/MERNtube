import { ITweet } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  tweet: ITweet | null;
  tweets: ITweet[];
}

const initialState: initialState = {
  tweet: null,
  tweets: [],
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    setTweet: (state, action) => {
      state.tweets = action.payload;
    },
    setTweets: (state, action) => {
      state.tweets = action.payload;
    },
  },
});

export default tweetSlice.reducer;
export const { setTweets } = tweetSlice.actions;
