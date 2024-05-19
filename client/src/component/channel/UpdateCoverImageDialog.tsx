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

interface UpdateCoverImageDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function UpdateCoverImageDialog({
  open,
  handleClose,
}: UpdateCoverImageDialogProps) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth);
  const coverImageRef = useRef<HTMLInputElement | null>(null);

  interface initialFormState {
    coverImage: File | null;
  }

  const { formData, resetForm, handleInputChange } = useForm<initialFormState>({
    initialFormState: { coverImage: null },
  });

  const { isLoading, handler: changeCoverImage } = useService(
    authService.changeCoverImage,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Updating cover image..." },
    }
  );

  const onSubmit = async () => {
    if (!formData.coverImage) {
      return toast.error("Cover Image is required!");
    }

    const { success, error, responseData } = await changeCoverImage(formData);

    if (success && !error) {
      dispatch(setUser({coverImage: responseData?.data?.user?.coverImage}))
      handleClose();
      resetForm();
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Update Cover Image"
      description="update your cover image by uploading new one"
      isLoading={isLoading}
      submitLabel="Update"
      onSubmit={onSubmit}
      isSubmitButtonDisabled={!formData.coverImage}
    >
      <FileUpload
        label="Cover Image"
        defaultImageSrc={user?.coverImage || "/default-cover.webp"}
        accept=".png, .jpeg, .jpg"
        fileType="image"
        ref={coverImageRef}
        className="w-full m-auto rounded-sm"
        disabled={isLoading}
        onChange={(file) => handleInputChange("coverImage", file)}
      />
    </Modal>
  );
}
