import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/AuthForm";
import useApiHandler from "../../hooks/useApiHandler";
import { loginUser } from "../../store/slices/authSlice";


export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async ({ usernameOrEmail, password }) => {
    if (!usernameOrEmail || !password) {
      return toast.error("All fields are required!");
    }

    setIsLoading(true);

    await useApiHandler(
      async () => dispatch(loginUser({ usernameOrEmail, password })),
      { loadingMessage: "Logging in..." }
    );

    setIsLoading(false);
  };

  return (
    <Layout isShowNavigationBar={false} className="bg-slate-50 flex justify-center pt-24">
      <AuthForm
        isLogin={true}
        title="Login account"
        handleSubmit={handleLogin}
        isLoading={isLoading}
      />
    </Layout>
  );
}
