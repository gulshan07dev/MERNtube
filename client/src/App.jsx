import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import AuthNotRequired from "./helper/auth/AuthNotRequired";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { getCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    await dispatch(getCurrentUser());
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Authentication routes */}
      <Route element={<AuthNotRequired />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
