import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import videoSlice from "./slices/videoSlice";
import tweetSlice from "./slices/tweetSlice";
import playlistSlice from "./slices/playlistSlice";
import likeSlice from "./slices/likeSlice";
import commentSlice from "./slices/commentSlice";
import sidebarSlice from "./slices/sidebarSlice";
import appLoadingSlice from "./slices/appLoadingSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        subscription: subscriptionSlice,
        video: videoSlice,
        tweet: tweetSlice,
        playlist: playlistSlice,
        like: likeSlice,
        comment: commentSlice,
        sidebar: sidebarSlice,
        appLoading: appLoadingSlice
    },
    devTools: import.meta.env.MODE === "development"
})

export default store;
 
export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch