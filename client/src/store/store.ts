import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import videoSlice from "./slices/videoSlice";
import tweetSlice from "./slices/tweetSlice";
import likeSlice from "./slices/likeSlice";
import appLoadingSlice from "./slices/appLoadingSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        subscription: subscriptionSlice,
        video: videoSlice,
        tweet: tweetSlice,
        like: likeSlice,
        appLoading: appLoadingSlice
    },
    devTools: import.meta.env.MODE === "development"
})

export default store;
 
export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch