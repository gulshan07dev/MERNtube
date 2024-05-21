import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { FaShare } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";

import PageLayout from "@/layout/PageLayout";
import videoService from "@/services/videoService";
import authService from "@/services/authService";
import LikeService from "@/services/likeService";
import useService from "@/hooks/useService";
import { AppDispatch, RootState } from "@/store/store";
import { setVideo } from "@/store/slices/videoSlice";
import { setChannel } from "@/store/slices/authSlice";
import { IChannel } from "@/interfaces";
import LikeBtn from "@/component/CoreUI/LikeBtn";
import { addVideoToWatchHistory } from "@/store/slices/watchHistorySlice";
import ShareDialog from "@/component/ShareDialog";
import AddVideoToPlaylistDialog from "@/component/playlist/AddVideoToPlaylistDialog";
import AddVideoToWatchLaterDialog from "@/component/watchLater/AddVideoToWatchLaterDialog";
import SubscribeBtn from "@/component/subscription/SubscribeBtn";
import CommentBox from "@/component/comment/CommentBox";
import Skeleton from "@/component/Skeleton";
import Avatar from "@/component/CoreUI/Avatar";
import TextWithToggle from "@/component/CoreUI/TextWithToggle";
import Button from "@/component/CoreUI/Button";
import ErrorDialog from "@/component/error/ErrorDialog";

export default function VideoPlayer() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [modalOpen, setModalOpen] = useState<
    | "share_video_dialog"
    | "add_video_to_playlist_dialog"
    | "add_video_to_watchlater_dialog"
    | null
  >(null);
  const [isVideoAddedToWatchHistory, setIsVideoAddedToWatchHistory] =
    useState(false);
  const { video } = useSelector((state: RootState) => state?.video);
  const { channel } = useSelector((state: RootState) => state?.auth);

  const {
    isLoading: isFetchingVideo,
    error: videoFetchingError,
    handler: getVideoByVideoId,
  } = useService(videoService.getVideoByVideoId);

  const fetchVideo = async () => {
    if (videoId) {
      const { success, responseData } = await getVideoByVideoId(videoId);
      if (success) {
        dispatch(setVideo(responseData?.data?.video));
      }
    }
  };

  const {
    isLoading: isFetchingChannel,
    error: channelFetchingError,
    handler: getChannel,
  } = useService(authService.getChannel);

  const fetchChannel = async (username: string) => {
    const { success, responseData } = await getChannel({ username });
    if (success) {
      dispatch(setChannel(responseData?.data?.channel));
    }
  };

  const { isLoading: isVideoLikeLoading, handler: toggleVideoLike } =
    useService(LikeService.toggleVideoLike, {
      isShowToastMessage: true,
    });

  const handleToggleVideoLike = async () => {
    if (!video) return false;
    const { success } = await toggleVideoLike(video?._id);
    return success;
  };

   const onSubscribeToggle = () => {
     dispatch(
       setChannel({
         ...channel,
         subscriberCount: channel?.isSubscribed
           ? channel?.subscriberCount === 0
             ? 0
             : channel?.subscriberCount - 1
           : (channel?.subscriberCount || 0) + 1,
         isSubscribed: !channel?.isSubscribed,
       } as IChannel)
     );
   };
   
  const handleModalClose = () => {
    setModalOpen(null);
  };

  // fetch video
  useEffect(() => {
    if (!videoId) {
      return;
    }
    fetchVideo();
  }, [videoId]);

  // add video to watch history
  useEffect(() => {
    if (!videoId || !video || isFetchingVideo || isVideoAddedToWatchHistory) {
      return;
    }
    (async () => {
      const res = await dispatch(addVideoToWatchHistory(videoId));
      if (res.payload.success) {
        setIsVideoAddedToWatchHistory(true);
      }
    })();
  }, [videoId, video?._id, isFetchingVideo, isVideoAddedToWatchHistory]);

  // fetch channel details of the video owner
  useEffect(() => {
    if (!video?.owner?.username || isFetchingVideo) {
      return;
    }
    fetchChannel(video?.owner?.username);
  }, [isFetchingVideo, video?.owner?.username]);

  return (
    <PageLayout className="w-full flex gap-6 max-xl:flex-col max-xl:gap-14">
      {videoFetchingError ? (
        <ErrorDialog
          errorMessage={videoFetchingError?.message}
          buttonLabel="Try again"
          buttonOnClick={fetchVideo}
        />
      ) : (
        <>
          {/* video and channel details */}
          <div className="xl:flex-grow w-full">
            {/* video player */}
            {isFetchingVideo || !video ? (
              <Skeleton className="md:h-[400px] sm:h-[300px] h-[180px] w-full rounded-lg" />
            ) : (
              <video
                src={video?.videoFile}
                className="md:h-[400px] sm:h-[300px] h-[180px] w-full rounded-md shadow-[10px_25px_150px_#e3e3e3] dark:shadow-[10px_25px_150px_#252525]"
                controls
              />
            )}

            {/* video details */}
            <div className="w-full flex flex-col gap-5 px-1 pt-3">
              {/* title */}
              {isFetchingVideo || !video ? (
                <Skeleton className="w-[80%] h-8 mt-5" />
              ) : (
                <h2 className="md:text-[20px] text-[18px] font-Noto_sans md:font-[600] font-[500] text-[#0F0F0F] dark:text-[#F1F1F1]">
                  {video.title}
                </h2>
              )}
              {/* channel details */}
              <div className="flex lg:justify-between lg:items-center lg:gap-10 max-lg:flex-col max-lg:gap-7">
                {isFetchingChannel || !channel || channelFetchingError ? (
                  <div className="flex-grow flex gap-2">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-5 md:w-[40%] w-[70%]" />
                  </div>
                ) : (
                  <div className="flex items-center max-md:w-full md:justify-start max-md:justify-between md:gap-3 gap-7">
                    <div className="flex gap-2.5 items-center flex-grow truncate">
                      <Avatar
                        fullName={channel?.fullName}
                        url={channel?.avatar}
                        className="size-10 flex-shrink-0"
                        onClick={() => navigate(`/c/${channel?.username}`)}
                      />
                      <div className="flex flex-col flex-grow truncate">
                        <h3 className="md:text-base text-[15px] font-Noto_sans font-[600] text-[#0F0F0F] dark:text-[#F1F1F1] leading-[18px] w-full truncate">
                          {channel?.fullName}
                        </h3>
                        <p className="text-[13px] text-zinc-600 dark:text-[#AAAAAA] font-semibold leading-0 truncate">
                          {abbreviateNumber(channel?.subscriberCount || 0, 1)}{" "}
                          {channel?.subscriberCount || 0 <= 1
                            ? "Subscriber"
                            : "Subscribers"}
                        </p>
                      </div>
                    </div>
                    <SubscribeBtn
                      channelId={channel?._id}
                      isSubscribed={channel?.isSubscribed}
                      onSubscribeToggle={onSubscribeToggle}
                      className="md:text-[14px] md:py-1.5 md:px-3"
                    />
                  </div>
                )}

                {/* like, share, and save to playlist button */}
                {!isFetchingVideo && video && (
                  <div className="flex gap-2 max-sm:gap-3 pl-3 w-fit max-md:w-full whitespace-nowrap max-md:overflow-x-scroll max-md:no-scrollbar">
                    {/* like button */}
                    <LikeBtn
                      isLiked={Boolean(video?.isLiked)}
                      likeCount={video?.videoLikesCount || 0}
                      onToggleLike={handleToggleVideoLike}
                      isLoading={isVideoLikeLoading}
                    />
                    {/* share button */}
                    <Button
                      className="bg-slate-200 dark:bg-[#272727] text-black dark:text-white rounded-full hover:opacity-1 hover:bg-slate-300 dark:hover:bg-[#505050] py-2"
                      icon={<FaShare />}
                      onClick={() => setModalOpen("share_video_dialog")}
                    >
                      <span className="lg:hidden">Share</span>
                    </Button>
                    <ShareDialog
                      open={modalOpen === "share_video_dialog"}
                      handleClose={handleModalClose}
                      url={document.URL}
                    />
                    {/* save to playlist button */}
                    <Button
                      className="bg-slate-200 dark:bg-[#272727] text-black dark:text-white rounded-full hover:opacity-1 hover:bg-slate-300 dark:hover:bg-[#505050] py-2"
                      icon={<BiSolidPlaylist />}
                      onClick={() =>
                        setModalOpen("add_video_to_playlist_dialog")
                      }
                    >
                      Save to Playlist
                    </Button>
                    <AddVideoToPlaylistDialog
                      open={modalOpen === "add_video_to_playlist_dialog"}
                      handleClose={handleModalClose}
                      videoId={video?._id}
                    />
                    {/* save to watch later */}
                    <Button
                      className="bg-slate-200 dark:bg-[#272727] text-black dark:text-white rounded-full hover:opacity-1 hover:bg-slate-300 dark:hover:bg-[#505050] py-2"
                      icon={<BiSolidPlaylist />}
                      onClick={() =>
                        setModalOpen("add_video_to_watchlater_dialog")
                      }
                    >
                      Save to watch Later
                    </Button>
                    <AddVideoToWatchLaterDialog
                      open={modalOpen === "add_video_to_watchlater_dialog"}
                      handleClose={handleModalClose}
                      videoId={video?._id}
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
                  <TextWithToggle
                    initialShowLine={3}
                    className="text-sm font-roboto text-gray-800 dark:text-slate-200"
                  >
                    {video?.description || "No Description"}
                  </TextWithToggle>
                </div>
              )}
            </div>
          </div>

          {/* comments */}
          <div
            className={twMerge(
              "xl:w-[645px] w-full rounded-md px-1 dark:md:bg-[#0f0f0f]",
              !isFetchingVideo &&
                video && [
                  "md:shadow-[10px_25px_150px_#e3e3e3] md:dark:shadow-[50px_-15px_150px_#333333] md:px-4",
                ]
            )}
          >
            {isFetchingVideo || !video ? (
              <Skeleton className="w-full h-full max-lg:h-[450px] rounded-lg" />
            ) : (
              <CommentBox contentId={video._id} type="video" />
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
}
