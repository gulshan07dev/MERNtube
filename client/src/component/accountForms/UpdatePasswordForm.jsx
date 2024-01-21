import toast from "react-hot-toast";

import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";
import { changeUserPassword } from "@/store/slices/authSlice";
import useActionHandler from "@/hooks/useActionHandler";

const UpdatePasswordForm = () => {
  const { error, isLoading, handleAction } = useActionHandler(
    changeUserPassword,
    {
      loadingMessage: "Updating...",
    }
  );

  const initialUserPassword = { oldPassword: "", newPassword: "" };
  const { formData, handleInputChange, resetForm } =
    useForm(initialUserPassword);

  const onSubmit = async () => {
    if (!Object.values(formData).every((field) => field?.trim(" "))) {
      return toast.error("All fields are required!");
    }

    const { isSuccess } = await handleAction(formData);

    if (isSuccess) {
      resetForm();
    }
  };

  return (
    <Form
      title="Password"
      description="Make changes to your password here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={isLoading}
      error={error}
      inputs={
        <>
          <Input
            label="Old Password"
            type="password"
            value={formData.oldPassword}
            onChange={(e) => handleInputChange("oldPassword", e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
          />
        </>
      }
      onSubmit={onSubmit}
    />
  );
};

export default UpdatePasswordForm;
