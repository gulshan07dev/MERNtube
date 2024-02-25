import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import { Playlist, getUserPlaylists } from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import EmptyMessage from "@/component/EmptyMessage";
import PlaylistSkeleton from "@/component/playlist/PlaylistSkeleton";
import PlaylistCard from "@/component/playlist/PlaylistCard";
import { twMerge } from "tailwind-merge";

export default function Playlists() {
  const { channel } = useSelector((state: RootState) => state?.auth);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

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
        <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
          No more playlists to show !!!
        </p>
      }
      className={twMerge("min-h-screen", error && "min-h-full pt-10")}
    >
      <div className="w-full flex flex-wrap md:gap-10 max-md:justify-center gap-6 max-lg:px-1 py-5">
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
