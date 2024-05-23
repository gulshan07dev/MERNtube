import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import LikeService from "@/services/likeService";
import useService from "@/hooks/useService";
import { AppDispatch, RootState } from "@/store/store";
import {
  setLikedVideos,
  setLikedVideosPaginationInfo,
} from "@/store/slices/likeSlice";
import EmptyMessage from "@/component/error/EmptyMessage";
import LikedVideoCard from "@/component/likedVideo/LikedVideoCard";

export default function LikedVideos() {
  const dispatch: AppDispatch = useDispatch();
  const {
    likedVideos,
    likedVideosPaginationInfo: {
      currentPage,
      totalPages,
      totalDocs,
      hasNextPage,
    },
  } = useSelector((state: RootState) => state.like);

  const {
    isLoading,
    error,
    handler: getLikedVideos,
  } = useService(LikeService.getLikedVideos);

  const handleFetchLikedVideos = async (page: number) => {
    if (page === 1) dispatch(setLikedVideos([]));
    const { success, responseData } = await getLikedVideos({ page, limit: 10 });
    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(setLikedVideos(page === 1 ? docs : [...likedVideos, ...docs]));
      dispatch(
        setLikedVideosPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        })
      );
    }
  };

  useEffect(() => {
    handleFetchLikedVideos(1);
  }, []);
  return (
    <PageLayout className="flex flex-col gap-7 max-lg:gap-5">
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={currentPage!}
        dataLength={likedVideos?.length}
        error={error?.message}
        hasNextPage={hasNextPage!}
        loadNextPage={() => handleFetchLikedVideos(currentPage! + 1)}
        refreshHandler={() => handleFetchLikedVideos(1)}
        loading={isLoading}
        totalPages={totalPages!}
        totalItems={totalDocs!}
        className={twMerge("flex flex-grow flex-col gap-3")}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more liked videos to show !!!
          </p>
        }
      >
        {!likedVideos?.length &&
        totalDocs === 0 &&
        totalPages === 1 &&
        !isLoading ? (
          <EmptyMessage
            message="empty liked videos!"
            buttonText="Try again"
            onRefresh={() => handleFetchLikedVideos(1)}
          />
        ) : (
          <>
            <h1 className="text-4xl font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
              Liked videos
            </h1>
            {likedVideos?.map(({ likedVideos: video }) => (
              <LikedVideoCard key={video?._id} video={video} />
            ))}
          </>
        )}
      </ScrollPagination>
    </PageLayout>
  );
}
