import useActionHandler from "@/hooks/useActionHandler";
import Button from "../CoreUI/Button";
import Modal from "../CoreUI/Modal";
import { removeVideoFromWatchLater } from "@/store/slices/watchLaterSlice";

export default function RemoveVideoFromWatchLaterDialog({
  videoId,
  open,
  handleClose,
  onRemove,
}: {
  videoId: string;
  open: boolean;
  handleClose: () => void;
  onRemove: () => void;
}) {
  const { isLoading, handleAction } = useActionHandler({
    action: removeVideoFromWatchLater,
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Removing video from watch later..." },
  });

  const handleRemoveVideoFromWatchLater = async () => {
    const { isSuccess, error } = await handleAction(videoId);
    if (isSuccess && !error) {
      onRemove();
      handleClose();
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Remove Video From Watch Later"
      description="Are you sure you want to remove this video from watch later?"
      closeButton={
        <Button
          className="w-full py-1.5 px-7 bg-red-600 border-none"
          disabled={isLoading}
        >
          Cancel
        </Button>
      }
      submitLabel="Remove"
      onSubmit={handleRemoveVideoFromWatchLater}
      isLoading={isLoading}
    />
  );
}
