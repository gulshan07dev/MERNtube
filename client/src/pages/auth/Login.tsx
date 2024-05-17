import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import PageLayout from "@/layout/PageLayout";
import AuthForm, { AuthFormType } from "@/component/authForm/AuthForm";
import useService from "@/hooks/useService";
import AuthService from "@/services/authService";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.redirectPath;

  const {
    isLoading,
    error,
    handler: loginUser,
  } = useService(AuthService.loginUser, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Logging in..." },
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

    const { success, responseData } = await loginUser({
      usernameOrEmail,
      password,
    });

    if (success) {
      dispatch(login(responseData?.data.user));
      navigate(redirectPath ? redirectPath : "/");
    }
  };

  return (
    <PageLayout className="flex justify-center items-center">
      <AuthForm
        type={AuthFormType.LOGIN}
        title="Login account"
        handleSubmit={handleLogin}
        isLoading={isLoading}
        error={error?.message}
        state={location.state}
      />
    </PageLayout>
  );
}
