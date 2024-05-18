import Modal from "../CoreUI/Modal";
import VideoService from "@/services/videoService";
import useService from "@/hooks/useService";
import Button from "../CoreUI/Button";

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
  const { isLoading: isDeleting, handler: deleteVideo } = useService(
    VideoService.deleteVideo,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting video..." },
    }
  );

  const handleDeleteVideo = async () => {
    const { error, success } = await deleteVideo(videoId);

    if (!error && success) {
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
