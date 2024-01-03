import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Form from "@/component/Form";
import Input from "@/component/Input";
import useForm from "@/hooks/useForm";
import useApiHandler from "@/hooks/useApiHandler";
import { changeAccountDetails } from "@/store/slices/authSlice";

const UpdateAccountDetailsForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialAccountDetails = {
    username: user.username,
    fullName: user.fullName,
  };
  const { formData, handleInputChange } = useForm(initialAccountDetails);

  const onSubmit = async () => {
    if (!Object.values(formData).every((field) => field?.trim(" "))) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    setError(null);

    const { isSuccess, error } = await useApiHandler(
      async () => dispatch(changeAccountDetails(formData)),
      { loadingMessage: "Updating..." }
    );

    if (!isSuccess) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <Form
      title="Account"
      description="Make changes to your account here. Click save when you're done."
      submitButtonLabel="Save changes"
      isLoading={loading}
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
      onSubmit={onSubmit}
    />
  );
};

export default UpdateAccountDetailsForm;
