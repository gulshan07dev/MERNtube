import React, { useEffect, useState } from "react";

import { FaWifi } from "react-icons/fa";
import ErrorDialog from "./error/ErrorDialog";

interface OfflineDetectorProps {
  children: React.ReactNode;
}

const OfflineDetector: React.FC<OfflineDetectorProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return isOnline ? (
    <>{children}</>
  ) : (
    <ErrorDialog
      errorMessage="Oops! You're offline."
      buttonLabel="Refresh"
      buttonOnClick={handleRefresh}
      icon={<FaWifi />}
    />
  );
};

export default OfflineDetector;
