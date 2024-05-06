import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaEye,
  FaUserPlus,
  FaThumbsUp,
  FaVideo,
  FaSyncAlt,
} from "react-icons/fa";

import { RootState } from "@/store/store";
import PageLayout from "@/layout/PageLayout";
import useActionHandler from "@/hooks/useActionHandler";
import {
  getChannelStats,
  getChannelVideos,
} from "@/store/slices/dashboardSlice";
import StatCard from "@/component/dashboard/StatCard";
import Button from "@/component/CoreUI/Button";
import ErrorDialog from "@/component/error/ErrorDialog";
import Skeleton from "@/component/Skeleton";
import ChannelVideosTableRow from "@/component/dashboard/ChannelVideosTableRow";
import ErrorMessage from "@/component/error/ErrorMessage";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state?.auth);
  const { stats, channelVideos } = useSelector(
    (state: RootState) => state?.dashboard
  );

  const {
    error: statsFetchingError,
    isLoading: isFetchingStats,
    handleAction: handleStatsAction,
  } = useActionHandler({
    action: getChannelStats,
    isShowToastMessage: false,
  });

  const {
    error: channelVideosFetchingError,
    isLoading: isFetchingChannelVideos,
    handleAction: handleChannelVideosAction,
  } = useActionHandler({
    action: getChannelVideos,
    isShowToastMessage: false,
  });

  const fetchStats = async () => {
    await handleStatsAction();
  };

  const fetchChannelVideos = async () => {
    await handleChannelVideosAction();
  };

  useEffect(() => {
    if (!Object.values(stats).length) {
      fetchStats();
    }
  }, []);

  useEffect(() => {
    fetchChannelVideos();
  }, []);

  return (
    <PageLayout className="flex flex-col gap-10">
      <header>
        <div className="font-roboto font-semibold flex gap-2 flex-wrap leading-tight">
          <h1 className="text-2xl text-black dark:text-white leading-none">
            Welcome Back, {user?.fullName?.split(" ")[0]}
          </h1>
          <span className="text-zinc-700 dark:text-slate-300">To</span>
          <h1 className="text-3xl text-violet-400 leading-none">
            Your Dashboard
          </h1>
        </div>
        <p className="font-hedvig_letters text-lg text-zinc-700 dark:text-slate-200">
          Seamless videos managament, elevated result
        </p>
      </header>

      {/* stats */}
      <div className="w-full relative h-fit flex flex-col pb-10 px-5 pt-2 bg-[linear-gradient(to_right,#dddddd_1px,#f3f3f3_1px),linear-gradient(to_bottom,#eeeeee_1px,#f3f3f3_1px)] dark:bg-[linear-gradient(to_right,#5e5e5e,transparent_1px),linear-gradient(to_bottom,#5e5e5e,transparent_1px)] bg-[size:50px_50px]">
        <div className="flex flex-col gap-6 r">
          <div className="flex gap-3 items-center">
            <Button
              btnType="icon-btn"
              onClick={fetchStats}
              disabled={isFetchingStats}
              className="text-lg bg-slate-100 dark:bg-zinc-600 hover:bg-white dark:hover:bg-zinc-800 rounded-sm hover:rotate-90 transition-transform"
            >
              <FaSyncAlt />
            </Button>
            <h2 className="text-xl font-semibold text-black dark:text-white font-Noto_sans">
              Stats
            </h2>
          </div>
          {statsFetchingError ? (
            <ErrorDialog errorMessage={statsFetchingError} />
          ) : (
            <div className="relative grid lg:grid-cols-4 grid-cols-2 gap-5 lg:h-[200px] h-[400px]">
              {!isFetchingStats && (
                <>
                  <StatCard
                    icon={<FaVideo />}
                    label="Total videos"
                    value={stats?.totalVideos || 0}
                  />
                  <StatCard
                    icon={<FaEye />}
                    label="Total views"
                    value={stats?.totalVideoViews || 0}
                  />
                  <StatCard
                    icon={<FaUserPlus />}
                    label="Total subscribers"
                    value={stats?.totalSubscribers || 0}
                  />
                  <StatCard
                    icon={<FaThumbsUp />}
                    label="Total likes"
                    value={stats?.totalVideoLikes || 0}
                  />
                </>
              )}
              {isFetchingStats &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* channel videos: edit, delete and update video status */}
      <div
        className="w-full flex flex-col border border-gray-300"
        id="your-videos"
      >
        {/* videos table */}
        <div className="flex flex-col gap-6 r">
          <div className="flex gap-3 items-center px-5 py-3">
            <Button
              btnType="icon-btn"
              onClick={fetchChannelVideos}
              disabled={isFetchingChannelVideos}
              className="text-lg bg-slate-100 dark:bg-zinc-600 hover:bg-white dark:hover:bg-zinc-800 rounded-sm hover:rotate-90 transition-transform"
            >
              <FaSyncAlt />
            </Button>
            <h2 className="text-xl font-semibold text-black dark:text-white font-Noto_sans">
              your Videos
            </h2>
          </div>
          {channelVideosFetchingError ? (
            <ErrorDialog errorMessage={channelVideosFetchingError} />
          ) : !isFetchingChannelVideos ? (
            channelVideos?.length === 0 ? (
              <ErrorMessage
                errorMessage="You have not been uploaded any video yet!"
                className="mx-4 w-auto mb-7"
              />
            ) : (
              <div className="w-full relative overflow-x-auto">
                <table
                  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  aria-label="Channel Videos"
                >
                  <thead className="md:text-lg text-sm text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white">
                    <tr className="whitespace-nowrap">
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Video
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelVideos?.map((video) => (
                      <ChannelVideosTableRow key={video?._id} video={video} />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 mx-4" />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
