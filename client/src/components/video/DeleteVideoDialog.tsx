import Modal from "../Modal";
import videoService from "@/services/videoService";
import useService from "@/hooks/useService";

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
    videoService.deleteVideo,
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
    />
  );
}
