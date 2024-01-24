import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import videoSlice from "./slices/videoSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        subscription: subscriptionSlice,
        video: videoSlice
    },
    devTools: import.meta.env.MODE === "development"
})

export default store;
 
export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch