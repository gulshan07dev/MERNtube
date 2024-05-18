import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { twMerge } from "tailwind-merge";

import { AppDispatch, RootState } from "@/store/store";
import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import VideoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { setPaginationInfo, setVideos } from "@/store/slices/videoSlice";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";
import Button from "@/component/CoreUI/Button";
import EmptyMessage from "@/component/error/EmptyMessage";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { videos, paginationInfo } = useSelector(
    (state: RootState) => state.video
  );
  const [sortType, setSortType] = useState<"desc" | "acc">("desc");
  const limit = 9;

  const {
    isLoading,
    error,
    handler: getAllVideos,
  } = useService(VideoService.getAllVideos);

  const fetchVideos = async (page: number, type?: "desc" | "acc") => {
    if (page === 1) {
      dispatch(setVideos([]));
    }

    const { success, responseData } = await getAllVideos({
      page,
      limit,
      sortBy: "createdAt",
      sortType: type || sortType,
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(setVideos(page === 1 ? docs : [...videos, ...docs]));
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

  const handleSortTypeChange = (type: "desc" | "acc") => {
    if (sortType !== type) {
      setSortType(() => type);
      fetchVideos(1, type);
    }
  };

  // fetch initial videos
  useEffect(() => {
    if (paginationInfo.currentPage > 0) return;
    fetchVideos(1);
  }, []);

  const renderEmptyMessage = () => (
    <EmptyMessage
      message="empty videos"
      buttonText="fetch again"
      onRefresh={() => fetchVideos(1)}
    />
  );

  return (
    <PageLayout>
      <ScrollPagination
        paginationType="infinite-scroll"
        loadNextPage={() => fetchVideos(paginationInfo.currentPage + 1)}
        refreshHandler={() => fetchVideos(1)}
        dataLength={videos.length}
        loading={isLoading}
        error={error?.message}
        currentPage={paginationInfo.currentPage}
        hasNextPage={paginationInfo.hasNextPage}
        totalPages={paginationInfo.totalPages}
        totalItems={paginationInfo.totalDocs}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more videos to fetch !!!
          </p>
        }
      >
        <div className="w-full flex gap-3 md:pb-2 pb-1">
          {["desc", "acc"].map((type) => (
            <Button
              key={type}
              isLarge={false}
              onClick={() => handleSortTypeChange(type as "acc" | "desc")}
              className={twMerge(
                "rounded-lg bg-gray-200 dark:bg-[#333333] text-sm text-[#0f0f0f] dark:text-white font-roboto border-none",
                "hover:opacity-100",
                sortType === type
                  ? ["bg-black text-white dark:bg-white dark:text-black"]
                  : ["hover:bg-gray-300 dark:hover:bg-[#404040]"]
              )}
            >
              {type === "desc" ? "Newest" : "Oldest"}
            </Button>
          ))}
        </div>
        <div className="flex flex-grow flex-wrap items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
          {videos.length || isLoading
            ? videos.map((item) => <VideoCard key={item?._id} data={item} />)
            : paginationInfo.totalDocs === 0 && paginationInfo.totalPages === 1
            ? renderEmptyMessage()
            : null}
          {isLoading &&
            Array.from({ length: limit }, (_, idx) => (
              <VideoSkeleton key={idx} />
            ))}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
};

export default Home;
