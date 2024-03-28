import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { useState } from "react";
import ToggleButton from "../../CoreUI/ToggleButton";
import useActionHandler from "@/hooks/useActionHandler";
import { toggleWatchHistoryPauseStatus } from "@/store/slices/watchHistorySlice";
import { FaPause, FaPlayCircle } from "react-icons/fa";

export default function ToggleWatchHistoryPauseStatus() {
  const { user } = useSelector((state: RootState) => state?.auth);
  const [isWatchHistoryPaused, setIsWatchHistoryPaused] = useState(
    user?.isWatchHistoryPaused
  );

  const { isLoading, handleAction } = useActionHandler({
    action: toggleWatchHistoryPauseStatus,
    isShowToastMessage: true,
    toastMessages: {
      loadingMessage: `toggling watch history status to ${!isWatchHistoryPaused}`,
    },
  });

  const handleToggleWatchHistoryPauseStatus = async () => {
    const { isSuccess, error } = await handleAction();
    if (isSuccess && !error) {
      setIsWatchHistoryPaused((prev) => !prev);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-5">
      <h3 className="text-lg text-gray-700 dark:text-gray-300 flex gap-2 items-center">
        {isWatchHistoryPaused ? <FaPlayCircle /> : <FaPause />} 
        {isWatchHistoryPaused ? "Resume watch history" : "Pause watch history"}
      </h3>
      <ToggleButton
        value={Boolean(isWatchHistoryPaused)}
        onChange={handleToggleWatchHistoryPauseStatus}
        disabled={isLoading}
      />
    </div>
  );
}
