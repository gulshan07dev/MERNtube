import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPause, FaPlayCircle } from "react-icons/fa";

import watchHistoryService from "@/services/watchHistoryService";
import useService from "@/hooks/useService";
import { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";
import ToggleButton from "../../CoreUI/ToggleButton"; 

export default function ToggleWatchHistoryPauseStatus() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state?.auth);
  const [isWatchHistoryPaused, setIsWatchHistoryPaused] = useState(
    user?.isWatchHistoryPaused
  );

  const { isLoading, handler: toggleWatchHistoryPauseStatus } = useService(
    watchHistoryService.toggleWatchHistoryPauseStatus,
    {
      isShowToastMessage: true,
      toastMessages: {
        loadingMessage: `toggling watch history status to ${!isWatchHistoryPaused}`,
      }
    }
  );

  const handleToggleWatchHistoryPauseStatus = async () => {
    const { success, error } = await toggleWatchHistoryPauseStatus();
    if (success && !error) {
      dispatch(setUser({ isWatchHistoryPaused: !isWatchHistoryPaused }));
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
