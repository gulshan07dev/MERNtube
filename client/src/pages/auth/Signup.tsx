import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "@/layout/Layout";
import AuthForm, { AuthFormType } from "@/component/authForm/AuthForm";
import useActionHandler from "@/hooks/useActionHandler";
import { registerUser } from "@/store/slices/authSlice";

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { redirectPath } = location.state;

  const { error, isLoading, handleAction } = useActionHandler({
    action: registerUser,
    toastMessages: {
      loadingMessage: "Creating your account...",
    },
  });

  const handleSignup = async ({
    fullName,
    email,
    password,
    avatar,
    coverImage,
  }: {
    fullName?: string;
    email?: string;
    password?: string;
    avatar?: File;
    coverImage?: File;
  }) => {
    if (!fullName || !email || !password) {
      return toast.error("All fields are required!");
    }

    const { isSuccess } = await handleAction({
      fullName,
      email,
      password,
      avatar,
      coverImage,
    });

    if (isSuccess) {
      navigate("/auth/login", {
        state: { usernameOrEmail: email, password, redirectPath },
      });
    }
  };

  return (
    <Layout
      showNavigationBar={false}
      className="bg-slate-50 dark:bg-dark_bg flex justify-center md:pt-5 pt-3 pb-7"
    >
      <AuthForm
        type={AuthFormType.SIGNUP}
        title="Create an account"
        handleSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />
    </Layout>
  );
}
