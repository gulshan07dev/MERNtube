import watchLaterService from "@/services/watchLaterService";
import useService from "@/hooks/useService";
import Modal from "../Modal";

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
  const { isLoading, handler: removeVideoFromWatchLater } = useService(
    watchLaterService.removeVideoFromWatchLater,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Removing video from watch later..." },
    }
  );

  const handleRemoveVideoFromWatchLater = async () => {
    const { success, error } = await removeVideoFromWatchLater(videoId);
    if (success && !error) {
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
      submitLabel="Remove"
      onSubmit={handleRemoveVideoFromWatchLater}
      isLoading={isLoading}
    />
  );
}
