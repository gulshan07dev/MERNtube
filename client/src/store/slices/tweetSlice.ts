import { IPaginationInfo, ITweet } from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialState {
  tweet: ITweet | null;
  tweets: ITweet[];
  tweetsPaginationInfo: Partial<IPaginationInfo>;
}

const initialState: initialState = {
  tweet: null,
  tweets: [],
  tweetsPaginationInfo: {},
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    setTweet: (state, action: PayloadAction<initialState["tweet"]>) => {
      state.tweet = action.payload;
    },
    setTweets: (state, action: PayloadAction<initialState["tweets"]>) => {
      state.tweets = action.payload;
    },
    setTweetsPaginationInfo: (
      state,
      action: PayloadAction<initialState["tweetsPaginationInfo"]>
    ) => {
      state.tweetsPaginationInfo = action.payload;
    },
  },
});

export default tweetSlice.reducer;
export const { setTweet, setTweets, setTweetsPaginationInfo } =
  tweetSlice.actions;
