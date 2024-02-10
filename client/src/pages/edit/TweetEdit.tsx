import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "@/layout/Layout";
import TweetCreateForm from "@/component/createForms/TweetCreateForm";
import { RootState } from "@/store/store";
import useActionHandler from "@/hooks/useActionHandler";
import { getTweetById } from "@/store/slices/tweetSlice";
import ErrorDialog from "@/component/error/ErrorDialog";
import Loader from "@/component/Loader";

export default function TweetEdit() {
  const { tweetId } = useParams();
  const { tweet } = useSelector((state: RootState) => state?.tweet);
  const { user: appLoading } = useSelector(
    (state: RootState) => state?.appLoading
  );

  const {
    error: tweetFetchError,
    isLoading: isTweetFetching,
    handleAction: fetchTweet,
  } = useActionHandler({
    action: getTweetById,
    isShowToastMessage: false,
  });

  useEffect(() => {
    if (tweetId) {
      fetchTweet(tweetId);
    }
  }, [tweetId]);

  return tweetFetchError ? (
    <ErrorDialog
      errorMessage={tweetFetchError}
      buttonLabel="Try again"
      buttonOnClick={() => fetchTweet(tweetId)}
    />
  ) : isTweetFetching || appLoading ? (
    <Loader />
  ) : (
    <Layout>
      <TweetCreateForm tweet={tweet} />
    </Layout>
  );
}
