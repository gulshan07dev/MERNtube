import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";

import Layout from "@/layout/Layout";
import useActionHandler from "@/hooks/useActionHandler";
import { RootState } from "@/store/store";
import { getVideoByVideoId } from "@/store/slices/videoSlice";
import { getChannel } from "@/store/slices/authSlice";
import { toggleVideoLike } from "@/store/slices/likeSlice";
import LikeBtn from "@/component/CoreUI/LikeBtn";
import ShareDialog from "@/component/ShareDialog";
import SubscribeBtn from "@/component/channel/SubscribeBtn";
import CommentBox from "@/component/comment/CommentBox";
import Skeleton from "@/component/Skeleton";
import Avatar from "@/component/CoreUI/Avatar";
import ErrorDialog from "@/component/error/ErrorDialog";
import Button from "@/component/CoreUI/Button";
import { FaShare } from "react-icons/fa";

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [isShareVideoDialogOpen, setIsShareVideoDialogOpen] = useState(false);
  const { video } = useSelector((state: RootState) => state?.video);
  const { channel } = useSelector((state: RootState) => state?.auth);

  const {
    isLoading: isFetchingVideo,
    error: videoFetchingError,
    handleAction: handleFetchVideoAction,
  } = useActionHandler({
    action: getVideoByVideoId,
    isShowToastMessage: false,
  });

  const fetchVideo = async () => {
    await handleFetchVideoAction(videoId);
  };

  const {
    isLoading: isFetchingChannel,
    error: channelFetchingError,
    handleAction: handleFetchChannelAction,
  } = useActionHandler({
    action: getChannel,
    isShowToastMessage: false,
  });

  const fetchChannel = async (username: string) => {
    await handleFetchChannelAction(username);
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (video?.owner?.username && !isFetchingVideo && video) {
      fetchChannel(video?.owner?.username);
    }
  }, [isFetchingVideo, video?.owner?.username]);

  return (
    <Layout
      byDefaultSidebarHidden={true}
      className="flex gap-6 max-lg:flex-col max-lg:gap-14 md:px-8 px-4 md:pt-7 pt-3 max-md:pb-16 pb-3"
    >
      {videoFetchingError && (
        <ErrorDialog
          errorMessage={videoFetchingError}
          buttonLabel="Try again"
          buttonOnClick={fetchVideo}
        />
      )}

      <div className="w-full">
        {/* video player */}
        {isFetchingVideo || !video ? (
          <Skeleton className="md:h-[400px] sm:h-[300px] h-[250px] w-full rounded-lg" />
        ) : (
          <video
            src={video?.videoFile?.url}
            className="md:h-[400px] sm:h-[300px] w-full"
            controls
          />
        )}

        {/* video details */}
        <div className="w-full flex flex-col gap-5">
          {/* title */}
          {isFetchingVideo || !video ? (
            <Skeleton className="w-[80%] h-8 mt-5" />
          ) : (
            <h2 className="text-[20px] font-Noto_sans font-[600] text-[#0F0F0F] dark:text-[#F1F1F1]">
              {video.title}
            </h2>
          )}
          {/* channel details */}
          <div className="flex sm:justify-between sm:items-center max-sm:flex-col max-sm:gap-3">
            {isFetchingChannel || !channel || channelFetchingError ? (
              <div className="flex-grow flex gap-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-5 md:w-[40%] w-[70%]" />
              </div>
            ) : (
              <div className="flex gap-2 items-center max-sm:w-full">
                <Avatar
                  fullName={channel?.fullName}
                  url={channel?.avatar?.url}
                  className="size-8"
                  onClick={() =>
                    navigate(`/c/${channel?.username}`, {
                      state: { channel },
                    })
                  }
                />
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-Noto_sans font-[600] text-[#0F0F0F] dark:text-[#F1F1F1] leading-4">
                    {channel?.fullName}
                  </h3>
                  <p className="text-[13px] text-zinc-600 dark:text-[#AAAAAA] font-semibold leading-0">
                    {abbreviateNumber(channel?.subscriberCount || 0, 1)}{" "}
                    {channel?.subscriberCount || 0 <= 1
                      ? "Subscriber"
                      : "Subscribers"}
                  </p>
                </div>
                <div className="flex-grow justify-end">
                  <SubscribeBtn
                    channelId={channel?._id}
                    isSubscribed={channel?.isSubscribed}
                  />
                </div>
              </div>
            )}

            {!isFetchingVideo && video && (
              <div className="flex gap-3 max-md:justify-end px-3">
                <LikeBtn
                  contentId={video._id}
                  isLiked={video.isLiked}
                  likeCount={video.videoLikesCount}
                  toggleLikeAction={toggleVideoLike}
                />
                <Button
                  className="bg-slate-200 dark:bg-[#272727] text-black dark:text-white rounded-full hover:opacity-1 hover:bg-slate-300 dark:hover:bg-[#505050] max-md:py-2"
                  icon={<FaShare />}
                  onClick={() => setIsShareVideoDialogOpen((prev) => !prev)}
                >
                  Share
                </Button>
                <ShareDialog
                  open={isShareVideoDialogOpen}
                  handleClose={() => setIsShareVideoDialogOpen(false)}
                  url={document.URL}
                />
              </div>
            )}
          </div>

          {/* video description */}
          {isFetchingVideo || !video ? (
            <Skeleton className="w-full h-16 rounded-lg" />
          ) : (
            <div className="w-full flex flex-col gap-3 md:mt-3 mt-5 rounded-lg bg-slate-200 dark:bg-[#172227] p-3">
              <p className="flex gap-3 items-center text-base text-black dark:text-white">
                <span>{abbreviateNumber(video?.views, 1)} views</span>
                <TimeAgo date={video?.createdAt} />
              </p>
              <p className="text-sm font-roboto text-gray-800 dark:text-slate-200">
                {video?.description || "No Description"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* comments */}
      <div
        className={twMerge(
          "lg:w-[645px] w-full rounded-md min-h-full pb-3",
          !isFetchingVideo && video && ["md:shadow-2xl md:px-4"]
        )}
      >
        {isFetchingVideo || !video ? (
          <Skeleton className="w-full h-full max-lg:h-[450px] rounded-lg" />
        ) : (
          <CommentBox contentId={video._id} type="video" />
        )}
      </div>
    </Layout>
  );
}
