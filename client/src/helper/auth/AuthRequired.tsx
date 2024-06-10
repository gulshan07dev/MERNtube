import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import { RootState } from "@/store/store";
import Modal from "@/component/Modal";
import { useState } from "react";

export default function AuthRequired() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDeniedAccessModalOpen, setIsDeniedAccessModalOpen] = useState(true);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Modal
      open={isDeniedAccessModalOpen}
      handleClose={() => setIsDeniedAccessModalOpen(false)}
      onClose={() => {
        history.back();
      }}
      title="Access Denied"
      icon={<FiAlertTriangle className="text-red-500" />}
      description="Oops! It seems like you are not authenticated and don't have the
          necessary permissions to access this page. Please login or signup to
          access the page."
      submitLabel="login / signup"
      onSubmit={() =>
        navigate("/auth/login", {
          state: { redirectPath: location.pathname },
        })
      }
    />
  );
}
