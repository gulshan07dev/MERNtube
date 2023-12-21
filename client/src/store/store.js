import {configureStore} from "@reduxjs/toolkit"

const store = configureStore({
    reducer: {},
    devTools: import.meta.env.NODE_ENV === "development"
})

export default store;