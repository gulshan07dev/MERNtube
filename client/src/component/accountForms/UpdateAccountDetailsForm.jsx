import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";

const UpdateAccountDetailsForm = ({
  initialAccountDetails,
  onSubmit,
  isLoading,
  error
}) => {
  const {
    formData,
    handleInputChange
  } = useForm(initialAccountDetails);
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
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </>
      }
      onSubmit={() => onSubmit(formData)}
    />
  );
};

export default UpdateAccountDetailsForm;
