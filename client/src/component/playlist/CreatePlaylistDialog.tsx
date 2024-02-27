import { ReactElement } from "react";
import toast from "react-hot-toast";

import Dialog from "../CoreUI/Dialog";
import Input from "../CoreUI/Input";
import TextAreaInput from "../CoreUI/TextAreaInput";
import CheckBox from "../CoreUI/CheckBox";
import useForm from "@/hooks/useForm";
import useActionHandler from "@/hooks/useActionHandler";
import { createPlaylist } from "@/store/slices/playlistSlice";

interface CreatePlaylistDialogProps {
  triggerButton: ReactElement;
}

export default function CreatePlaylistDialog({
  triggerButton,
}: CreatePlaylistDialogProps) {
  const playlistDetails = {
    name: "",
    description: "",
    isPrivate: false,
  };

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: playlistDetails,
  });

  const { isLoading, error, handleAction } = useActionHandler({
    action: createPlaylist,
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Creating playlist..." },
  });

  const handleSubmitForm = async () => {
    if (!formData.name) {
      return toast.error("Name is required!");
    }
    const { isSuccess } = await handleAction(formData);
    if (isSuccess && !error) {
      resetForm();
    }
  };
  return (
    <Dialog
      title="Create Playlist"
      description="create your playlist by providing name and description"
      triggerButton={triggerButton}
      submitLabel={isLoading ? "loading..." : "Create Playlist"}
      onSubmit={handleSubmitForm}
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
          label="Name"
          type="text"
          value={formData?.name}
          maxTextSize={30}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <TextAreaInput
          label="Description"
          rows={5}
          value={formData?.description}
          maxTextSize={150}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <CheckBox
          label="isPrivate"
          checked={formData?.isPrivate}
          onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
        />
      </form>
    </Dialog>
  );
}
