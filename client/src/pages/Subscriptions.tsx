import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PageLayout from "@/layout/PageLayout";
import { AppDispatch, RootState } from "@/store/store";
import ScrollPagination from "@/component/ScrollPagination";
import ErrorDialog from "@/component/error/ErrorDialog";
import Avatar from "@/component/CoreUI/Avatar";
import SubscribeBtn from "@/component/subscription/SubscribeBtn";
import useService from "@/hooks/useService";
import subscriptionService from "@/services/subscriptionService";
import { setSubscribedChannelList } from "@/store/slices/subscriptionSlice";

export default function Subscriptions() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  });
  const { subscribedChannelList } = useSelector(
    (state: RootState) => state.subscription
  );

  const {
    isLoading,
    error,
    handler: getSubscribedChannels,
  } = useService(subscriptionService.getSubscribedChannels);

  const handleFetchSubscribedChannelList = async (page: number) => {
    if (!user) return;

    if (page === 1) {
      dispatch(setSubscribedChannelList([]));
    }

    const { success, responseData } = await getSubscribedChannels({
      subscriberId: user?._id,
      queryParams: { page, limit: 10 },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      dispatch(
        setSubscribedChannelList(
          page === 1 ? docs : [...subscribedChannelList, ...docs]
        )
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
    handleFetchSubscribedChannelList(1);
  }, [user?._id]);
  return (
    <PageLayout>
      <ScrollPagination
        paginationType="infinite-scroll"
        currentPage={paginationInfo.currentPage}
        dataLength={subscribedChannelList?.length}
        error={error?.message}
        hasNextPage={paginationInfo.hasNextPage}
        loadNextPage={() =>
          handleFetchSubscribedChannelList(paginationInfo.currentPage + 1)
        }
        refreshHandler={() => handleFetchSubscribedChannelList(1)}
        loading={isLoading || !user?._id}
        totalPages={paginationInfo.totalPages}
        totalItems={paginationInfo.totalDocs}
        endMessage={
          <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more subscribed channels to show !!!
          </p>
        }
      >
        {!subscribedChannelList?.length &&
        paginationInfo.totalDocs === 0 &&
        paginationInfo.totalPages === 1 &&
        !isLoading ? (
          <ErrorDialog
            errorMessage="you have'nt subscribed any channel yet!"
            buttonLabel="Try again"
            buttonOnClick={() => handleFetchSubscribedChannelList(1)}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl mb-1 font-roboto font-semibold text-[#0F0F0F] dark:text-[#F1F1F1]">
              Subscriptions
            </h1>
            {subscribedChannelList.map(({ subscribedChannelList: channel }) => (
              <div
                key={channel?._id}
                className="w-full flex gap-3 py-3 px-2 truncate rounded-full hover:bg-slate-100 dark:hover:bg-[#272727]"
              >
                <Link
                  to={`/c/${channel?.username}`}
                  className="flex flex-grow gap-3 truncate"
                >
                  <Avatar
                    fullName={channel?.fullName}
                    url={channel?.avatar}
                    className="md:h-14 md:w-14 w-10 h-10 flex-shrink-0"
                  />
                  <div className="flex flex-grow flex-col gap-1 truncate">
                    <p className="md:text-[15px] text-[13px] leading-none text-gray-600 dark:text-[#AAAAAA] font-nunito_sans font-semibold truncate">
                      {channel?.username}
                    </p>
                    <h2 className="md:text-2xl text-base text-[#606060] dark:text-[#F1F1F1] font-roboto font-normal leading-tight truncate">
                      {channel?.fullName}
                    </h2>
                  </div>
                </Link>
                <SubscribeBtn
                  channelId={channel?._id}
                  isSubscribed={true}
                  className="max-sm:text-[13px] max-sm:py-1.5 max-sm:px-3"
                />
              </div>
            ))}
          </div>
        )}
      </ScrollPagination>
    </PageLayout>
  );
}
