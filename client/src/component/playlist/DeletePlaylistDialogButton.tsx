import { MdDelete } from "react-icons/md";
import Button from "../CoreUI/Button";
import Dialog from "../CoreUI/Dialog";

const DeletePlaylistDialogButton = ({
  isDeleting,
  onDelete,
}: {
  isDeleting: boolean;
  onDelete: () => void;
}) => (
  <Dialog
    title="Delete Playlist"
    description="Are you sure you want to delete the playlist?"
    submitLabel={isDeleting ? "Deleting..." : "Delete"}
    isLoading={isDeleting}
    onSubmit={onDelete}
    triggerButton={
      <Button
      icon={<MdDelete />}
        label={isDeleting ? "Deleting..." : "Delete"}
        className="w-full py-1.5 px-7 bg-red-600 border-none"
        disabled={isDeleting}
      />
    }
  />
);

export default DeletePlaylistDialogButton;
