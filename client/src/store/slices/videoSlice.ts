import axiosInstance from "@/helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "./authSlice";
import { queryParams } from "@/component/ScrollPagination";

export interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail: { key: string; url: string };
  videoFile: { key: string; url: string };
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User;
  createdAt: Date;
}

interface initialState {
  video: Video | null;
  videos: Video[];
  loading: boolean;
  error: string | null;
  currPage: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
}

const initialState: initialState = {
  video: null,
  videos: [],
  loading: false,
  error: null,
  currPage: 0,
  totalDocs: 0,
  totalPages: 0,
  hasNextPage: false,
};

const createVideo = createAsyncThunk(
  "/videos/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/videos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const updateVideo = createAsyncThunk(
  "/videos/update/videoId",
  async (
    { videoId, data }: { videoId: string; data: {} },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(`/videos/${videoId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getVideoByVideoId = createAsyncThunk(
  "/videos/update/videoId",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/videos/${videoId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getAllVideos = createAsyncThunk(
  "/videos/getAll",
  async (queryParams: queryParams | {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/videos", {
        params: queryParams,
      });
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasNextPage = false;
      })

      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        const newVideos = action.payload.data?.result?.docs || [];
        state.videos =
          action.payload.data?.result?.page === 1
            ? newVideos
            : [...state.videos, ...newVideos];
        state.currPage = action.payload.data?.result?.page;
        state.totalDocs = action.payload.data?.result?.totalDocs || 0;
        state.totalPages = action.payload.data?.result?.totalPages;
        state.hasNextPage = action.payload.data?.result?.hasNextPage;
      })

      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch videos";
      });
  },
});

export default videoSlice.reducer;
export const {} = videoSlice.actions;
export { createVideo, updateVideo, getVideoByVideoId, getAllVideos };
