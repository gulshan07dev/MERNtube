import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/helper/axiosInstance";
import { User } from "./authSlice";

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  owner?: User;
  videosCount?: number;
  totalViews?: number;
  isPrivate: boolean;
  playlistThumbnail: string;
  isVideoAddedToPlaylist?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface initialState {
  playlist: Playlist | null;
}

const initialState: initialState = {
  playlist: null,
};

const createPlaylist = createAsyncThunk(
  "/playlists/create",
  async (
    data: { name: string; description: string; isPrivate: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/playlists", data);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getUserPlaylists = createAsyncThunk(
  "/playlists/get/user/userId",
  async (
    {
      userId,
      queryParams,
    }: {
      userId: string;
      queryParams: { page?: number; limit?: number; videoId?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/playlists/user/${userId}`, {
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

const getPlaylist = createAsyncThunk(
  "/playlists/get/playlistId",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/playlists/${playlistId}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getUserPlaylistVideos = createAsyncThunk(
  "/playlists/playlistId/videos",
  async (
    {
      playlistId,
      queryParams,
    }: {
      playlistId: string;
      queryParams: {
        page?: number;
        limit?: number;
        orderBy?: "acc" | "desc";
        sortBy?: "createdAt" | "views";
        sortType?: "acc" | "desc";
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/playlists/${playlistId}/videos`, {
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

const addVideoToPlaylist = createAsyncThunk(
  "/playlists/add/playlistId/videoId",
  async (
    { playlistId, videoId }: { playlistId: string; videoId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(
        `/playlists/${playlistId}/${videoId}`
      );
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const removeVideoFromPlaylist = createAsyncThunk(
  "/playlists/remove/playlistId/videoId",
  async (
    { playlistId, videoId }: { playlistId: string; videoId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.delete(
        `/playlists/${playlistId}/${videoId}`
      );
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const deletePlaylist = createAsyncThunk(
  "/playlists/delete/playlistId",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/playlists/${playlistId}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const updatePlaylist = createAsyncThunk(
  "/playlists/update/playlistId",
  async (
    {
      playlistId,
      data,
    }: {
      playlistId: string;
      data: { name: string; description: string; isPrivate: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(`/playlists/${playlistId}`, data);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylist.pending, (state) => {
        state.playlist = null;
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.playlist = action.payload?.data?.playlist;
      })
      .addCase(getPlaylist.rejected, (state) => {
        state.playlist = null;
      });
  },
});

export default playlistSlice.reducer;
export const {} = playlistSlice.actions;
export {
  createPlaylist,
  getUserPlaylists,
  getPlaylist,
  getUserPlaylistVideos,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
