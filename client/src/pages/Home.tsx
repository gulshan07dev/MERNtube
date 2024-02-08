import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Layout from "@/layout/Layout";
import ScrollPagination, { queryParams } from "@/component/ScrollPagination";
import { getAllVideos, setVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

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
    if (queryParams.page === 1) {
      dispatch(setVideos([]));
    }
    dispatch(getAllVideos(queryParams));
  };

  return (
    <Layout className="lg:pl-8 max-lg:px-5">
      <ScrollPagination
        RenderComponent={VideoCard}
        SkeletonComponent={VideoSkeleton}
        data={videos}
        fetchData={fetchVideos}
        queryParams={{ limit: 6, sortBy: "createdAt" }}
        loading={loading}
        error={error}
        currPage={currPage}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
        totalDocs={totalDocs}
      />
    </Layout>
  );
};

export default Home;
