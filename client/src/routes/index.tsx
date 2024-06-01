import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import { lazy } from "react";
const AuthRequired = lazy(() => import("../helper/auth/AuthRequired"));
const AuthNotRequired = lazy(() => import("../helper/auth/AuthNotRequired"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Account = lazy(() => import("../pages/Account"));
const ChannelLayout = lazy(() => import("../layout/ChannelLayout"));
const Channel = lazy(() => import("../pages/channel/Channel"));
const Videos = lazy(() => import("../pages/channel/Videos"));
const Tweets = lazy(() => import("../pages/channel/Tweets"));
const Playlists = lazy(() => import("../pages/channel/Playlists"));
const Subscribers = lazy(() => import("../pages/channel/Subscribers"));
const Create = lazy(() => import("../pages/Create"));
const Settings = lazy(() => import("../pages/Settings"));
const PlaylistVideos = lazy(() => import("../pages/PlaylistVideos"));
const VideoPlayer = lazy(() => import("../pages/VideoPlayer "));
const WatchHistory = lazy(() => import("../pages/WatchHistory"));
const WatchLater = lazy(() => import("../pages/WatchLater"));
const LikedVideos = lazy(() => import("../pages/LikedVideos"));
const SendFeedback = lazy(() => import("../pages/SendFeedback"));
const Subscriptions = lazy(() => import("../pages/Subscriptions"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const SearchResult = lazy(() => import("@/pages/search/SearchResult"));


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
