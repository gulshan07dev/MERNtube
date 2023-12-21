import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Authentication routes */}
      <Route
        path="/auth"
        children={
          <>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </>
        }
      />
    </Routes>
  );
}

export default App;
