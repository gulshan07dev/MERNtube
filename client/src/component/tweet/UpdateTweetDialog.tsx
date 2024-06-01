import { ITweet } from "@/interfaces";
import Modal from "../Modal";
import TextAreaInput from "../CoreUI/TextAreaInput";
import useForm from "@/hooks/useForm";
import useService from "@/hooks/useService";
import tweetService from "@/services/tweetService";

interface UpdateTweetDialogProps {
  open: boolean;
  handleClose: () => void;
  tweet: ITweet;
  onUpdate: (content: string) => void;
}

export default function UpdateTweetDialog({
  open,
  handleClose,
  tweet,
  onUpdate,
}: UpdateTweetDialogProps) {
  const { formData, handleInputChange } = useForm({
    initialFormState: { content: tweet?.content },
  });

  const { isLoading, handler: updateTweet } = useService(
    tweetService.updateTweet,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "updating tweet..." },
    }
  );

  const handleSubmitForm = async () => {
    const { success, error } = await updateTweet({
      tweetId: tweet?._id,
      data: { content: formData?.content },
    });
    if (success && !error) {
      handleClose();
      onUpdate(formData?.content);
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Update Tweet"
      description="update your tweet by providing new content"
      submitLabel={isLoading ? "loading..." : "Update Tweet"}
      onSubmit={handleSubmitForm}
      isSubmitButtonDisabled={formData?.content?.length < 25}
      isLoading={isLoading}
      className="flex flex-col gap-4"
    >
      <form
        className="flex flex-col pt-3 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm();
        }}
      >
        <TextAreaInput
          label="Content"
          rows={8}
          value={formData?.content}
          maxTextSize={250}
          onChange={(e) => handleInputChange("content", e.target.value)}
        />
      </form>
    </Modal>
  );
}
