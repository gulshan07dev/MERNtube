import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import AuthRequired from "./helper/auth/AuthRequired";
import AuthNotRequired from "./helper/auth/AuthNotRequired";
import { getCurrentUser, refreshAccessToken } from "./store/slices/authSlice";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Account from "./pages/Account";

function App() {
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    await dispatch(getCurrentUser());
  };

  const refreshToken = async () => {
    await dispatch(refreshAccessToken());
  };

  useEffect(() => {
    fetchCurrentUser();
    refreshToken();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* protected routes */}
      <Route element={<AuthRequired />}>
        <Route path="/account" element={<Account />} />
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
