import toast from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";

import Form from "@/component/CoreUI/Form";
import TextAreaInput from "../CoreUI/TextAreaInput";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { Tweet, createTweet, updateTweet } from "@/store/slices/tweetSlice";

export default function TweetCreateForm({ tweet }: { tweet?: Tweet | null }) {
  const { error, isLoading, handleAction } = useActionHandler({
    action: tweet ? updateTweet : createTweet,
    isShowToastMessage: true,
    toastMessages: {
      loadingMessage: tweet ? "Updating tweet" : "Creating Tweet",
    },
  });

  const initialAccountDetails = {
    content: tweet ? tweet?.content : "",
  };

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: initialAccountDetails,
  });

  const onSubmit = async () => {
    if (!formData.content) {
      return toast.error("Content is required!");
    }

    if (tweet) {
      await handleAction({ data: formData, tweetId: tweet?._id });
    } else {
      const { isSuccess } = await handleAction(formData);

      if (isSuccess && !tweet) {
        resetForm();
      }
    }
  };

  return (
    <Form
      title={tweet ? "Edit your tweet" : "Tweet"}
      description={
        tweet
          ? "Make changes to your tweet here. Click save when you're done."
          : "Craft your tweet in a flash with a concise and clear field for your thoughts. Express yourself with ease!."
      }
      submitButtonLabel={tweet ? "Save changes" : "Create tweet"}
      submitButtonIcon={<FaTwitter />}
      isButtonDisabled={Boolean(
        isLoading ||
          !formData.content ||
          formData.content.length < 25 ||
          (tweet && tweet?.content === formData.content)
      )}
      isLoading={isLoading}
      error={error}
      inputs={
        <TextAreaInput
          label="Content"
          rows={5}
          maxTextSize={300}
          minLength={20}
          value={formData?.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
        />
      }
      onSubmit={onSubmit}
    />
  );
}
