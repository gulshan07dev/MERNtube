import axiosInstance from "@/helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {}

const createVideo = createAsyncThunk("/videos/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/videos", data,
                { headers: { "Content-Type": "multipart/form-data" } })
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    })

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {},
    extraReducers: (builder) => { }
})

export default videoSlice.reducer
export const { } = videoSlice.actions
export {
    createVideo
}