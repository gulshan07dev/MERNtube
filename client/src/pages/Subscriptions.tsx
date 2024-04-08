import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Layout from "@/layout/Layout";
import { AppDispatch, RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import ErrorDialog from "@/component/error/ErrorDialog";
import Avatar from "@/component/CoreUI/Avatar";
import { getSubscribedChannels } from "@/store/slices/subscriptionSlice";
import SubscribeBtn from "@/component/channel/SubscribeBtn";

export default function Subscriptions() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    subscribedChannelLists,
    loading,
    error,
    currentPage,
    totalPages,
    totalChannels,
    hasNextPage,
  } = useSelector((state: RootState) => state.subscription);

  const handleFetchSubscribedChannelLists = (page: number) => {
    if (!user) return;
    dispatch(
      getSubscribedChannels({
        subscriberId: user?._id,
        queryParams: { page, limit: 10 },
      })
    );
  };

  useEffect(() => {
    handleFetchSubscribedChannelLists(1);
  }, []);
  return (
    <Layout className="md:px-7 md:py-5 p-3.5">
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={currentPage}
        dataLength={subscribedChannelLists?.length}
        error={error}
        hasNextPage={hasNextPage}
        loadNextPage={() => handleFetchSubscribedChannelLists(currentPage + 1)}
        refreshHandler={() => handleFetchSubscribedChannelLists(1)}
        loading={loading}
        totalPages={totalPages}
        totalItems={totalChannels}
        className={twMerge("pb-10", error && "min-h-full")}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more subscribed channels to show !!!
          </p>
        }
      >
        {!subscribedChannelLists?.length &&
        totalChannels === 0 &&
        totalPages === 1 &&
        !loading ? (
          <ErrorDialog
            errorMessage="you have'nt subscribed any channel yet!"
            buttonLabel="Try again"
            buttonOnClick={() => handleFetchSubscribedChannelLists(1)}
          />
        ) : (
          <div className="flex flex-col gap-1 pb-4">
            <h1 className="text-4xl mb-4 font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
              Subscriptions
            </h1>
            {subscribedChannelLists.map(
              ({ subscribedChannelList: channel }) => (
               
                  <div
                    key={channel?._id}
                    className="w-full flex gap-3 py-3 px-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#272727]"
                  >
                    <Link to={`/c/${channel?.username}`} className="flex flex-grow gap-3">
                      <Avatar
                        fullName={channel?.fullName}
                        url={channel?.avatar?.url}
                        className="md:h-14 md:w-14 w-10 h-10 flex-shrink-0"
                      />
                      <div className="flex flex-grow flex-col gap-1">
                        <p className="md:text-[15px] text-[13px] leading-none text-gray-600 dark:text-[#AAAAAA] font-nunito_sans font-semibold">
                          {channel?.username}
                        </p>
                        <h2 className="md:text-2xl text-lg text-[#606060] dark:text-[#F1F1F1] font-roboto font-normal leading-tight">
                          {channel?.fullName}
                        </h2>
                      </div>
                    </Link>
                    <SubscribeBtn
                      channelId={channel?._id}
                      isSubscribed={true}
                    />
                  </div>
               
              )
            )}
          </div>
        )}
      </ScrollPagination>
    </Layout>
  );
}
