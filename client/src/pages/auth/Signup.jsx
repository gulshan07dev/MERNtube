import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/AuthForm";
import useApiHandler from "../../hooks/useApiHandler";
import { registerUser } from "../../store/slices/authSlice";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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

    await useApiHandler(
      () =>
        dispatch(
          registerUser({ fullName, email, password, avatar, coverImage })
        ),
      { loadingMessage: "Creating your account..." }
    );

    setIsLoading(false);
  };

  return (
    <Layout isShowNavigationBar={false} className="bg-slate-50 flex justify-center pt-5">
      <AuthForm
        isLogin={false}
        title="Create an account"
        handleSubmit={handleSignup}
        isLoading={isLoading}
      />
    </Layout>
  );
}
