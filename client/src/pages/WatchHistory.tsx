import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import watchHistoryService from "@/services/watchHistoryService";
import useService from "@/hooks/useService";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearWatchHistories,
  setWatchHistoriesPaginationInfo,
  setWatchHistories,
} from "@/store/slices/watchHistorySlice";
import { IVideo, IWatchHistoryVideo } from "@/interfaces";
import EmptyMessage from "@/component/error/EmptyMessage";
import WatchHistoryVideoCard from "@/component/watchHistory/WatchHistoryVideoCard";
import WatchHistoryVideoSkeleton from "@/component/watchHistory/WatchHistoryVideoSkeleton";
import ClearWatchHistory from "@/component/settings/watchHistory/ClearWatchHistory";
import ToggleWatchHistoryPauseStatus from "@/component/settings/watchHistory/ToggleWatchHistoryPauseStatus";

export default function WatchHistory() {
  const dispatch: AppDispatch = useDispatch();
  const limit = 10;
  const {
    watchHistories,
    watchHistoriesPaginationInfo: {
      currentPage,
      totalPages,
      totalDocs,
      hasNextPage,
    },
  } = useSelector((state: RootState) => state.watch_history);

  const {
    error,
    isLoading,
    handler: getWatchHistory,
  } = useService(watchHistoryService.getWatchHistory);

  const handleFetchWatchHistory = useCallback(
    async (page: number) => {
      if (page === 1) {
        dispatch(clearWatchHistories());
      }

      const { success, responseData } = await getWatchHistory({
        queryParams: { page, limit },
      });

      if (success) {
        const { page, totalPages, totalDocs, hasNextPage, docs } =
          responseData?.data?.result;

        const updatedWatchHistories: {
          [key: string]: {
            date: string;
            videos: { video: IVideo; historyId: string }[];
          };
        } = {};
        docs.forEach(
          ({
            watchHistoryVideo,
            _id: historyId,
            createdAt,
          }: IWatchHistoryVideo) => {
            const date = getFormattedDate(createdAt?.toString());
            if (!updatedWatchHistories[date]) {
              updatedWatchHistories[date] = { date, videos: [] };
            }
            updatedWatchHistories[date].videos = [
              ...updatedWatchHistories[date].videos,
              { video: watchHistoryVideo, historyId },
            ];
          }
        );

        dispatch(setWatchHistories(updatedWatchHistories));

        dispatch(
          setWatchHistoriesPaginationInfo({
            currentPage: page,
            totalPages,
            totalDocs,
            hasNextPage,
          })
        );
      }
    },
    [watchHistories]
  );

  const getFormattedDate = useCallback((createdAt: string): string => {
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diff = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 3600 * 24)
      );
      if (diff < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
      } else {
        return date.toLocaleDateString("en-GB");
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(watchHistories).length) return;
    handleFetchWatchHistory(1);
  }, []);

  return (
    <PageLayout className="flex lg:gap-7 max-lg:flex-col-reverse max-lg:gap-5">
      {/* history videos categorized with day/dates */}
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={currentPage!}
        dataLength={Object.values(watchHistories).reduce(
          (total, { videos }) => total + videos.length,
          2
        )}
        error={error?.message}
        hasNextPage={hasNextPage!}
        loadNextPage={() => handleFetchWatchHistory(currentPage! + 1)}
        refreshHandler={() => handleFetchWatchHistory(1)}
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
        {!Object.keys(watchHistories).length &&
        totalDocs === 0 &&
        totalPages === 1 &&
        !isLoading ? (
          <EmptyMessage
            message="empty history!"
            buttonText="Try again"
            onRefresh={() => handleFetchWatchHistory(1)}
          />
        ) : (
          <>
            <h1 className="text-4xl font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
              Watch History
            </h1>
            {Object.values(watchHistories).map(({ date, videos }, idx) => (
              <div key={idx}>
                <h1 className="text-black dark:text-white text-lg">{date}</h1>
                {videos.map(({ video, historyId }) => (
                  <WatchHistoryVideoCard
                    key={historyId}
                    video={video}
                    historyId={historyId}
                  />
                ))}
              </div>
            ))}
          </>
        )}
        {isLoading &&
          Array.from({ length: 10 }).map((_, idx) => (
            <WatchHistoryVideoSkeleton key={idx} />
          ))}
      </ScrollPagination>

      {/* watch history settings */}
      {!error && (
        <div className="lg:w-[470px] w-full h-fit bg-slate-50 dark:bg-[#252525] rounded-md lg:sticky lg:top-[180px] lg:py-24 lg:px-5 px-3 py-3">
          <div className="flex flex-col justify-start items-start gap-3">
            <ClearWatchHistory />
            <ToggleWatchHistoryPauseStatus />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
