import { useSelector } from "react-redux";

import PageLayout from "@/layouts/PageLayout";
import Tabs from "@/components/Tabs";
import VideoCreateForm from "@/components/createForms/VideoCreateForm";
import TweetCreateForm from "@/components/createForms/TweetCreateForm";
import { RootState } from "@/store/store";
import Loader from "@/components/Loader";

export default function Create() {
  const { isAppLoading } = useSelector((state: RootState) => state.appLoading);

  const tabs = [
    { label: "Video", components: <VideoCreateForm /> },
    { label: "Tweet", components: <TweetCreateForm /> },
  ];

  return (
    <PageLayout>
      {isAppLoading ? (
        <Loader />
      ) : (
        <Tabs tabs={tabs} className="max-w-full w-full" />
      )}
    </PageLayout>
  );
}
