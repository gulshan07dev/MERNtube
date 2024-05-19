import { useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import Modal from "../CoreUI/Modal";
import FileUpload from "../FileUpload";
import useForm from "@/hooks/useForm";
import useService from "@/hooks/useService";
import authService from "@/services/authService";
import { setUser } from "@/store/slices/authSlice";

interface UpdateAvatarDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function UpdateAvatarDialog({
  open,
  handleClose,
}: UpdateAvatarDialogProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  interface initialFormState {
    avatar: File | null;
  }

  const { formData, resetForm, handleInputChange } = useForm<initialFormState>({
    initialFormState: { avatar: null },
  });

  const { isLoading, handler: changeUserAvatar } = useService(
    authService.changeUserAvatar,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Updating avatar..." },
    }
  );

  const onSubmit = async () => {
    if (!formData.avatar) {
      return toast.error("Avatar is required!");
    }

    const { success, error, responseData } = await changeUserAvatar(formData);

    if (success && !error) {
      dispatch(setUser({ avatar: responseData?.data?.user?.avatar}));
      handleClose();
      resetForm();
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Update Avatar"
      description="update your avatar by uploading new picture"
      isLoading={isLoading}
      submitLabel="Update"
      onSubmit={onSubmit}
      isSubmitButtonDisabled={!formData.avatar}
    >
      <FileUpload
        label="Avatar"
        defaultImageSrc={user?.avatar || "/default-avatar.webp"}
        accept=".png, .jpeg, .jpg"
        fileType="image"
        ref={avatarRef}
        className="size-32 m-auto rounded-full"
        disabled={isLoading}
        onChange={(file) => handleInputChange("avatar", file)}
      />
    </Modal>
  );
}
