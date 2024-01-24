import DeniedAccess from "@/component/DeniedAccess";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { RootState } from "@/store/store";

export default function AuthRequired() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return isLoggedIn ? <Outlet /> : <DeniedAccess />;
}
