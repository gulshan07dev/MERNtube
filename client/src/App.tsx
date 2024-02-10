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
import Create from "./pages/Create";
import TweetEdit from "./pages/edit/TweetEdit";

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setUserLoading(true));

      try {
        await dispatch(getCurrentUser());
      } catch (error) {
        console.error(error);

        // If there's an error, try refreshing the access token
        await dispatch(refreshAccessToken());

        // Retry fetching the current user after refreshing the token
        await dispatch(getCurrentUser());
      } finally {
        dispatch(setUserLoading(false));
      }
    })();
  }, []);

  return (
    <Routes>
      {/* home page */}
      <Route path="/" element={<Home />} />

      {/* ....protected routes.... */}
      <Route element={<AuthRequired />}>
        {/* account */}
        <Route path="/account" element={<Account />} />

        {/* channel */}
        <Route path="/c/:username" element={<ChannelLayout />}>
          <Route path="" element={<Channel />} />
          <Route path="videos" element={<Videos />} />
          <Route path="tweets" element={<Tweets />} />
        </Route>

        {/* create */}
        <Route path="/create" element={<Create />} />

        {/* edit */}
        <Route path="/edit">
           <Route path="tweet/:tweetId" element={<TweetEdit />} />
        </Route>
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
