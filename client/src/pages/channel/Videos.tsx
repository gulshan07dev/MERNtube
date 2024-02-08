import React from "react";
import { useSelector, useDispatch } from "react-redux";

import ScrollPagination, { queryParams } from "@/component/ScrollPagination";
import { getAllVideos, setVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { channel } = useSelector((state: RootState) => state?.auth);

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
    <ScrollPagination
      RenderComponent={VideoCard}
      SkeletonComponent={VideoSkeleton}
      data={videos}
      fetchData={fetchVideos}
      queryParams={{
        limit: 3,
        sortBy: "createdAt",
        userId: channel?._id,
      }}
      loading={loading || !channel}
      error={error}
      currPage={currPage}
      hasNextPage={hasNextPage}
      totalPages={totalPages}
      totalDocs={totalDocs}
    />
  );
};

export default Home;
