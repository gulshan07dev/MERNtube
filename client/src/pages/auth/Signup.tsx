import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageLayout from "@/layout/PageLayout";
import AuthForm, {
  AuthFormType,
  AuthInputs,
} from "@/component/authForm/AuthForm";
import AuthService from "@/services/authService";
import useService from "@/hooks/useService";

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location?.state?.redirectPath;

  const {
    isLoading,
    error,
    handler: registerUser,
  } = useService(AuthService.registerUser, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Creating your account" },
  });

  const handleSignup = async ({
    fullName,
    email,
    password,
    avatar,
    coverImage,
  }: AuthInputs) => {
    if (!fullName || !email || !password) {
      return toast.error("All fields are required!");
    }

    const { success } = await registerUser({
      fullName,
      email,
      password,
      avatar,
      coverImage,
    });

    if (success) {
      navigate("/auth/login", {
        state: {
          usernameOrEmail: email,
          password,
          redirectPath: redirectPath || undefined,
        },
      });
    }
  };

  return (
    <PageLayout className="flex justify-center">
      <AuthForm
        type={AuthFormType.SIGNUP}
        title="Create an account"
        handleSubmit={handleSignup}
        isLoading={isLoading}
        error={error?.message}
      />
    </PageLayout>
  );
}
