import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "@/layout/Layout";
import AuthForm, { AuthFormType } from "@/component/authForm/AuthForm";
import useActionHandler from "@/hooks/useActionHandler";
import { loginUser } from "@/store/slices/authSlice";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoading, error, handleAction } = useActionHandler({
    action: loginUser,
    toastMessages: {
      loadingMessage: "Logging in...",
    },
  });

  const handleLogin = async (formData: {
    usernameOrEmail?: string;
    password?: string;
  }) => {
    if (!formData.usernameOrEmail || !formData.password) {
      return toast.error("All fields are required!");
    }

    const { isSuccess } = await handleAction(formData);

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
