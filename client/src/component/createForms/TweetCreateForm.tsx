import toast from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";

import Form from "@/component/CoreUI/Form";
import TextAreaInput from "../CoreUI/TextAreaInput";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { createTweet } from "@/store/slices/tweetSlice";

export default function TweetCreateForm() {
  const { error, isLoading, handleAction } = useActionHandler({
    action: createTweet,
    toastMessages: {
      loadingMessage: "Creating Tweet",
    },
  });

  const initialAccountDetails = {
    content: "",
  };

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: initialAccountDetails,
  });

  const onSubmit = async () => {
    if (!formData.content) {
      return toast.error("content is required!");
    }

    const { isSuccess } = await handleAction(formData);

    if (isSuccess) {
      resetForm();
    }
  };

  return (
    <Form
      title="Tweet"
      description="Craft your tweet in a flash with a concise and clear field for your thoughts. Express yourself with ease!."
      submitButtonLabel="Create tweet"
      submitButtonIcon={<FaTwitter />}
      isButtonDisabled={isLoading || formData.content.length < 25}
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