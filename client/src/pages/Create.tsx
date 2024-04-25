import Layout from "@/layout/Layout";
import Tabs from "@/component/Tabs";
import VideoCreateForm from "@/component/createForms/VideoCreateForm";
import TweetCreateForm from "@/component/createForms/TweetCreateForm";

export default function Create() {
  const tabs = [
    { label: "Video", component: <VideoCreateForm /> },
    { label: "Tweet", component: <TweetCreateForm /> },
  ];

  return (
    <Layout>
      <Tabs tabs={tabs} className="max-w-full w-full" />
    </Layout>
  );
}
