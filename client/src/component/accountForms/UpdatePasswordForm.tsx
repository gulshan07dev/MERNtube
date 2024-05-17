import toast from "react-hot-toast";

import Form from "@/component/CoreUI/Form";
import Input from "@/component/CoreUI/Input";
import useForm from "@/hooks/useForm";
import useService from "@/hooks/useService";
import AuthService from "@/services/authService";

const UpdatePasswordForm = () => {
  const {
    error,
    isLoading,
    handler: changeUserPassword,
  } = useService(AuthService.changeUserPassword, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Updating..." },
  });

  const initialUserPassword = { oldPassword: "", newPassword: "" };
  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: initialUserPassword,
  });

  const onSubmit = async () => {
    if (!Object.values(formData).every((field) => field?.trim())) {
      return toast.error("All fields are required!");
    }

    const { success } = await changeUserPassword(formData);

    if (success) {
      resetForm();
    }
  };

  return (
    <Form
      title="Password"
      description="Make changes to your password here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={isLoading}
      isButtonDisabled={isLoading || !Object.values(formData).every(Boolean)}
      error={error?.message}
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
