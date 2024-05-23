import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPaginationInfo, IPlaylist } from "@/interfaces";

interface initialState {
  playlist: IPlaylist | null;
  playlists: IPlaylist[];
  playlistsPaginationInfo:  Partial<IPaginationInfo>;
}

const initialState: initialState = {
  playlist: null,
  playlists: [],
  playlistsPaginationInfo:  {},
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
    setPlaylistsPaginationInfo: (
      state,
      action: PayloadAction<initialState["playlistsPaginationInfo"]>
    ) => {
      state.playlistsPaginationInfo = action.payload;
    },
  },
});

export default playlistSlice.reducer;
export const { setPlaylist, setPlaylists, setPlaylistsPaginationInfo } =
  playlistSlice.actions;
