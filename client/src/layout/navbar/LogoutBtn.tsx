import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Button from "../../component/CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { logoutUser } from "@/store/slices/authSlice";

export default function LogoutBtn({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  const { isLoading, handleAction } = useActionHandler({
    action: logoutUser,
    toastMessages: {
      loadingMessage: "Logout...",
    },
  });

  const handleLogout = async () => {
    const { isSuccess } = await handleAction();

    if (isSuccess) {
      navigate("/");
      window.location.reload();
    }
  };
  return (
    <Button
      isLarge={false}
      onClick={handleLogout}
      disabled={isLoading}
      className={twMerge("bg-red-500 text-sm", className)}
    >
      {isLoading ? "Logout..." : "Logout"}
    </Button>
  );
}
