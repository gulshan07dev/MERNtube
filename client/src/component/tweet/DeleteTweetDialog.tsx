import useActionHandler from "@/hooks/useActionHandler";
import { deleteTweet } from "@/store/slices/tweetSlice";
import Modal from "../CoreUI/Modal";
import Button from "../CoreUI/Button";

interface DeleteTweetDialogProps {
  open: boolean;
  handleClose: () => void;
  tweetId: string;
  onDelete: (isTweetDeleted: boolean) => void;
}

export default function DeleteTweetDialog({
  open,
  handleClose,
  tweetId,
  onDelete,
}: DeleteTweetDialogProps) {
  const { isLoading: isDeleting, handleAction: deleteTweetAction } =
    useActionHandler({
      action: deleteTweet,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting tweet..." },
    });

  const handleDeleteTweet = async () => {
    const { error, isSuccess } = await deleteTweetAction(tweetId);

    if (!error && isSuccess) {
      handleClose();
      onDelete(true);
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Delete Tweet"
      description="Are you sure you want to delete the tweet?"
      submitLabel={isDeleting ? "deleting..." : "Delete"}
      isLoading={isDeleting}
      onSubmit={() => handleDeleteTweet()}
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
