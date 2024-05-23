import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import watchLaterService from "@/services/watchLaterService";
import useService from "@/hooks/useService";
import { AppDispatch, RootState } from "@/store/store";
import {
  setWatchLaterVideosPaginationInfo,
  setWatchLaterVideos,
} from "@/store/slices/watchLaterSlice";
import EmptyMessage from "@/component/error/EmptyMessage";
import WatchLaterVideoCard from "@/component/watchLater/WatchLaterVideoCard";

export default function WatchLater() {
  const dispatch: AppDispatch = useDispatch();
  const {
    watchLaterVideos,
    watchLaterVideosPaginationInfo: {
      currentPage,
      totalPages,
      totalDocs,
      hasNextPage,
    },
  } = useSelector((state: RootState) => state.watch_later);

  const {
    isLoading,
    error,
    handler: getUserWatchLaterVideos,
  } = useService(watchLaterService.getUserWatchLaterVideos);

  const handleFetchWatchLaterVideos = async (page: number) => {
    if (page === 1) {
      dispatch(setWatchLaterVideos([]));
    }

    const { success, responseData } = await getUserWatchLaterVideos({
      queryParams: { page, limit: 10 },
    });
    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(
        setWatchLaterVideos(page === 1 ? docs : [...watchLaterVideos, ...docs])
      );
      dispatch(
        setWatchLaterVideosPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        })
      );
    }
  };

  useEffect(() => {
    handleFetchWatchLaterVideos(1);
  }, []);
  return (
    <PageLayout className="flex flex-col gap-7 max-lg:gap-5">
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={currentPage!}
        dataLength={watchLaterVideos?.length}
        error={error?.message}
        hasNextPage={hasNextPage!}
        loadNextPage={() => handleFetchWatchLaterVideos(currentPage! + 1)}
        refreshHandler={() => handleFetchWatchLaterVideos(1)}
        loading={isLoading}
        totalPages={totalPages!}
        totalItems={totalDocs!}
        className={twMerge("flex flex-grow flex-col gap-3")}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more watch history to show !!!
          </p>
        }
      >
        {!watchLaterVideos?.length &&
        totalDocs === 0 &&
        totalPages === 1 &&
        !isLoading ? (
          <EmptyMessage
            message="empty watch later!"
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
    </PageLayout>
  );
}
