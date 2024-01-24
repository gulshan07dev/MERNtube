import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

import { RootState } from "@/store/store";

export default function AuthNotRequired() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}
