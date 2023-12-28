import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthNotRequired() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}
