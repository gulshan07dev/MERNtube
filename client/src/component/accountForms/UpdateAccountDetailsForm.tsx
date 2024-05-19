import { useDispatch, useSelector } from "react-redux";

import Form from "@/component/CoreUI/Form";
import Input from "@/component/CoreUI/Input";
import useForm from "@/hooks/useForm";
import { RootState } from "@/store/store";
import authService from "@/services/authService";
import useService from "@/hooks/useService";
import { setUser } from "@/store/slices/authSlice";

const UpdateAccountDetailsForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state?.auth);

  const {
    error,
    isLoading,
    handler: changeAccountDetails,
  } = useService(authService.changeAccountDetails, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Updating..." },
  });

  const initialAccountDetails = {
    username: user?.username,
    fullName: user?.fullName,
  };
  const { formData, handleInputChange } = useForm({
    initialFormState: initialAccountDetails,
  });

  const onSubmit = async () => {
    const { success, responseData } = await changeAccountDetails({
      ...formData,
      username: user?.username === formData.username ? "" : formData.username,
    });
    if (success) {
      dispatch(setUser(responseData?.data.user));
    }
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
      error={error?.message}
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
