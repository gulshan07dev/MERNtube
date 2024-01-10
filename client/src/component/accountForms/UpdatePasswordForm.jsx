import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";
import { changeUserPassword } from "@/store/slices/authSlice";
import useApiHandler from "@/hooks/useApiHandler";

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialUserPassword = { oldPassword: "", newPassword: "" };
  const { formData, handleInputChange, resetForm } =
    useForm(initialUserPassword);

  const onSubmit = async () => {
    if (!Object.values(formData).every((field) => field?.trim(" "))) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    setError(null);

    const { isSuccess, error } = await useApiHandler(
      async () => dispatch(changeUserPassword(formData)),
      true,
      { loadingMessage: "Updating..." }
    );

    if (isSuccess) {
      resetForm();
    } else {
      setError(error);
    }

    setLoading(false);
  };

  return (
    <Form
      title="Password"
      description="Make changes to your password here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={loading}
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
