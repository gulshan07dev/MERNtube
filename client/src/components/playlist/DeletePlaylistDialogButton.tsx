import Modal from "../Modal";

const DeletePlaylistDialogButton = ({
  open,
  handleClose,
  isDeleting,
  onDelete,
}: {
  open: boolean;
  handleClose: () => void;
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
      />
    </>
  );
};

export default DeletePlaylistDialogButton;
