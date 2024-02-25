import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Dialog from "../CoreUI/Dialog";
import {
  addVideoToPlaylist,
  getUserPlaylists,
  Playlist,
  removeVideoFromPlaylist,
} from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import { RootState } from "@/store/store";
import ScrollPagination from "../ScrollPagination";
import CheckBox from "../CoreUI/CheckBox";

interface AddVideoToPlaylistDialogProps {
  videoId: string;
  triggerButton: React.ReactElement;
}

const AddVideoToPlaylistDialog: React.FC<AddVideoToPlaylistDialogProps> = ({
  videoId,
  triggerButton,
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 7;
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const {
    isLoading: isFetchingPlaylists,
    error,
    handleAction: fetchPlaylists,
  } = useActionHandler({
    action: getUserPlaylists,
    isShowToastMessage: false,
  });

  const handleFetchPlaylists = async (page: number) => {
    if (!user?._id) return;

    if (page === 1) {
      setPlaylists([]);
    }

    const { isSuccess, resData } = await fetchPlaylists({
      userId: user?._id,
      queryParams: { page, limit, videoId },
    });

    if (isSuccess && resData?.result) {
      const newPlaylists = resData.result.docs;
      setPlaylists((prevPlaylists) =>
        page === 1 ? newPlaylists : [...prevPlaylists, ...newPlaylists]
      );
      setCurrentPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalItems(resData.result.totalItems);
      setHasNextPage(resData.result.hasNextPage);
    }
  };

  const { isLoading: isAddingToPlaylist, handleAction: addToPlaylist } =
    useActionHandler({
      action: addVideoToPlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Adding video to playlist..." },
    });

  const { isLoading: isRemovingToPlaylist, handleAction: removeFromPlaylist } =
    useActionHandler({
      action: removeVideoFromPlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Removing video from playlist..." },
    });

  const handleTogglePlaylist = async (
    playlistId: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      await addToPlaylist({ playlistId, videoId });
    } else {
      await removeFromPlaylist({ playlistId, videoId });
    }
  };

  return (
    <Dialog
      title="Add to Playlist"
      description={
        isLoggedIn
          ? "Select a playlist to add or remove the video"
          : "Please log in or sign up to add the video to your playlist"
      }
      submitLabel={!isLoggedIn ? "Log In or Sign Up" : undefined}
      onSubmit={!isLoggedIn ? () => navigate("/auth/login") : undefined}
      triggerButton={triggerButton}
      onOpen={() => handleFetchPlaylists(1)}
    >
      {isLoggedIn && (
        <ScrollPagination
          paginationType="view-more"
          loadNextPage={() => handleFetchPlaylists(currentPage + 1)}
          refreshHandler={() => handleFetchPlaylists(1)}
          dataLength={playlists.length}
          loading={isFetchingPlaylists}
          error={error}
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          className={error ? "pt-10" : ""}
        >
          <div className="flex flex-col gap-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                isAddingToPlaylist={isAddingToPlaylist}
                isRemovingToPlaylist={isRemovingToPlaylist}
                handleTogglePlaylist={handleTogglePlaylist}
              />
            ))}
          </div>
        </ScrollPagination>
      )}
    </Dialog>
  );
};

interface PlaylistCardProps {
  playlist: Playlist;
  isAddingToPlaylist: boolean;
  isRemovingToPlaylist: boolean;
  handleTogglePlaylist: (playlistId: string, isChecked: boolean) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isAddingToPlaylist,
  isRemovingToPlaylist,
  handleTogglePlaylist,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(Boolean(playlist.isVideoAddedToPlaylist));
  }, [playlist.isVideoAddedToPlaylist]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsChecked(checked);
    handleTogglePlaylist(playlist._id, checked);
  };

  return (
    <CheckBox
      label={playlist.name}
      checked={isChecked}
      onChange={handleChange}
      disabled={isAddingToPlaylist || isRemovingToPlaylist}
    />
  );
};

export default AddVideoToPlaylistDialog;
