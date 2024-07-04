import watchLaterService from "@/services/watchLaterService";
import useService from "@/hooks/useService";
import Modal from "../Modal";

export default function AddVideoToWatchLaterDialog({
  videoId,
  open,
  handleClose,
}: {
  videoId: string;
  open: boolean;
  handleClose: () => void;
}) {
  const { isLoading, handler: addVideoToWatchLater } = useService(
    watchLaterService.addVideoToWatchLater,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Adding video to watch later..." },
    }
  );

  const handleAddVideoToWatchLater = async () => {
    const { success, error } = await addVideoToWatchLater(videoId);
    if (success && !error) {
      handleClose();
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Add Video To Watch Later"
      description="Are you sure you want to add this video to watch later?"
      submitLabel="Add to watch later"
      onSubmit={handleAddVideoToWatchLater}
      isLoading={isLoading}
    />
  );
}
