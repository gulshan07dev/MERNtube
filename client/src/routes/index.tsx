import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import AuthRequired from "../helper/auth/AuthRequired";
import AuthNotRequired from "../helper/auth/AuthNotRequired";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Account from "../pages/Account";
import ChannelLayout from "../layout/ChannelLayout";
import Channel from "../pages/channel/Channel";
import Videos from "../pages/channel/Videos";
import Tweets from "../pages/channel/Tweets";
import Playlists from "../pages/channel/Playlists";
import Subscribers from "../pages/channel/Subscribers";
import Create from "../pages/Create";
import Settings from "../pages/Settings";
import PlaylistVideos from "../pages/PlaylistVideos";
import VideoPlayer from "../pages/VideoPlayer ";
import WatchHistory from "../pages/WatchHistory";
import WatchLater from "../pages/WatchLater";
import LikedVideos from "../pages/LikedVideos";
import SendFeedback from "../pages/SendFeedback";
import Subscriptions from "../pages/Subscriptions";
import Dashboard from "../pages/Dashboard";
import SearchResult from "@/pages/search/SearchResult";

const router = createBrowserRouter([
  {
    path: "auth",
    element: <RootLayout showNavigation={false} />,
    children: [
      {
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
    ],
  },

  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchResult />,
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
            path: "playlists/:playlistId",
            element: <PlaylistVideos />,
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
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  {
    element: <RootLayout byDefaultSidebarHidden />,
    children: [
      {
        element: <AuthRequired />,
        children: [
          {
            path: "watch/:videoId",
            element: <VideoPlayer />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "send-feedback",
            element: <SendFeedback />,
          },
        ],
      },
    ],
  },
]);

export default router;