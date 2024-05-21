import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PageLayout from "@/layout/PageLayout";
import { AppDispatch, RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import Avatar from "@/component/CoreUI/Avatar";
import ErrorDialog from "@/component/error/ErrorDialog";
import SubscribeBtn from "@/component/subscription/SubscribeBtn";
import useService from "@/hooks/useService";
import subscriptionService from "@/services/subscriptionService";
import { setSubscriberList } from "@/store/slices/subscriptionSlice";

export default function Subscribers() {
  const dispatch: AppDispatch = useDispatch();
  const { user, channel } = useSelector((state: RootState) => state?.auth);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  });
  const { subscriberList } = useSelector(
    (state: RootState) => state.subscription
  );

  const {
    isLoading,
    error,
    handler: getUserChannelSubscribers,
  } = useService(subscriptionService.getUserChannelSubscribers);

  const handleFetchSubscriberList = async (page: number) => {
    if (!channel) return;

    if (page === 1) {
      dispatch(setSubscriberList([]));
    }
    const { success, responseData } = await getUserChannelSubscribers({
      channelId: channel?._id,
      queryParams: { page, limit: 10 },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(
        setSubscriberList(page === 1 ? docs : [...subscriberList, ...docs])
      );
      setPaginationInfo({
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      });
    }
  };

  useEffect(() => {
    handleFetchSubscriberList(1);
  }, [channel?._id]);
  return (
    <PageLayout>
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={paginationInfo.currentPage}
        dataLength={subscriberList?.length}
        error={error?.message}
        hasNextPage={paginationInfo.hasNextPage}
        loadNextPage={() =>
          handleFetchSubscriberList(paginationInfo.currentPage + 1)
        }
        refreshHandler={() => handleFetchSubscriberList(1)}
        loading={isLoading || !channel}
        totalPages={paginationInfo.totalPages}
        totalItems={paginationInfo.totalDocs}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more subscriber to show !!!
          </p>
        }
      >
        {!subscriberList?.length &&
        paginationInfo.totalDocs === 0 &&
        paginationInfo.totalPages === 1 &&
        !isLoading ? (
          <ErrorDialog
            errorMessage="No users have subscribed to this channel!"
            buttonLabel="Try again"
            buttonOnClick={() => handleFetchSubscriberList(1)}
          />
        ) : (
          <div className="flex flex-col gap-1 pb-4">
            {subscriberList.map(({ subscriberList: subscriberChannel }) => (
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
                    url={subscriberChannel?.avatar}
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
                    isSubscribed={subscriberChannel?.isSubscribed}
                    className="max-sm:text-[13px] max-sm:py-1.5 max-sm:px-3"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollPagination>
    </PageLayout>
  );
}
