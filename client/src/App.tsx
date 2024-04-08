import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import AuthRequired from "./helper/auth/AuthRequired";
import AuthNotRequired from "./helper/auth/AuthNotRequired";
import { getCurrentUser, refreshAccessToken } from "./store/slices/authSlice";
import { AppDispatch } from "./store/store";
import { setUserLoading } from "./store/slices/appLoadingSlice";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Account from "./pages/Account";
import ChannelLayout from "./layout/ChannelLayout";
import Channel from "./pages/channel/Channel";
import Videos from "./pages/channel/Videos";
import Tweets from "./pages/channel/Tweets";
import Playlists from "./pages/channel/Playlists";
import Create from "./pages/Create";
import TweetEdit from "./pages/edit/TweetEdit";
import Settings from "./pages/Settings";
import PlaylistVideos from "./pages/PlaylistVideos";
import VideoPlayer from "./pages/VideoPlayer ";
import WatchHistory from "./pages/WatchHistory";
import WatchLater from "./pages/WatchLater";
import LikedVideos from "./pages/LikedVideos";
import SendFeedback from "./pages/SendFeedback";
import Subscriptions from "./pages/Subscriptions";

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setUserLoading(true));

      const res = await dispatch(getCurrentUser());

      if (!res?.payload?.success) {
        // If there's an error, try refreshing the access token
        await dispatch(refreshAccessToken());

        // Retry fetching the current user after refreshing the token
        await dispatch(getCurrentUser());
      }

      dispatch(setUserLoading(false));
    })();
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.body.classList.add(theme);
    }
  }, []);

  return (
    <Routes>
      {/* home page */}
      <Route path="/" element={<Home />} />

      {/* send Feedback */}
      <Route path="/send-feedback" element={<SendFeedback />} />

      {/* settings */}
      <Route path="/settings" element={<Settings />} />

      {/* ....protected routes.... */}
      <Route element={<AuthRequired />}>
        {/* account */}
        <Route path="/account" element={<Account />} />

        {/* subscriptions */}
        <Route path="/feed/subscriptions" element={<Subscriptions />} />

        {/* channel */}
        <Route path="/c/:username" element={<ChannelLayout />}>
          <Route path="" element={<Channel />} />
          <Route path="videos" element={<Videos />} />
          <Route path="tweets" element={<Tweets />} />
          <Route path="playlists" element={<Playlists />} />
        </Route>

        {/* playlist videos */}
        <Route path="/playlists/:playlistId" element={<PlaylistVideos />} />

        {/* create */}
        <Route path="/create" element={<Create />} />

        {/* edit */}
        <Route path="/edit">
          <Route path="tweet/:tweetId" element={<TweetEdit />} />
        </Route>

        {/* video player */}
        <Route path="/watch/:videoId" element={<VideoPlayer />} />

        {/* watch history */}
        <Route path="/feed/history" element={<WatchHistory />} />

        {/* watch later */}
        <Route path="/watch-later" element={<WatchLater />} />

        {/* liked videos */}
        <Route path="/liked-videos" element={<LikedVideos />} />
      </Route>

      {/* Authentication routes */}
      <Route element={<AuthNotRequired />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
