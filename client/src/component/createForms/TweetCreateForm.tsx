import toast from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";

import tweetService from "@/services/tweetService";
import useService from "@/hooks/useService";
import Form from "@/component/CoreUI/Form";
import TextAreaInput from "../CoreUI/TextAreaInput";
import useForm from "@/hooks/useForm";

export default function TweetCreateForm() {
  const {
    error,
    isLoading,
    handler: createTweet,
  } = useService(tweetService.createTweet, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Creating tweet..." },
  });

  const initialAccountDetails = {
    content: "",
  };

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: initialAccountDetails,
  });

  const onSubmit = async () => {
    if (!formData.content) {
      return toast.error("Content is required!");
    }

    const { success, error } = await createTweet(formData);

    if (success && !error) {
      resetForm();
    }
  };

  return (
    <Form
      title={"Tweet"}
      description={
        "Craft your tweet in a flash with a concise and clear field for your thoughts. Express yourself with ease!."
      }
      submitButtonLabel={"Create tweet"}
      submitButtonIcon={<FaTwitter />}
      isButtonDisabled={Boolean(
        isLoading || !formData.content || formData.content.length < 25
      )}
      isLoading={isLoading}
      error={error?.message}
      inputs={
        <TextAreaInput
          label="Content"
          rows={6}
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
