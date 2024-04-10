import Avatar from "@/component/CoreUI/Avatar";
import ScrollPagination from "@/component/ScrollPagination";
import ErrorDialog from "@/component/error/ErrorDialog";
import SubscribeBtn from "@/component/subscription/SubscribeBtn";
import { getUserChannelSubscribers } from "@/store/slices/subscriptionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function Subscribers() {
  const dispatch: AppDispatch = useDispatch();
  const { user, channel } = useSelector((state: RootState) => state?.auth);
  const {
    subscriberLists,
    loading,
    error,
    currentPage,
    totalPages,
    totalChannels,
    hasNextPage,
  } = useSelector((state: RootState) => state.subscription);

  const handleFetchSubscriberLists = (page: number) => {
    if (!channel) return;
    dispatch(
      getUserChannelSubscribers({
        channelId: channel?._id,
        queryParams: { page, limit: 10 },
      })
    );
  };

  useEffect(() => {
    handleFetchSubscriberLists(1);
  }, [channel?._id]);
  return (
    <ScrollPagination
      paginationType="infinite-scroll"
      currentPage={currentPage}
      dataLength={subscriberLists?.length}
      error={error}
      hasNextPage={hasNextPage}
      loadNextPage={() => handleFetchSubscriberLists(currentPage + 1)}
      refreshHandler={() => handleFetchSubscriberLists(1)}
      loading={loading || !channel}
      totalPages={totalPages}
      totalItems={totalChannels}
      className={twMerge("pb-10", error && "min-h-full pt-10")}
      endMessage={
        <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
          No more subscriber to show !!!
        </p>
      }
    >
      {!subscriberLists?.length &&
      totalChannels === 0 &&
      totalPages === 1 &&
      !loading ? (
        <ErrorDialog
          errorMessage="No users have subscribed to this channel!"
          buttonLabel="Try again"
          buttonOnClick={() => handleFetchSubscriberLists(1)}
        />
      ) : (
        <div className="flex flex-col gap-1 pb-4">
          {subscriberLists.map(({ subscriberList: subscriberChannel }) => (
            <div
              key={subscriberChannel?._id}
              className="w-full flex items-center gap-3 py-3 px-2 truncate rounded-full hover:bg-slate-100 dark:hover:bg-[#272727]"
            >
              <Link
                to={`/c/${subscriberChannel?.username}`}
                className="flex flex-grow gap-3 truncate"
              >
                <Avatar
                  fullName={subscriberChannel?.fullName}
                  url={subscriberChannel?.avatar?.url}
                  className="md:h-14 md:w-14 w-10 h-10 flex-shrink-0"
                />
                <div className="flex flex-grow flex-col gap-1 truncate">
                  <p className="md:text-[15px] text-[13px] leading-none text-gray-600 dark:text-[#AAAAAA] font-nunito_sans font-semibold truncate">
                    {subscriberChannel?.username}
                  </p>
                  <h2 className="md:text-2xl text-base text-[#606060] dark:text-[#F1F1F1] font-roboto font-normal leading-tight truncate">
                    {subscriberChannel?.fullName}
                  </h2>
                </div>
              </Link>
              {user?._id !== subscriberChannel?._id && (
                <SubscribeBtn
                  channelId={subscriberChannel?._id}
                  isSubscribed={true}
                  className="max-sm:text-[13px] max-sm:py-1.5 max-sm:px-3"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollPagination>
  );
}
