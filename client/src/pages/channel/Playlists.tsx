import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiPlusCircle } from "react-icons/bi";

import { RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import { Playlist, getUserPlaylists } from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import EmptyMessage from "@/component/error/EmptyMessage";
import PlaylistSkeleton from "@/component/playlist/PlaylistSkeleton";
import PlaylistCard from "@/component/playlist/PlaylistCard";
import CreatePlaylistDialog from "@/component/playlist/CreatePlaylistDialog";
import Button from "@/component/CoreUI/Button";

export default function Playlists() {
  const { user, channel } = useSelector((state: RootState) => state?.auth);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [isShowCreatePlaylistDialog, setIsShowCreatePlaylistDialog] =
    useState(false);

  const { error, isLoading, handleAction } = useActionHandler({
    action: getUserPlaylists,
    isShowToastMessage: false,
  });

  const fetchUserPlaylists = async (page: number) => {
    if (!channel?._id) return;

    const { isSuccess, resData } = await handleAction({
      userId: channel?._id,
      queryParams: { page, limit },
    });

    if (isSuccess && resData?.result) {
      const newPlaylists = resData.result.docs;
      setPlaylists(page === 1 ? newPlaylists : [...playlists, ...newPlaylists]);
      setCurrPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalDocs(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
    }
  };

  const renderSkeletons = () => {
    const numSkeletons =
      limit && playlists.length !== 0
        ? Math.min(limit, totalDocs - playlists.length)
        : limit;
    return Array.from({ length: numSkeletons }, (_, idx) => (
      <PlaylistSkeleton key={idx} />
    ));
  };

  // fetch initial playlists
  useEffect(() => {
    fetchUserPlaylists(1);
  }, [channel?._id]);

  return (
    <ScrollPagination
      paginationType="view-more"
      loadNextPage={() => fetchUserPlaylists(currPage + 1)}
      refreshHandler={() => fetchUserPlaylists(1)}
      dataLength={playlists.length}
      loading={isLoading}
      error={error}
      currentPage={currPage}
      totalItems={totalDocs}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      endMessage={
        <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
          No more playlists to show !!!
        </p>
      }
    >
      <div className="flex justify-between max-md:pb-3 px-3">
        <h2 className="max-md:self-center md:text-lg text-base font-semibold text-zinc-800 dark:text-slate-200 font-Noto_sans">
          Created Playlist
        </h2>
        {channel?._id === user?._id && (
          <>
            <Button
              icon={<BiPlusCircle />}
              isLarge={false}
              isGradientBg={true}
              className="md:text-base text-sm py-2"
              onClick={() => setIsShowCreatePlaylistDialog((prev) => !prev)}
            >
              Create Playlist
            </Button>
            <CreatePlaylistDialog
              open={isShowCreatePlaylistDialog}
              handleClose={() => setIsShowCreatePlaylistDialog(false)}
              onCreate={(createdPlaylist) =>
                setPlaylists((prev) => [createdPlaylist, ...prev])
              }
            />
          </>
        )}
      </div>
      <div className="w-full flex flex-wrap md:gap-10 gap-x-4 gap-y-5 max-lg:px-1 py-5 max-md:pb-12">
        {!playlists.length &&
        totalDocs === 0 &&
        totalPages === 1 &&
        !isLoading ? (
          <EmptyMessage
            message="empty playlists"
            buttonText="fetch again"
            onRefresh={() => fetchUserPlaylists(1)}
          />
        ) : (
          playlists?.map((playlist) => (
            <PlaylistCard key={playlist?._id} playlist={playlist} />
          ))
        )}
        {(isLoading || !channel?._id) && renderSkeletons()}
      </div>
    </ScrollPagination>
  );
}
