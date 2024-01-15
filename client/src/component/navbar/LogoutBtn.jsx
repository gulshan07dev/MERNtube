import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Button from "../Button";
import useApiHandler from "@/hooks/useApiHandler";
import { logoutUser } from "@/store/slices/authSlice";

export default function LogoutBtn({ className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const { isSuccess, error } = await useApiHandler(
      () => dispatch(logoutUser()),
      true,
      { loadingMessage: "Logout..." }
    );

    setIsLoading(false);

    if (isSuccess) {
      navigate("/");
    }
  };
  return (
    <Button
      label={isLoading ? "Logout..." : "Logout"}
      isLarge={false}
      onClick={handleLogout}
      disabled={isLoading}
      className={twMerge("bg-red-500 text-sm", className)}
    />
  );
}
