import { useSelector } from "react-redux";

import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { changeAccountDetails } from "@/store/slices/authSlice";

const UpdateAccountDetailsForm = () => {
  const { user } = useSelector((state) => state?.auth);

  const { error, isLoading, handleAction } = useActionHandler(
    changeAccountDetails,
    {
      loadingMessage: "Updating...",
    }
  );

  const initialAccountDetails = {
    username: user?.username,
    fullName: user?.fullName,
  };
  const { formData, handleInputChange } = useForm(initialAccountDetails);

  const onSubmit = async () => {
    await handleAction(formData);
  };

  return (
    <Form
      title="Account"
      description="Make changes to your account here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={isLoading}
      error={error}
      inputs={
        <>
          <Input
            label="Username"
            type="text"
            value={formData?.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
          <Input
            label="Full Name"
            type="text"
            value={formData?.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </>
      }
      onSubmit={onSubmit}
    />
  );
};

export default UpdateAccountDetailsForm;
