import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "@/layout/Layout";
import AuthForm, { AuthFormType } from "@/component/authForm/AuthForm";
import useActionHandler from "@/hooks/useActionHandler";
import { loginUser } from "@/store/slices/authSlice";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.redirectPath;

  const { isLoading, error, handleAction } = useActionHandler({
    action: loginUser,
    toastMessages: {
      loadingMessage: "Logging in...",
    },
  });

  const handleLogin = async ({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail?: string;
    password?: string;
  }) => {
    if (!usernameOrEmail || !password) {
      return toast.error("All fields are required!");
    }

    const { isSuccess } = await handleAction({ usernameOrEmail, password });

    if (isSuccess) {
      navigate(redirectPath ? redirectPath : "/");
    }
  };

  return (
    <Layout
      showNavigationBar={false}
      className="flex justify-center md:pt-24 pt-14 pb-7"
    >
      <AuthForm
        type={AuthFormType.LOGIN}
        title="Login account"
        handleSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        state={location.state}
      />
    </Layout>
  );
}
