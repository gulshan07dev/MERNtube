import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlaylist } from "@/interfaces";

interface initialState {
  playlist: IPlaylist | null;
  playlists: IPlaylist[];
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalDocs: number;
    hasNextPage: boolean;
  };
}

const initialState: initialState = {
  playlist: null,
  playlists: [],
  paginationInfo: {
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  },
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<initialState["playlist"]>) => {
      state.playlist = action.payload;
    },
    setPlaylists: (state, action: PayloadAction<initialState["playlists"]>) => {
      state.playlists = action.payload;
    },
    setPaginationInfo: (
      state,
      action: PayloadAction<initialState["paginationInfo"]>
    ) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default playlistSlice.reducer;
export const { setPlaylist, setPlaylists, setPaginationInfo } =
  playlistSlice.actions;
