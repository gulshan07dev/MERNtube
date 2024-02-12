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

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [sortType, setSortType] = useState<"desc" | "acc">("desc");
  const limit = 6;
  const {
    loading,
    error,
    videos,
    currPage,
    totalPages,
    totalDocs,
    hasNextPage,
  } = useSelector((state: RootState) => state.video);

  const fetchVideos = (page: number) => {
    if (page === 1) {
      dispatch(setVideos([]));
    }
    dispatch(getAllVideos({ page, limit, sortBy: "createdAt", sortType }));
  };

  const handleSortTypeChange = (type: "desc" | "acc") => {
    setSortType(type);
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
    fetchVideos(1);
  }, [sortType]);

  return (
    <Layout className="lg:pl-8 max-lg:px-5">
      <ScrollPagination
        next={() => fetchVideos(currPage + 1)}
        refreshHandler={() => fetchVideos(1)}
        dataLength={videos.length}
        loading={loading}
        error={error}
        currPage={currPage}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
        totalDocs={totalDocs}
        endMessage={
          <p className="py-4 text-lg text-gray-800 text-center font-Noto_sans">
            No more videos to fetch !!!
          </p>
        }
      >
        <div className="w-full bg-white flex pb-3 pt-2 gap-3 sticky top-0 z-[2]">
          {["desc", "acc"].map((type) => (
            <Button
              key={type}
              label={type === "desc" ? "Newest" : "Oldest"}
              isLarge={false}
              onClick={() => handleSortTypeChange(type as "acc" | "desc")}
              className={twMerge(
                "rounded-lg bg-gray-200 text-sm text-[#0f0f0f] font-roboto border-none",
                "hover:opacity-100",
                sortType === type
                  ? ["bg-black text-white"]
                  : ["hover:bg-gray-300"]
              )}
            />
          ))}
        </div>
        <div className="flex flex-grow flex-wrap bg-white items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
          {videos?.map((item, index) => (
            <VideoCard key={index} data={item} />
          ))}
          {loading && renderSkeletons()}
        </div>
      </ScrollPagination>
    </Layout>
  );
};

export default Home;
