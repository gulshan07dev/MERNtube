import { useState } from "react";
import { useDispatch } from "react-redux";
import {useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/AuthForm";
import useApiHandler from "../../hooks/useApiHandler";
import { loginUser } from "../../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ usernameOrEmail, password }) => {
    if (!usernameOrEmail || !password) {
      return toast.error("All fields are required!");
    }

    setIsLoading(true);

    const { isSuccess, error } = await useApiHandler(
      async () => dispatch(loginUser({ usernameOrEmail, password })),
      { loadingMessage: "Logging in..." }
    );

    setError(error);
    setIsLoading(false);

    if (isSuccess) {
      navigate("/");
    }
  };

  return (
    <Layout
      showNavigationBar={false}
      className="bg-slate-50 flex justify-center md:pt-24 pt-14 pb-7"
    >
      <AuthForm
        isLogin={true}
        title="Login account"
        handleSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        state={location.state}
      />
    </Layout>
  );
}
