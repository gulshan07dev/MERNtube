import Button from "../CoreUI/Button";
import Modal from "../CoreUI/Modal";

const DeletePlaylistDialogButton = ({
  open,
  handleClose,
  isDeleting,
  onDelete,
}: {
  open: boolean;
  handleClose: () => void
  isDeleting: boolean;
  onDelete: () => void;
}) => {
  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        title="Delete Playlist"
        description="Are you sure you want to delete the playlist?"
        submitLabel={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
        onSubmit={onDelete}
        closeButton={
          <Button
            className="w-full py-1.5 px-7 bg-red-600 border-none"
            disabled={isDeleting}
          >
            Cancel
          </Button>
        }
      />
    </>
  );
};

export default DeletePlaylistDialogButton;
