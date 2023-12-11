 import Layout from "./layout/Layout";
 import Home from "./pages/Home"
 import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" index element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;