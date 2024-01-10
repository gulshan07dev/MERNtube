import DeniedAccess from "@/component/DeniedAccess";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function AuthRequired() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? <Outlet /> : <DeniedAccess />;
}
