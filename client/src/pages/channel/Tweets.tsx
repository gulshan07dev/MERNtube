import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageLayout from "@/layout/PageLayout";
import { AppDispatch, RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import { getUserTweets, setTweets } from "@/store/slices/tweetSlice";
import useActionHandler from "@/hooks/useActionHandler";
import TweetCard from "@/component/tweet/TweetCard";
import TweetSkeleton from "@/component/tweet/TweetSkeleton";
import EmptyMessage from "@/component/error/EmptyMessage";

export default function Tweets() {
  const dispatch: AppDispatch = useDispatch();
  const { channel } = useSelector((state: RootState) => state?.auth);
  const { tweets } = useSelector((state: RootState) => state?.tweet);
  const [currPage, setCurrPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { error, isLoading, handleAction } = useActionHandler({
    action: getUserTweets,
    isShowToastMessage: false,
  });

  const fetchUserTweets = async (page: number) => {
    if (!channel?._id) return;

    if (page === 1) {
      dispatch(setTweets([]));
    }
    const { isSuccess, resData } = await handleAction({
      userId: channel?._id,
      queryParams: { page, limit },
    });

    if (isSuccess && resData?.result) {
      setCurrPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalDocs(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
    }
  };

  const renderSkeletons = () => {
    const numSkeletons =
      limit && tweets.length !== 0
        ? Math.min(limit, totalDocs - tweets.length)
        : limit;
    return Array.from({ length: numSkeletons }, (_, idx) => (
      <TweetSkeleton key={idx} />
    ));
  };

  // fetch initial tweets
  useEffect(() => {
    fetchUserTweets(1);
  }, [channel?._id]);

  return (
    <PageLayout>
      <ScrollPagination
        paginationType="view-more"
        loadNextPage={() => fetchUserTweets(currPage + 1)}
        refreshHandler={() => fetchUserTweets(1)}
        dataLength={tweets.length}
        loading={isLoading}
        error={error}
        currentPage={currPage}
        totalItems={totalDocs}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more tweets to show !!!
          </p>
        }
        className={`lg:w-[75%] w-full`}
      >
        <div className="w-full flex flex-col gap-10 max-lg:items-center max-lg:px-1 py-5">
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
          {(isLoading || !channel?._id) && renderSkeletons()}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
}
