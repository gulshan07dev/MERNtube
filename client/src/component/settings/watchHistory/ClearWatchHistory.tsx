import { FaTrash } from "react-icons/fa";

import Button from "../../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { clearWatchHistory } from "@/store/slices/watchHistorySlice";
import Modal from "../../CoreUI/Modal";
import { useState } from "react";

export default function ClearWatchHistory() {
  const [
    isShowClearWatchHistoryConfirmDialog,
    setIsShowClearWatchHistoryConfirmDialog,
  ] = useState(false);

  const { isLoading, handleAction } = useActionHandler({
    action: clearWatchHistory,
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Cleaning watch history..." },
  });

  const handleClearWatchHistory = async () => {
    const { isSuccess, error } = await handleAction();
    if (isSuccess && !error) {
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
        closeButton={
          <Button
            className="w-full py-1.5 px-7 bg-red-600 border-none"
            disabled={isLoading}
          >
            Cancel
          </Button>
        }
        submitLabel={isLoading ? "Cleaning" : "Clear"}
        onSubmit={handleClearWatchHistory}
      />
    </>
  );
}
