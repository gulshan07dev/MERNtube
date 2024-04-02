import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import { AppDispatch, RootState } from "@/store/store";
import Layout from "@/layout/Layout";
import ScrollPagination from "@/component/ScrollPagination";
import { getWatchHistory } from "@/store/slices/watchHistorySlice";
import ErrorDialog from "@/component/error/ErrorDialog";
import WatchHistoryVideoCard from "@/component/watchHistory/WatchHistoryVideoCard";
import WatchHistoryVideoSkeleton from "@/component/watchHistory/WatchHistoryVideoSkeleton";
import ClearWatchHistory from "@/component/settings/watchHistory/ClearWatchHistory";
import ToggleWatchHistoryPauseStatus from "@/component/settings/watchHistory/ToggleWatchHistoryPauseStatus";
import { Video } from "@/store/slices/videoSlice";

interface GroupedWatchHistories {
  [key: string]: {
    date: string;
    videos: { video: Video; historyId: string }[];
  };
}

export default function WatchHistory() {
  const dispatch: AppDispatch = useDispatch();
  const {
    watchHistories,
    loading,
    error,
    currentPage,
    totalPages,
    totalVideos,
    hasNextPage,
  } = useSelector((state: RootState) => state.watch_history);

  const [groupedWatchHistories, setGroupedWatchHistories] =
    useState<GroupedWatchHistories>({});

  const handleFetchWatchHistory = useCallback(
    (page: number) => {
      dispatch(getWatchHistory({ queryParams: { page, limit: 10 } }));
    },
    [dispatch]
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
        return date.toLocaleDateString();
      }
    }
  }, []);

  useEffect(() => {
    handleFetchWatchHistory(1);
  }, []);

  useEffect(() => {
    const grouped: GroupedWatchHistories = {};

    watchHistories.forEach(
      ({ watchHistoryVideo: video, _id: historyId, createdAt }) => {
        const date = getFormattedDate(createdAt.toString());
        if (!grouped[date]) {
          grouped[date] = { date, videos: [] };
        }
        grouped[date].videos.push({ video, historyId });
      }
    );

    setGroupedWatchHistories(grouped);
  }, [watchHistories]);

  return (
    <Layout className="flex flex-col gap-7 max-lg:gap-5 md:px-7 md:py-5 p-3.5">
      <h1 className="text-4xl font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
        Watch History
      </h1>

      <div className="flex lg:gap-7 max-lg:flex-col-reverse max-lg:gap-5">
        {/* history videos categorized with day/dates */}
        <ScrollPagination
          paginationType="infinite-scroll"
          currentPage={currentPage}
          dataLength={watchHistories?.length}
          error={error}
          hasNextPage={hasNextPage}
          loadNextPage={() => handleFetchWatchHistory(currentPage + 1)}
          refreshHandler={() => handleFetchWatchHistory(1)}
          loading={loading}
          totalPages={totalPages}
          totalItems={totalVideos}
          className={twMerge(
            "flex flex-grow flex-col gap-3",
            error && "min-h-full"
          )}
          endMessage={
            <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
              No more watch history to show !!!
            </p>
          }
        >
          {!watchHistories?.length &&
          totalVideos === 0 &&
          totalPages === 1 &&
          !loading ? (
            <ErrorDialog
              errorMessage="empty history!"
              buttonLabel="Try again"
              buttonOnClick={() => handleFetchWatchHistory(1)}
            />
          ) : (
            Object.values(groupedWatchHistories).map(
              ({ date, videos }, idx) => (
                <div key={idx}>
                  <h1 className="text-black dark:text-white text-lg">{date}</h1>
                  {videos.map(({ video, historyId }, videoIdx) => (
                    <WatchHistoryVideoCard
                      key={videoIdx}
                      video={video}
                      historyId={historyId}
                    />
                  ))}
                </div>
              )
            )
          )}
          {loading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <WatchHistoryVideoSkeleton key={idx} />
            ))}
        </ScrollPagination>

        {/* watch history settings */}
        {!error && (
          <div className="lg:w-[470px] w-full h-fit bg-slate-50 dark:bg-[#252525] rounded-md lg:sticky lg:top-[88px] lg:py-24 lg:px-5 px-3 py-3">
            <div className="flex flex-col justify-start items-start gap-3">
              <ClearWatchHistory />
              <ToggleWatchHistoryPauseStatus />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
