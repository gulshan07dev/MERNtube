import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../helper/axiosInstance";

const initialState = {};

const toggleSubscription = createAsyncThunk("/subscriptions/channelId",
    async (channelId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/subscriptions/c/${channelId}`)
            return res.data
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    })

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: (_builder) => { }
})

export default subscriptionSlice.reducer;
export const { } = subscriptionSlice.actions
export {
    toggleSubscription
}