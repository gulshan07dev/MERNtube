import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    user: {}
};

const registerUser = createAsyncThunk("/user/register", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/register", data, { headers: { "Content-Type": "multipart/form-data" } });
        return res?.data;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
})

const loginUser = createAsyncThunk("/user/login", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/login", data);
        return res?.data;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload?.data?.user;
            state.isLoggedIn = true;
            localStorage.setItem("isLoggedIn", true);
        })

    }
})

export default authSlice.reducer;
export const { } = authSlice.actions
export {
    registerUser, loginUser
}