import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { abbreviateNumber } from "js-abbreviation-number";
import { FaEdit, FaRegEdit } from "react-icons/fa";

import { RootState } from "@/store/store";
import useService from "@/hooks/useService";
import authService from "@/services/authService";
import { setChannel } from "@/store/slices/authSlice";
import { IChannel } from "@/interfaces";
import Skeleton from "@/component/Skeleton";
import Button from "@/component/CoreUI/Button";
import Avatar from "@/component/CoreUI/Avatar";
import UpdateAvatarDialog from "@/component/channel/UpdateAvatarDialog";
import UpdateCoverImageDialog from "@/component/channel/UpdateCoverImageDialog";
import SubscribeBtn from "@/component/subscription/SubscribeBtn";
import ErrorDialog from "@/component/error/ErrorDialog";

const ChannelLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const location = useLocation();
  let { channel, user } = useSelector((state: RootState) => state?.auth);
  const [modalOpen, setModalOpen] = useState<
    "update_avatar_dialog" | "update_cover_image_dialog" | null
  >(null);

  const {
    error,
    isLoading,
    handler: getChannel,
  } = useService(authService.getChannel);

  async function fetchChannel() {
    if (username) {
      const { success, responseData } = await getChannel({ username });
      if (success) {
        dispatch(setChannel(responseData?.data?.channel));
      }
    }
  }

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

  useEffect(() => {
    if (channel?.username !== username) {
      fetchChannel();
    }
  }, [username]);

  const channelTabsLink = [
    {
      label: "Home",
      slug: `/c/${username}`,
    },
    {
      label: "Videos",
      slug: `/c/${username}/videos`,
    },
    {
      label: "Tweets",
      slug: `/c/${username}/tweets`,
    },
    {
      label: "Playlists",
      slug: `/c/${username}/playlists`,
    },
    {
      label: "Subscribers",
      slug: `/c/${username}/subscribers`,
    },
  ];

  const ChannelLayoutSkeleton = () => (
    <div className="w-full flex flex-col gap-8">
      <Skeleton className="w-full md:h-44 h-28 rounded-2xl" />
      <div className="w-full flex md:gap-14 gap-5">
        <Skeleton className="md:h-36 h-20 md:w-36 w-20 rounded-full" />
        <div className="flex flex-col md:gap-4 gap-2">
          <Skeleton className="max-w-[200px] w-64 h-6" />
          <Skeleton className="max-w-[150px] w-44 h-4" />
          <Skeleton className="max-w-[150px] w-44 h-4" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="w-full flex flex-col flex-grow gap-6">
      {error ? (
        // Display error message if there's an error
        <ErrorDialog
          errorMessage={error?.message}
          buttonLabel="Try again"
          buttonOnClick={fetchChannel}
        />
      ) : (
        // Render channel details if no error
        <section className="w-full relative flex flex-col gap-8">
          {isLoading ? (
            // Use ChannelLayoutSkeleton component while loading
            <ChannelLayoutSkeleton />
          ) : (
            <>
              {/* Channel cover image */}
              <div className="relative group w-full md:h-44 h-28 rounded-2xl overflow-hidden">
                <img
                  src={
                    (channel?._id === user?._id
                      ? user?.coverImage
                      : channel?.coverImage) || "/default-cover.webp"
                  }
                  className="w-full h-full object-cover"
                  alt="coverImage"
                />
                {/* update cover image - btn */}
                {user?._id === channel?._id && (
                  <>
                    <Button
                      btnType="icon-btn"
                      onClick={() => setModalOpen("update_cover_image_dialog")}
                      className="absolute right-2 top-2 md:text-4xl text-3xl bg-slate-200 dark:bg-slate-800"
                    >
                      <FaEdit />
                    </Button>
                    <UpdateCoverImageDialog
                      open={modalOpen === "update_cover_image_dialog"}
                      handleClose={() => setModalOpen(null)}
                    />
                  </>
                )}
              </div>

              {/* Display channel details once loaded */}
              <div className="flex md:gap-14 gap-5">
                <div className="relative group">
                  <Avatar
                    url={
                      channel?._id === user?._id
                        ? user?.avatar
                        : channel?.avatar
                    }
                    fullName={channel?.fullName}
                    className="md:h-36 h-20 md:w-36 w-20 md:text-[100px] text-[45px]"
                  />
                  {/* update avatar - btn */}
                  {user?._id === channel?._id && (
                    <>
                      <Button
                        btnType="icon-btn"
                        onClick={() => setModalOpen("update_avatar_dialog")}
                        className="hidden group-hover:flex absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] h-full w-full md:text-8xl text-3xl group-hover:bg-[#ffffff50] dark:group-hover:bg-[#040d1250]"
                      >
                        <FaRegEdit />
                      </Button>
                      <UpdateAvatarDialog
                        open={modalOpen === "update_avatar_dialog"}
                        handleClose={() => setModalOpen(null)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {/* Channel name */}
                  <h1
                    className="md:text-4xl text-xl text-black dark:text-white font-bold"
                    title={channel?.fullName}
                  >
                    {channel?.fullName}
                  </h1>

                  {/* Username and subscriber/video count */}
                  <p className="md:text-lg text-sm text-zinc-600 dark:text-[#AAAAAA] font-semibold">
                    {channel?.username}
                  </p>
                  <p className="md:text-lg text-sm mb-3 text-zinc-600 dark:text-[#AAAAAA] font-semibold">
                    {abbreviateNumber(channel?.subscriberCount || 0, 1)}{" "}
                    {channel?.subscriberCount || 0 <= 1
                      ? "Subscriber"
                      : "Subscribers"}{" "}
                    {" • "}
                    {channel?.videoCount}{" "}
                    {channel?.videoCount || 0 <= 1 ? "video" : "videos"}
                  </p>
                  {/* subscribe button */}
                  <SubscribeBtn
                    channelId={channel?._id || ""}
                    isSubscribed={channel?.isSubscribed || false}
                    onSubscribeToggle={onSubscribeToggle}
                  />
                </div>
              </div>
            </>
          )}

          {/* Channel tabs */}
          <div className="w-full flex overflow-x-scroll overflow-y-visible no-scrollbar md:gap-10 gap-7 relative ">
            {channelTabsLink.map(({ label, slug }) => (
              // Render channel tabs
              <button
                key={slug}
                className={twMerge(
                  "pb-2 text-base text-zinc-500 dark:text-[#AAAAAA] font-semibold font-poppins transition-all",
                  "disabled:opacity-70 disabled:animate-pulse",
                  location.pathname === slug &&
                    "text-black dark:text-white relative after:content-[''] after:absolute after:z-[2] after:-bottom-0 after:-left-[7.5px] after:w-[calc(100%+15px)] after:h-[2px] after:bg-black dark:after:bg-white"
                )}
                disabled={isLoading}
              >
                <Link
                  to={slug}
                  preventScrollReset
                  className={isLoading ? "pointer-events-none" : ""}
                >
                  {label}
                </Link>
              </button>
            ))}
          </div>
          <hr className="absolute bottom-0 w-full border-0 rounded-md h-[1px]  bg-gray-300 dark:bg-gray-600" />
        </section>
      )}
      {!error && <Outlet />}
    </main>
  );
};

export default ChannelLayout;
