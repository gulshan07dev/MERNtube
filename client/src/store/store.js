import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice";

const store = configureStore({
    reducer: {
        auth: authSlice
    },
    devTools: import.meta.env.VITE_REACT_APP_NODE_ENV === "development"
})

export default store;