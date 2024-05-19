import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useDispatch } from "react-redux";

import authService from "@/services/authService";
import useService from "@/hooks/useService";
import { logout } from "@/store/slices/authSlice";
import Button from "../../component/CoreUI/Button";

export default function LogoutBtn({ className = "" }: { className?: string }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, handler: logoutUser } = useService(
    authService.logoutUser,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Logout..." },
    }
  );

  const handleLogout = async () => {
    const { success } = await logoutUser();

    if (success) {
      dispatch(logout());
      navigate("/");
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
