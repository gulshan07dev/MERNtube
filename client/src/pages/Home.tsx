import VideoCard from "@/component/video/VideoCard";
import VideoSkeleton from "@/component/video/VideoSkeleton";
import Layout from "@/layout/Layout";
import { getAllVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { loading, videos, currPage, totalPages, hasNextPage } = useSelector(
    (state: RootState) => state?.video
  );

  const containerRef = useRef<HTMLDivElement>(null);

  function fetchVideos(page: number, limit: number) {
    dispatch(getAllVideos({ page, limit }));
  }

  function handleScroll() {
    const container = containerRef.current;

    if (loading) {
      // If already loading, do nothing
      return;
    }

    if (currPage >= totalPages || !hasNextPage) {
      // No more videos to fetch
      return;
    }

    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - container.clientHeight
    ) {
      fetchVideos(currPage + 1, 6);
    }
  }

  useEffect(() => {
    fetchVideos(1, 6);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currPage, videos, loading, hasNextPage, totalPages, containerRef]);

  return (
    <Layout
      ref={containerRef}
      className="min-h-screen flex flex-wrap items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10 py-5 max-md:pb-20 lg:pl-8 max-lg:px-5"
    >
      {videos.map((video) => (
        <VideoCard key={video?._id} video={video} />
      ))}
      {loading &&
        Array.from({ length: 6 }).map((_, idx) => <VideoSkeleton key={idx} />)}
    </Layout>
  );
}
