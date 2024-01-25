import VideoCard from "@/component/video/VideoCard";
import Layout from "@/layout/Layout";
import { getAllVideos } from "@/store/slices/videoSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { error, loading, videos, currPage, totalPages, hasNextPage } =
    useSelector((state: RootState) => state?.video);

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
      fetchVideos(currPage + 1, 10);
    }
  }

  useEffect(() => {
    fetchVideos(1, 10);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currPage, videos, loading, hasNextPage, totalPages]);

  return (
    <Layout
      ref={containerRef}
      className="flex flex-wrap max-lg:justify-center md:gap-8 gap-5 py-5 max-md:pb-20 lg:pl-8 max-lg:px-1"
    >
      {videos.map((video) => (
        <VideoCard video={video} />
      ))}
      {loading && <p>loading...</p>}
    </Layout>
  );
}
