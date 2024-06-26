import toast from "react-hot-toast";

import Modal from "../Modal";
import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { IPlaylist } from "@/interfaces";
import useForm from "@/hooks/useForm";
import Input from "../CoreUI/Input";
import TextAreaInput from "../CoreUI/TextAreaInput";
import CheckBox from "../CoreUI/CheckBox";

interface CreatePlaylistDialogProps {
  open: boolean;
  handleClose: () => void;
  onCreate: (createdPlaylist: IPlaylist) => void;
}

export default function CreatePlaylistDialog({
  open,
  handleClose,
  onCreate,
}: CreatePlaylistDialogProps) {
  const playlistDetails = {
    name: "",
    description: "",
    isPrivate: false,
  };

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: playlistDetails,
  });

  const {
    isLoading,
    error,
    handler: createPlaylist,
  } = useService(playlistService.createPlaylist, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Creating playlist..." },
  });

  const handleSubmitForm = async () => {
    if (!formData.name) {
      return toast.error("Name is required!");
    }
    const { success, responseData } = await createPlaylist(formData);
    if (success && !error) {
      resetForm();
      handleClose();
      onCreate(responseData?.data?.playlist);
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Create Playlist"
      description="create your playlist by providing name and description"
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
          maxTextSize={250}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <CheckBox
          label="isPrivate"
          checked={formData?.isPrivate}
          onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
        />
      </form>
    </Modal>
  );
}
