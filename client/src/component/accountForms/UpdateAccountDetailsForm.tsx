import { useSelector } from "react-redux";

import Form from "@/component/CoreUI/Form";
import Input from "@/component/CoreUI/Input";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { changeAccountDetails } from "@/store/slices/authSlice";

import { RootState } from "@/store/store";

const UpdateAccountDetailsForm = () => {
  const { user } = useSelector((state: RootState) => state?.auth);

  const { error, isLoading, handleAction } = useActionHandler({
    action: changeAccountDetails,
    toastMessages: {
      loadingMessage: "Updating...",
    },
  });

  const initialAccountDetails = {
    username: user?.username,
    fullName: user?.fullName,
  };
  const { formData, handleInputChange } = useForm({
    initialFormState: initialAccountDetails,
  });

  const onSubmit = async () => {
    if (formData.username === user?.username) {
      return await handleAction({ fullName: formData.fullName });
    }
    return await handleAction(formData);
  };

  return (
    <Form
      title="Account"
      description="Make changes to your account here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={isLoading}
      isButtonDisabled={
        isLoading ||
        (user?.username === formData.username &&
          user?.fullName === formData.fullName)
      }
      error={error}
      inputs={
        <>
          <Input
            label="Username"
            type="text"
            value={formData?.username}
            minLength={3}
            maxTextSize={20}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
          <Input
            label="Full Name"
            type="text"
            value={formData?.fullName}
            minLength={3}
            maxTextSize={20}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </>
      }
      onSubmit={onSubmit}
    />
  );
};

export default UpdateAccountDetailsForm;
