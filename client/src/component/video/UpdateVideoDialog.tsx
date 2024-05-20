import { useEffect, useRef } from "react";

import Modal from "../CoreUI/Modal";
import videoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { Video } from "@/store/slices/videoSlice";
import useForm from "@/hooks/useForm";
import Input from "../CoreUI/Input";
import FileUpload from "../FileUpload";

interface UpdateVideoDialogProps {
  open: boolean;
  handleClose: () => void;
  video: Video;
  onUpdate: (video: Video) => void;
}

export default function UpdateVideoDialog({
  open,
  handleClose,
  video,
  onUpdate,
}: UpdateVideoDialogProps) {
  const thumbnailRef = useRef(null);
  const { formData, resetForm, handleInputChange } = useForm<{
    title: string;
    description: string;
    thumbnail: File | null;
  }>({
    initialFormState: {
      title: video?.title,
      description: video?.description,
      thumbnail: null,
    },
  });

  const { isLoading, handler: updateVideo } = useService(
    videoService.updateVideo,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Updating video..." },
    }
  );

  const handleSubmitForm = async () => {
    const { success, error, responseData } = await updateVideo({
      videoId: video?._id,
      data: formData,
    });
    if (success && !error) {
      resetForm();
      handleClose();
      onUpdate(responseData?.data?.updatedVideo as Video);
    }
  };

  useEffect(() => {
    resetForm();
  }, [open]);
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Update Video"
      description="update your video by providing new title, description, or thumbnail"
      submitLabel={isLoading ? "loading..." : "Update Video"}
      onSubmit={handleSubmitForm}
      isSubmitButtonDisabled={
        formData?.title === video?.title &&
        formData?.description === video?.description
      }
      isLoading={isLoading}
      className="flex flex-col gap-4"
    >
      <form
        className="flex flex-col pt-3 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm();
        }}
      >
        <Input
          type="text"
          label="Title"
          value={formData?.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <Input
          type="text"
          label="Description"
          value={formData?.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <FileUpload
          defaultImageSrc={video?.thumbnail}
          label="choose your thumbnail"
          fileType="image"
          accept="image/jpeg, image/png, image/jpg"
          onChange={(file) => handleInputChange("thumbnail", file || null)}
          ref={thumbnailRef}
          className="h-[200px] border-dashed border-blue-500"
        />
      </form>
    </Modal>
  );
}
