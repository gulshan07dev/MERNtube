import { MdDelete } from "react-icons/md";
import Button from "../CoreUI/Button";
import Modal from "../CoreUI/Modal";

const DeletePlaylistDialogButton = ({
  isDeleting,
  onDelete,
}: {
  isDeleting: boolean;
  onDelete: () => void;
}) => (
  <Modal
    title="Delete Playlist"
    description="Are you sure you want to delete the playlist?"
    submitLabel={isDeleting ? "Deleting..." : "Delete"}
    isLoading={isDeleting}
    onSubmit={onDelete}
    triggerButton={
      <Button
        icon={<MdDelete />}
        className="w-full py-1.5 px-7 bg-red-600 border-none"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    }
    closeButton={
      <Button
        className="w-full py-1.5 px-7 bg-red-600 border-none"
        disabled={isDeleting}
      >
        Cancel
      </Button>
    }
  />
);

export default DeletePlaylistDialogButton;
