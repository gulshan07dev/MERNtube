import useActionHandler from "@/hooks/useActionHandler";
import Button from "../CoreUI/Button";
import Modal from "../CoreUI/Modal";
import { addVideoToWatchLater } from "@/store/slices/watchLaterSlice";

export default function AddVideoToWatchLaterDialog({
  videoId,
  open,
  handleClose,
}: {
  videoId: string;
  open: boolean;
  handleClose: () => void;
}) {
  const { isLoading, handleAction } = useActionHandler({
    action: addVideoToWatchLater,
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Adding video to watch later..." },
  });

  const handleAddVideoToWatchLater = async () => {
    const { isSuccess, error } = await handleAction(videoId);
    if (isSuccess && !error) {
      handleClose();
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Add Video To Watch Later"
      description="Are you sure you want to add this video to watch later?"
      closeButton={
        <Button
          className="w-full py-1.5 px-7 bg-red-600 border-none"
          disabled={isLoading}
        >
          Cancel
        </Button>
      }
      submitLabel="Add Video to watch later"
      onSubmit={handleAddVideoToWatchLater}
      isLoading={isLoading}
    />
  );
}
