import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import { getUserTweets } from "@/store/slices/tweetSlice";
import useActionHandler from "@/hooks/useActionHandler";
import Skeleton from "@/component/Skeleton";
import TweetCard from "@/component/tweet/TweetCard";

export default function Tweets() {
  const { channel } = useSelector((state: RootState) => state?.auth);
  const { tweets } = useSelector((state: RootState) => state?.tweet);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { error, isLoading, handleAction } = useActionHandler({
    action: getUserTweets,
    isShowToastMessage: false,
  });

  const fetchUserTweets = async (page: number) => {
    if (!channel?._id) return;

    const { isSuccess, resData } = await handleAction({
      userId: channel?._id,
      queryParams: { page, limit: 5 },
    });

    if (isSuccess && resData?.result) {
      setCurrPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalDocs(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
    }
  };

  // fetch initial tweets
  useEffect(() => {
    fetchUserTweets(1);
  }, [channel?._id]);

  return (
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
        <p className="py-4 text-lg text-gray-800 text-center font-Noto_sans">
          No more tweets to show !!!
        </p>
      }
      className="pb-20"
    >
      <div className="flex flex-col gap-10 max-lg:items-center min-h-full py-5">
        {isLoading ? (
          <Skeleton className="h-[100px] w-full" />
        ) : (
          tweets?.map((tweet) => <TweetCard key={tweet?._id} data={tweet} />)
        )}
      </div>
    </ScrollPagination>
  );
}
