import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/AuthForm";
import useApiHandler from "../../hooks/useApiHandler";
import { registerUser } from "../../store/slices/authSlice";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async ({
    fullName,
    email,
    password,
    avatar,
    coverImage,
  }) => {
    if (!fullName || !email || !password) {
      return toast.error("All fields are required!");
    }

    setIsLoading(true);

    const { isSuccess, error } = await useApiHandler(
      () =>
        dispatch(
          registerUser({ fullName, email, password, avatar, coverImage })
        ),
      { loadingMessage: "Creating your account..." }
    );
    setError(error);
    setIsLoading(false);

    if (isSuccess) {
      navigate("/auth/login", { state: { usernameOrEmail: email, password } });
    }
  };

  return (
    <Layout
      showNavigationBar={false}
      className="bg-slate-50 flex justify-center md:pt-5 pt-3 pb-7"
    >
      <AuthForm
        isLogin={false}
        title="Create an account"
        handleSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />
    </Layout>
  );
}
