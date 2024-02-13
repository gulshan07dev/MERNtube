import { useEffect } from "react";
import { useSelector } from "react-redux";

import { getUserTweets } from "@/store/slices/tweetSlice";
import { RootState } from "@/store/store";
import ErrorDialog from "@/component/error/ErrorDialog";
import useActionHandler from "@/hooks/useActionHandler";
import Skeleton from "@/component/Skeleton";
import TweetCard from "@/component/tweet/TweetCard";

export default function Tweets() {
  const { channel } = useSelector((state: RootState) => state?.auth);
  const { tweets } = useSelector((state: RootState) => state?.tweet);

  const { error, isLoading, handleAction } = useActionHandler({
    action: getUserTweets,
    isShowToastMessage: false,
  });

  const fetchUserTweets = async () => {
    if (!channel?._id) return;
    await handleAction(channel?._id);
  };
  useEffect(() => {
    fetchUserTweets();
  }, [channel?._id]);

  return error ? (
    <ErrorDialog
      errorMessage={error}
      buttonLabel="Try again"
      buttonOnClick={fetchUserTweets}
    />
  ) : (
    <div className="flex flex-col gap-10 max-lg:items-center min-h-screen pt-5 pb-20">
      {isLoading ? (
        <Skeleton />
      ) : (
        tweets?.map((tweet) => <TweetCard key={tweet._id} data={tweet} />)
      )}
    </div>
  );
}
