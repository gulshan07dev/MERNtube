import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";

const UpdatePasswordForm = ({
  initialUserPassword,
  onSubmit,
  isLoading,
  error
}) => {
  const { formData, handleInputChange } = useForm(initialUserPassword);
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
      onSubmit={() => onSubmit(formData)}
    />
  );
};

export default UpdatePasswordForm;
