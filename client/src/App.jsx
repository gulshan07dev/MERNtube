import Layout from "./layout/Layout";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

function App() {
  return (
    <Layout>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />

        {/* protected routes */}

        {/* authentication routes */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
