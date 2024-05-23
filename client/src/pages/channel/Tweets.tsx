import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageLayout from "@/layout/PageLayout";
import { AppDispatch, RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import tweetService from "@/services/tweetService";
import useService from "@/hooks/useService";
import { setTweets, setTweetsPaginationInfo } from "@/store/slices/tweetSlice";
import TweetCard from "@/component/tweet/TweetCard";
import TweetSkeleton from "@/component/tweet/TweetSkeleton";
import EmptyMessage from "@/component/error/EmptyMessage";

export default function Tweets() {
  const dispatch: AppDispatch = useDispatch();
  const { channel } = useSelector((state: RootState) => state?.auth);
  const {
    tweets,
    tweetsPaginationInfo: { currentPage, totalPages, totalDocs, hasNextPage },
  } = useSelector((state: RootState) => state?.tweet);
  const limit = 5;

  const {
    error,
    isLoading,
    handler: getUserTweets,
  } = useService(tweetService.getUserTweets);

  const fetchUserTweets = async (page: number) => {
    if (!channel?._id) return;

    if (page === 1) {
      dispatch(setTweets([]));
    }
    const { success, responseData } = await getUserTweets({
      userId: channel?._id,
      queryParams: { page, limit },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(setTweets(page === 1 ? docs : [...tweets, ...docs]));
      dispatch(
        setTweetsPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        })
      );
    }
  };

  // fetch initial tweets
  useEffect(() => {
    fetchUserTweets(1);
  }, [channel?._id]);

  return (
    <PageLayout>
      <ScrollPagination
        paginationType="view-more"
        loadNextPage={() => fetchUserTweets(currentPage! + 1)}
        refreshHandler={() => fetchUserTweets(1)}
        dataLength={tweets.length}
        loading={isLoading}
        error={error?.message}
        currentPage={currentPage!}
        totalItems={totalDocs!}
        totalPages={totalPages!}
        hasNextPage={hasNextPage!}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more tweets to show !!!
          </p>
        }
        className={`lg:w-[75%] w-full`}
      >
        <div className="w-full flex flex-col gap-10 max-lg:items-center">
          {!tweets.length &&
          totalDocs === 0 &&
          totalPages === 1 &&
          !isLoading ? (
            <EmptyMessage
              message="empty tweets"
              buttonText="fetch again"
              onRefresh={() => fetchUserTweets(1)}
            />
          ) : (
            tweets?.map((tweet) => <TweetCard key={tweet?._id} tweet={tweet} />)
          )}
          {(isLoading || !channel?._id) &&
            Array.from({ length: limit }).map((_, idx) => (
              <TweetSkeleton key={idx} />
            ))}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
}
