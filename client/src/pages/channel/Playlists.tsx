import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiPlusCircle } from "react-icons/bi";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { RootState } from "@/store/store";
import { setPaginationInfo, setPlaylists } from "@/store/slices/playlistSlice";
import EmptyMessage from "@/component/error/EmptyMessage";
import PlaylistSkeleton from "@/component/playlist/PlaylistSkeleton";
import PlaylistCard from "@/component/playlist/PlaylistCard";
import CreatePlaylistDialog from "@/component/playlist/CreatePlaylistDialog";
import Button from "@/component/CoreUI/Button";
import { useParams } from "react-router-dom";

export default function Playlists() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const { user, channel } = useSelector((state: RootState) => state?.auth);
  const {
    playlists,
    paginationInfo: { currentPage, totalPages, totalDocs, hasNextPage },
  } = useSelector((state: RootState) => state?.playlist);
  const limit = 5;

  const [isShowCreatePlaylistDialog, setIsShowCreatePlaylistDialog] =
    useState(false);

  const {
    error,
    isLoading,
    handler: getUserPlaylists,
  } = useService(playlistService.getUserPlaylists);

  const fetchUserPlaylists = async (page: number) => {
    if (!channel?._id) return;
    if (page === 1) {
      dispatch(setPlaylists([]));
    }
    const { success, responseData } = await getUserPlaylists({
      userId: channel?._id,
      queryParams: { page, limit },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(setPlaylists(page === 1 ? docs : [...playlists, ...docs]));
      dispatch(
        setPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        })
      );
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
  }, [username]);

  return (
    <PageLayout>
      <ScrollPagination
        paginationType="view-more"
        loadNextPage={() => fetchUserPlaylists(currentPage + 1)}
        refreshHandler={() => fetchUserPlaylists(1)}
        dataLength={playlists.length}
        loading={isLoading}
        error={error?.message}
        currentPage={currentPage}
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
          {channel?._id === user?._id && !isLoading && (
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
                  dispatch(setPlaylists([createdPlaylist, ...playlists]))
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
    </PageLayout>
  );
}
