import { useSelector } from "react-redux";

import Layout from "@/layout/Layout";
import Tabs from "@/component/Tabs";
import VideoCreateForm from "@/component/createForms/VideoCreateForm";
import TweetCreateForm from "@/component/createForms/TweetCreateForm";
import { RootState } from "@/store/store";
import Loader from "@/component/Loader";

export default function Create() {
  const { isAppLoading } = useSelector((state: RootState) => state.appLoading);

  const tabs = [
    { label: "Video", component: <VideoCreateForm /> },
    { label: "Tweet", component: <TweetCreateForm /> },
  ];

  return (
    <Layout>
      {isAppLoading ? (
        <Loader />
      ) : (
        <Tabs tabs={tabs} className="max-w-full w-full" />
      )}
    </Layout>
  );
}
