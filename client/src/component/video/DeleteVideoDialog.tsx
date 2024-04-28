import useActionHandler from "@/hooks/useActionHandler";
import Modal from "../CoreUI/Modal";
import Button from "../CoreUI/Button";
import { deleteVideo } from "@/store/slices/videoSlice";

interface DeleteVideoDialogProps {
  open: boolean;
  handleClose: () => void;
  videoId: string;
  onDelete: (isVideoDeleted: boolean) => void;
}

export default function DeleteVideoDialog({
  open,
  handleClose,
  videoId,
  onDelete,
}: DeleteVideoDialogProps) {
  const { isLoading: isDeleting, handleAction: deleteVideoAction } =
    useActionHandler({
      action: deleteVideo,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting video..." },
    });

  const handleDeleteVideo = async () => {
    const { error, isSuccess } = await deleteVideoAction(videoId);

    if (!error && isSuccess) {
      handleClose();
      onDelete(true);
    } else {
      onDelete(false);
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Delete Video"
      description="Are you sure you want to delete the video?"
      submitLabel={isDeleting ? "deleting..." : "Delete"}
      isLoading={isDeleting}
      onSubmit={handleDeleteVideo}
      closeButton={
        <Button
          className="w-full py-1.5 px-7 bg-red-600 border-none"
          disabled={isDeleting}
        >
          Cancel
        </Button>
      }
    />
  );
}
