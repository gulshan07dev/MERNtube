import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import videoSlice from "./slices/videoSlice";
import watchHistorySlice from "./slices/watchHistorySlice";
import watchLaterSlice from "./slices/watchLaterSlice";
import tweetSlice from "./slices/tweetSlice";
import playlistSlice from "./slices/playlistSlice";
import likeSlice from "./slices/likeSlice";
import sidebarSlice from "./slices/sidebarSlice";
import appLoadingSlice from "./slices/appLoadingSlice";
import dashboardSlice from "./slices/dashboardSlice";
import feedbackSlice from "./slices/feedbackSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    subscription: subscriptionSlice,
    video: videoSlice,
    watch_history: watchHistorySlice,
    watch_later: watchLaterSlice,
    tweet: tweetSlice,
    like: likeSlice,
    playlist: playlistSlice,
    dashboard: dashboardSlice,
    feedback: feedbackSlice,
    sidebar: sidebarSlice,
    appLoading: appLoadingSlice,
  },
  devTools: import.meta.env.MODE === "development",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
