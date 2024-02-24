import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const { user } = useSelector((state: RootState) => state.auth);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const limit = 7;
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
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

    const { isSuccess, resData } = await fetchPlaylists({
      userId: user?._id,
      queryParams: { page, limit, videoId },
    });

    if (isSuccess && resData?.result) {
      const newPlaylists = resData.result.docs;
      setPlaylists((prevPlaylists) =>
        page === 1 ? newPlaylists : [...prevPlaylists, ...newPlaylists]
      );
      setCurrPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalDocs(resData.result.totalDocs);
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
      description="Select a playlist to add the video"
      triggerButton={triggerButton}
      onOpen={() => handleFetchPlaylists(1)}
    >
      <ScrollPagination
        paginationType="view-more"
        loadNextPage={() => handleFetchPlaylists(currPage + 1)}
        refreshHandler={() => handleFetchPlaylists(1)}
        dataLength={playlists.length}
        loading={isFetchingPlaylists}
        error={error}
        currentPage={currPage}
        totalItems={totalDocs}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
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
