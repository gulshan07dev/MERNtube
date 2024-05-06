import DeniedAccess from "@/pages/DeniedAccess";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

import { RootState } from "@/store/store";

export default function AuthRequired() {
  const location = useLocation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <DeniedAccess redirectPath={location.pathname} />
  );
}
