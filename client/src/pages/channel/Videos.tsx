import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import { IVideo } from "@/interfaces";
import videoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { RootState } from "@/store/store";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";
import Button from "@/component/CoreUI/Button";
import EmptyMessage from "@/component/error/EmptyMessage";

const Home: React.FC = () => {
  const { channel } = useSelector((state: RootState) => state?.auth);
  const [sortBy, setSortBy] = useState<"createdAt" | "views">("createdAt");
  const [sortType, setSortType] = useState<"desc" | "acc">("desc");
  const limit = 6;
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    totalDocs: 1,
    hasNextPage: false,
  });

  const {
    isLoading,
    error,
    handler: getAllVideos,
  } = useService(videoService.getAllVideos);

  const fetchVideos = async (page: number) => {
    if (page === 1) {
      setVideos([]);
    }
    const { success, responseData } = await getAllVideos({
      page,
      limit,
      sortBy,
      sortType,
      userId: channel?._id,
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      setVideos(page === 1 ? docs : [...videos, ...docs]);
      setPaginationInfo({
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      });
    }
  };

  const handleSortTypeChange = (type: "desc" | "acc") => {
    setSortType(type);
    setSortBy("createdAt");
  };
  const handleSortBy = (by: "createdAt" | "views") => {
    setSortType("desc");
    setSortBy(by);
  };

  // fetch initial videos
  useEffect(() => {
    if (channel?._id) {
      fetchVideos(1);
    }
  }, [sortType, sortBy, channel?._id]);

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
        loading={isLoading || !channel?._id}
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
        <div className="flex flex-col gap-5">
          {!videos.length &&
          paginationInfo?.totalDocs === 0 &&
          paginationInfo.totalPages === 1 &&
          !isLoading ? (
            renderEmptyMessage()
          ) : (
            <>
              <div className="w-full flex gap-3">
                {["desc", "acc"].map((type) => (
                  <Button
                    key={type}
                    isLarge={false}
                    onClick={() => handleSortTypeChange(type as "acc" | "desc")}
                    className={twMerge(
                      "rounded-lg bg-gray-200 dark:bg-[#333333] text-sm text-[#0f0f0f] dark:text-white font-roboto border-none",
                      "hover:opacity-100",
                      sortType === type && sortBy === "createdAt"
                        ? ["bg-black text-white dark:bg-white dark:text-black"]
                        : ["hover:bg-gray-300 dark:hover:bg-[#404040]"]
                    )}
                  >
                    {type === "desc" ? "Newest" : "Oldest"}
                  </Button>
                ))}
                <Button
                  isLarge={false}
                  onClick={() => handleSortBy("views")}
                  className={twMerge(
                    "rounded-lg bg-gray-200 dark:bg-[#333333] text-sm text-[#0f0f0f] dark:text-white font-roboto border-none",
                    "hover:opacity-100",
                    sortBy === "views"
                      ? ["bg-black text-white dark:bg-white dark:text-black"]
                      : ["hover:bg-gray-300 dark:hover:bg-[#404040]"]
                  )}
                >
                  Popular
                </Button>
              </div>
              <div className="flex flex-grow flex-wrap items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
                {videos?.map((item) => (
                  <VideoCard key={item?._id} data={item} />
                ))}
                {(isLoading || !channel?._id) &&
                  Array.from({ length: limit }).map((_, idx) => (
                    <VideoSkeleton key={idx} />
                  ))}
              </div>
            </>
          )}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
};

export default Home;
