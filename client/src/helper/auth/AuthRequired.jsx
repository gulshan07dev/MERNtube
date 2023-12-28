import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthRequired() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
}
