import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/AuthForm";
import useActionHandler from "@/hooks/useActionHandler";
import { registerUser } from "../../store/slices/authSlice";

export default function Signup() {
  const navigate = useNavigate();

  const { error, isLoading, handleAction } = useActionHandler(registerUser, {
    loadingMessage: "Creating your account...",
  });

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

    const { isSuccess } = await handleAction({
      fullName,
      email,
      password,
      avatar,
      coverImage,
    });

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
