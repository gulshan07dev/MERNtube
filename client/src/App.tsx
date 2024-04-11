import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

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
import Subscribers from "./pages/channel/Subscribers";
import Create from "./pages/Create";
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "send-feedback",
      element: <SendFeedback />,
    },
    {
      path: "settings",
      element: <Settings />,
    },
    {
      path: "auth",
      element: <AuthNotRequired />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
      ],
    },
    {
      element: <AuthRequired />,
      children: [
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "create",
          element: <Create />,
        },
        {
          path: "/c/:username",
          element: <ChannelLayout />,
          children: [
            {
              path: "",
              element: <Channel />,
            },
            {
              path: "videos",
              element: <Videos />,
            },
            {
              path: "tweets",
              element: <Tweets />,
            },
            {
              path: "playlists",
              element: <Playlists />,
            },
            {
              path: "subscribers",
              element: <Subscribers />,
            },
          ],
        },
        {
          path: "feed/subscriptions",
          element: <Subscriptions />,
        },
        {
          path: "playlist/:playlistId",
          element: <PlaylistVideos />,
        },
        {
          path: "watch/:videoId",
          element: <VideoPlayer />,
        },
        {
          path: "feed/history",
          element: <WatchHistory />,
        },
        {
          path: "watch-later",
          element: <WatchLater />,
        },
        {
          path: "liked-videos",
          element: <LikedVideos />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
