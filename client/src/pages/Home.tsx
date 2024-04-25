import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { twMerge } from "tailwind-merge";

import Layout from "@/layout/Layout";
import ScrollPagination from "@/component/ScrollPagination";
import { getAllVideos, setVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";
import Button from "@/component/CoreUI/Button";
import EmptyMessage from "@/component/EmptyMessage";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [sortType, setSortType] = useState<"desc" | "acc">("desc");
  const limit = 9;
  const {
    loading,
    error,
    videos,
    currPage,
    totalPages,
    totalDocs,
    hasNextPage,
  } = useSelector((state: RootState) => state.video);

  const fetchVideos = (page: number, type?: "desc" | "acc") => {
    if (page === 1) {
      dispatch(setVideos([]));
    }
    dispatch(
      getAllVideos({
        page,
        limit,
        sortBy: "createdAt",
        sortType: type || sortType,
      })
    );
  };

  const handleSortTypeChange = (type: "desc" | "acc") => {
    if (sortType !== type) {
      setSortType(() => type);
      fetchVideos(1, type);
    }
  };

  const renderSkeletons = () => {
    const numSkeletons =
      limit && videos.length !== 0
        ? Math.min(limit, totalDocs - videos.length)
        : limit;
    return Array.from({ length: numSkeletons }, (_, idx) => (
      <VideoSkeleton key={idx} />
    ));
  };

  // fetch initial videos
  useEffect(() => {
    if (currPage > 0) return;
    fetchVideos(1);
  }, []);

  return (
    <Layout>
      <ScrollPagination
        paginationType="infinite-scroll"
        loadNextPage={() => fetchVideos(currPage + 1)}
        refreshHandler={() => fetchVideos(1)}
        dataLength={videos.length}
        loading={loading}
        error={error}
        currentPage={currPage}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
        totalItems={totalDocs}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more videos to fetch !!!
          </p>
        }
      >
        <div className="w-full bg-white dark:bg-dark_bg flex  gap-3">
          {["desc", "acc"].map((type) => (
            <Button
              key={type}
              isLarge={false}
              onClick={() => handleSortTypeChange(type as "acc" | "desc")}
              className={twMerge(
                "rounded-lg bg-gray-200 dark:bg-[#272727] text-sm text-[#0f0f0f] dark:text-white font-roboto border-none",
                "hover:opacity-100",
                sortType === type
                  ? ["bg-black text-white dark:bg-white dark:text-black"]
                  : ["hover:bg-gray-300 dark:hover:bg-[#353535]"]
              )}
            >
              {type === "desc" ? "Newest" : "Oldest"}
            </Button>
          ))}
        </div>
        <div className="flex flex-grow flex-wrap items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
          {!videos.length && totalDocs === 0 && totalPages === 1 && !loading ? (
            <EmptyMessage
              message="empty videos"
              buttonText="fetch again"
              onRefresh={() => fetchVideos(1)}
            />
          ) : (
            videos?.map((item) => <VideoCard key={item?._id} data={item} />)
          )}
          {loading && renderSkeletons()}
        </div>
      </ScrollPagination>
    </Layout>
  );
};

export default Home;
