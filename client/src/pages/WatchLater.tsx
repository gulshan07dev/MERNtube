import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import Layout from "@/layout/Layout";
import ScrollPagination from "@/component/ScrollPagination";
import { AppDispatch, RootState } from "@/store/store";
import { getUserWatchLaterVideos } from "@/store/slices/watchLaterSlice";
import EmptyMessage from "@/component/error/EmptyMessage";
import WatchLaterVideoCard from "@/component/watchLater/WatchLaterVideoCard";

export default function WatchLater() {
  const dispatch: AppDispatch = useDispatch();
  const {
    watchLaterVideos,
    loading,
    error,
    currentPage,
    totalPages,
    totalVideos,
    hasNextPage,
  } = useSelector((state: RootState) => state.watch_later);

  const handleFetchWatchLaterVideos = async (page: number) => {
    await dispatch(
      getUserWatchLaterVideos({ queryParams: { page, limit: 10 } })
    );
  };

  useEffect(() => {
    handleFetchWatchLaterVideos(1);
  }, []);
  return (
    <Layout className="flex flex-col gap-7 max-lg:gap-5">
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={currentPage}
        dataLength={watchLaterVideos?.length}
        error={error}
        hasNextPage={hasNextPage}
        loadNextPage={() => handleFetchWatchLaterVideos(currentPage + 1)}
        refreshHandler={() => handleFetchWatchLaterVideos(1)}
        loading={loading}
        totalPages={totalPages}
        totalItems={totalVideos}
        className={twMerge("flex flex-grow flex-col gap-3")}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more watch history to show !!!
          </p>
        }
      >
        {!watchLaterVideos?.length &&
        totalVideos === 0 &&
        totalPages === 1 &&
        !loading ? (
          <EmptyMessage
            message="empty history!"
            buttonText="Try again"
            onRefresh={() => handleFetchWatchLaterVideos(1)}
          />
        ) : (
          <>
            <h1 className="text-4xl font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
              Watch Later
            </h1>
            {watchLaterVideos?.map(({ watchLaterVideo: video }) => (
              <WatchLaterVideoCard key={video?._id} video={video} />
            ))}
          </>
        )}
      </ScrollPagination>
    </Layout>
  );
}
