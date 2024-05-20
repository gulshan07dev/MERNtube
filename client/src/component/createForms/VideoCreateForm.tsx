import { useRef } from "react";
import { FaUpload } from "react-icons/fa";

import videoService from "@/services/videoService";
import useService from "@/hooks/useService";
import Form from "@/component/CoreUI/Form";
import Input from "@/component/CoreUI/Input";
import TextAreaInput from "@/component/CoreUI/TextAreaInput";
import CheckBox from "@/component/CoreUI/CheckBox";
import useForm from "@/hooks/useForm";
import FileUpload from "../FileUpload";

export default function VideoCreateForm() {
  const {
    error,
    isLoading,
    handler: createVideo,
  } = useService(videoService.createVideo, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Uploading video..." },
  });

  const initialVideoDetails = {
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
    isPublished: true,
  };
  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: initialVideoDetails,
  });

  const onSubmit = async () => {
    const { success } = await createVideo(formData);

    if (success) {
      resetForm();
      if (videoFileRef.current) {
        videoFileRef.current.value = "";
      }
      if (thumbnailRef.current) {
        thumbnailRef.current.value = "";
      }
    }
  };

  return (
    <Form
      title="Video"
      description="Share your video: title, description, file. Click, done! 🚀."
      submitButtonLabel="Upload video"
      submitButtonIcon={<FaUpload />}
      isSubmitButtonPositionLeft={false}
      isButtonDisabled={
        isLoading ||
        !formData.title ||
        !formData.videoFile ||
        !formData.thumbnail
      }
      isLoading={isLoading}
      error={error?.message}
      inputs={
        <>
          <div className="flex gap-7 max-lg:flex-col">
            <div className="lg:w-[48%]  w-full flex flex-col gap-7">
              {/* video file */}
              <FileUpload
                icon={<FaUpload />}
                label="choose your video"
                fileType="video"
                accept="video/mp4"
                onChange={(file) =>
                  handleInputChange("videoFile", file || null)
                }
                ref={videoFileRef}
                className="lg:h-[250px] md:h-[300px] h-[200px] border-dashed border-blue-500"
              />

              <Input
                label="Thumbnail"
                type="file"
                required={true}
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) =>
                  handleInputChange("thumbnail", e.target.files?.[0] || null)
                }
                ref={thumbnailRef}
              />
            </div>
            <div className="flex-grow flex flex-col gap-7">
              {/* video title */}
              <Input
                label="Title"
                type="text"
                value={formData?.title}
                maxTextSize={60}
                required={true}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              {/* video description */}
              <TextAreaInput
                label="Description"
                rows={4}
                isOptional={true}
                maxTextSize={500}
                value={formData?.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              {/* is published - checkbox */}
              <CheckBox
                label="Is Published"
                checked={Boolean(formData?.isPublished)}
                onChange={(e) =>
                  handleInputChange("isPublished", e.target.checked)
                }
              />
            </div>
          </div>
        </>
      }
      onSubmit={onSubmit}
    />
  );
}
