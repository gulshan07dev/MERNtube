import { useState } from "react";
import { FaTrash } from "react-icons/fa";

import watchHistoryService from "@/services/watchHistoryService";
import useService from "@/hooks/useService";
import Button from "../../CoreUI/Button";
import Modal from "../../Modal";

export default function ClearWatchHistory() {
  const [
    isShowClearWatchHistoryConfirmDialog,
    setIsShowClearWatchHistoryConfirmDialog,
  ] = useState(false);

  const { isLoading, handler: clearWatchHistory } = useService(
    watchHistoryService.clearWatchHistory,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Cleaning watch history..." },
    }
  );

  const handleClearWatchHistory = async () => {
    const { success, error } = await clearWatchHistory();
    if (success && !error) {
      setIsShowClearWatchHistoryConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        className="-ml-4 bg-transparent text-lg text-gray-700 dark:text-gray-300 rounded-full hover:opacity-1 hover:bg-slate-200 dark:hover:bg-[#505050] py-2"
        icon={<FaTrash />}
        onClick={() => setIsShowClearWatchHistoryConfirmDialog((prev) => !prev)}
      >
        Clear all watch history
      </Button>
      <Modal
        open={isShowClearWatchHistoryConfirmDialog}
        handleClose={() => setIsShowClearWatchHistoryConfirmDialog(false)}
        title="Clear Watch History"
        description="Are you sure you want to clear the watch history?"
        isLoading={isLoading}
        submitLabel={isLoading ? "Cleaning" : "Clear"}
        onSubmit={handleClearWatchHistory}
      />
    </>
  );
}
