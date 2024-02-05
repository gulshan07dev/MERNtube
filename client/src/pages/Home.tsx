import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Layout from "@/layout/Layout";
import ScrollPagination, { queryParams } from "@/component/ScrollPagination";
import { getAllVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const containerRef = useRef(null);

  const {
    loading,
    error,
    videos,
    currPage,
    totalPages,
    totalDocs,
    hasNextPage,
  } = useSelector((state: RootState) => state?.video);

  const fetchVideos = (queryParams: queryParams) => {
    if (loading) return;
    dispatch(getAllVideos(queryParams));
  };

  return (
    <Layout ref={containerRef}>
      <ScrollPagination
        RenderComponent={VideoCard}
        currPage={currPage}
        data={videos}
        fetchData={fetchVideos}
        error={error}
        loading={loading}
        queryParams={{ limit: 6, sortBy: "createdAt" }}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
        totalDocs={totalDocs}
        SkeletonComponent={VideoSkeleton}
        containerRef={containerRef}
      />
    </Layout>
  );
};

export default Home;
