import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ScrollPagination from "../ScrollPagination";
import Modal from "../Modal";
import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { IPlaylist } from "@/interfaces";
import { RootState } from "@/store/store";
import CheckBox from "../CoreUI/CheckBox";

interface AddVideoToPlaylistDialogProps {
  videoId: string;
  open: boolean;
  handleClose: () => void;
}

const AddVideoToPlaylistDialog: React.FC<AddVideoToPlaylistDialogProps> = ({
  videoId,
  open,
  handleClose,
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const limit = 7;
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    totalDocs: 1,
    hasNextPage: false,
  });

  const {
    isLoading: isFetchingPlaylists,
    error: playlistsFetchingError,
    handler: getUserPlaylists,
  } = useService(playlistService.getUserPlaylists);

  const { isLoading: isVideoAddingToPlaylist, handler: addVideoToPlaylist } =
    useService(playlistService.addVideoToPlaylist, {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Adding video to playlist..." },
    });

  const {
    isLoading: isRemovingVideoFromPlaylist,
    handler: removeVideoFromPlaylist,
  } = useService(playlistService.removeVideoFromPlaylist, {
    isShowToastMessage: true,
    toastMessages: { loadingMessage: "Removing video from playlist..." },
  });

  const handleFetchPlaylists = async (page: number) => {
    if (!user?._id) return;
    if (page === 1) {
      setPlaylists([]);
    }

    const { success, responseData } = await getUserPlaylists({
      userId: user?._id,
      queryParams: { page, limit, videoId },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;
      setPlaylists((prevPlaylists) =>
        page === 1 ? docs : [...prevPlaylists, ...docs]
      );
      setPaginationInfo({
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      });
    }
  };

  const handleTogglePlaylist = async (
    playlistId: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      return await addVideoToPlaylist({ playlistId, videoId });
    } else {
      return await removeVideoFromPlaylist({ playlistId, videoId });
    }
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Add to Playlist"
      description={
        isLoggedIn
          ? "Select a playlist to add or remove the video"
          : "Please log in or sign up to add the video to your playlist"
      }
      submitLabel={!isLoggedIn ? "Log In or Sign Up" : undefined}
      onSubmit={!isLoggedIn ? () => navigate("/auth/login") : undefined}
      isLoading={isVideoAddingToPlaylist || isRemovingVideoFromPlaylist}
      onOpen={() => handleFetchPlaylists(1)}
    >
      {isLoggedIn && (
        <ScrollPagination
          paginationType="view-more"
          loadNextPage={() =>
            handleFetchPlaylists(paginationInfo.currentPage + 1)
          }
          refreshHandler={() => handleFetchPlaylists(1)}
          dataLength={playlists.length}
          loading={isFetchingPlaylists}
          error={playlistsFetchingError?.message}
          currentPage={paginationInfo.currentPage}
          totalItems={paginationInfo.totalDocs}
          totalPages={paginationInfo.totalPages}
          hasNextPage={paginationInfo.hasNextPage}
          className={playlistsFetchingError ? "pt-10" : ""}
        >
          <div className="flex flex-col gap-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                isAddingToPlaylist={isVideoAddingToPlaylist}
                isRemovingToPlaylist={isRemovingVideoFromPlaylist}
                handleTogglePlaylist={handleTogglePlaylist}
              />
            ))}
          </div>
        </ScrollPagination>
      )}
    </Modal>
  );
};

interface PlaylistCardProps {
  playlist: IPlaylist;
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
