import { useEffect } from "react";
import toast from "react-hot-toast";

import Modal from "../CoreUI/Modal";
import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { IPlaylist } from "@/interfaces";
import useForm from "@/hooks/useForm";
import Input from "../CoreUI/Input";
import TextAreaInput from "../CoreUI/TextAreaInput";
import CheckBox from "../CoreUI/CheckBox";

interface UpdatePlaylistDialogProps {
  open: boolean;
  handleClose: () => void;
  playlistId: string;
  playlistDetails: { name: string; description: string; isPrivate: boolean };
  onUpdate: (updatedPlaylist: IPlaylist) => void;
}

export default function UpdatePlaylistDialog({
  open,
  handleClose,
  playlistId,
  playlistDetails,
  onUpdate,
}: UpdatePlaylistDialogProps) {
  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: playlistDetails,
  });

  const {
    isLoading,
    error,
    handler: updatedPlaylist,
  } = useService(playlistService.updatePlaylist, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Updating playlist..." },
  });

  const handleSubmitForm = async () => {
    if (!formData.name) {
      return toast.error("Name is required!");
    }
    const { success, responseData } = await updatedPlaylist({
      playlistId,
      data: formData,
    });

    if (success && !error) {
      handleClose();
      onUpdate(responseData?.data?.playlist);
    }
  };

  useEffect(() => {
    resetForm();
  }, [playlistDetails]);

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Update Playlist"
      description="update your playlist by providing name and description"
      submitLabel={isLoading ? "loading..." : "Update Playlist"}
      onSubmit={handleSubmitForm}
      isSubmitButtonDisabled={
        playlistDetails?.name === formData?.name &&
        playlistDetails?.description === formData?.description &&
        playlistDetails.isPrivate === formData?.isPrivate
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
