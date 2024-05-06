import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageLayout from "@/layout/PageLayout";
import AuthForm, {
  AuthFormType,
  AuthInputs,
} from "@/component/authForm/AuthForm";
import useActionHandler from "@/hooks/useActionHandler";
import { registerUser } from "@/store/slices/authSlice";

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location?.state?.redirectPath;

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
  }: AuthInputs) => {
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
        error={error}
      />
    </PageLayout>
  );
}
