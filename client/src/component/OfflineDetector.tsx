import React, { useEffect, useState } from "react";

import { WiRefresh } from "react-icons/wi";
import { FaWifi } from "react-icons/fa";
import Button from "./CoreUI/Button";

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

  return isOnline ? (
    <>{children}</>
  ) : (
    <div className="p-10 flex flex-col gap-10 justify-center items-center m-auto">
      <FaWifi className="-mt-16 text-7xl text-red-600 shadow-md rounded-full" />
      <p className="font-bold md:text-3xl text-2xl font-poppins -mt-5">
        Oops! You're offline.
      </p>
      <Button
        label="Refresh"
        icon={<WiRefresh />}
        onClick={() => window.location.reload()}
        className="bg-zinc-600 text-white border-none px-7 py-2.5 rounded-md text-lg font-hedvig_letters"
      />
    </div>
  );
};

export default OfflineDetector;
