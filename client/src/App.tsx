import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import AuthRequired from "./helper/auth/AuthRequired";
import AuthNotRequired from "./helper/auth/AuthNotRequired";
import { getCurrentUser, refreshAccessToken } from "./store/slices/authSlice";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Account from "./pages/Account";
import ChannelLayout from "./layout/ChannelLayout";
import Channel from "./pages/channel/Channel";
import Videos from "./pages/channel/Videos";
import Tweets from "./pages/channel/Tweets";
import { AppDispatch } from "./store/store";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    await dispatch(getCurrentUser());
    setLoading(false);
  };

  const refreshToken = async () => {
    await dispatch(refreshAccessToken());
  };

  useEffect(() => {
    fetchCurrentUser();
    refreshToken();
  }, []);
  return (
    !loading && (
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
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthNotRequired />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
      </Routes>
    )
  );
}

export default App;
