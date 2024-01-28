import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import Layout from "@/layout/Layout";
import Button from "@/component/CoreUI/Button";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";
import { twMerge } from "tailwind-merge";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, videos, currPage, totalPages, totalDocs, hasNextPage } =
    useSelector((state: RootState) => state?.video);

  const limit = 6;
  const [sortType, setSortType] = useState("desc");
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = (page: number) => {
    if (loading) {
      return;
    }

    dispatch(getAllVideos({ page, limit, sortBy: "createdAt", sortType }));
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (currPage >= totalPages || !hasNextPage) {
      return;
    }

    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - container.clientHeight
    ) {
      fetchVideos(currPage + 1);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, [sortType]);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currPage, sortType, videos, loading, hasNextPage, totalPages]);

  const renderVideoSkeletons = () => {
    const numSkeletons =
      totalDocs - videos.length < limit && totalDocs - videos.length !== 0
        ? totalDocs - videos.length
        : limit;

    return Array.from({ length: numSkeletons }).map((_, idx) => (
      <VideoSkeleton key={idx} />
    ));
  };

  return (
    <Layout
      ref={containerRef}
      className="min-h-screen bg-white flex flex-col pb-5 max-md:pb-20 lg:pl-8 max-lg:px-5"
    >
      {/* filter */}
      <div className="w-full bg-white flex pb-3 pt-2 gap-3 sticky top-0">
        {["desc", "acc"].map((type) => (
          <Button
            key={type}
            label={type === "desc" ? "Newest" : "Oldest"}
            isLarge={false}
            onClick={() => setSortType(type)}
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
        {videos.map((video) => (
          <VideoCard key={video?._id} video={video} />
        ))}
        {loading && renderVideoSkeletons()}
      </div>
    </Layout>
  );
};

export default Home;
