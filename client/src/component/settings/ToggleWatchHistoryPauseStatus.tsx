import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { useState } from "react";
import ToggleButton from "../CoreUI/ToggleButton";
import useActionHandler from "@/hooks/useActionHandler";
import { toggleWatchHistoryPauseStatus } from "@/store/slices/watchHistorySlice";

export default function ToggleWatchHistoryPauseStatus() {
  const { user } = useSelector((state: RootState) => state?.auth);
  const [isWatchHistoryPaused, setIsWatchHistoryPaused] = useState(
    user?.isWatchHistoryPaused
  );

  const {isLoading, handleAction} = useActionHandler({
    action: toggleWatchHistoryPauseStatus,
    isShowToastMessage: true,
    toastMessages: {
      loadingMessage: `toggling watch history status to ${!isWatchHistoryPaused}`,
    },
  });

  const handleToggleWatchHistoryPauseStatus = async () => {
    const {isSuccess, error} = await handleAction()
    if(isSuccess && !error) {
        setIsWatchHistoryPaused((prev) => !prev)
    }
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <h3 className="text-lg text-gray-700 dark:text-gray-300">
        isWatchHistoryPaused
      </h3>
      <ToggleButton
        value={Boolean(isWatchHistoryPaused)}
        onChange={handleToggleWatchHistoryPauseStatus}
        disabled={isLoading}
      />
    </div>
  );
}
