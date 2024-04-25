import { useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import Modal from "../CoreUI/Modal";
import FileUpload from "../FileUpload";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { changeCoverImage } from "@/store/slices/authSlice";

interface UpdateCoverImageDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function UpdateCoverImageDialog({
  open,
  handleClose,
}: UpdateCoverImageDialogProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const coverImageRef = useRef<HTMLInputElement | null>(null);

  interface initialFormState {
    coverImage: File | null;
  }

  const { formData, resetForm, handleInputChange } = useForm<initialFormState>({
    initialFormState: { coverImage: null },
  });

  const { isLoading, handleAction } = useActionHandler({
    action: changeCoverImage,
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Updating cover image..." },
  });

  const onSubmit = async () => {
    if (!formData.coverImage) {
      return toast.error("Cover Image is required!");
    }

    const { isSuccess, error } = await handleAction(formData);

    if (isSuccess && !error) {
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
