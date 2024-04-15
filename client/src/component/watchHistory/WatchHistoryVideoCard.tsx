import { useState } from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";

import { Video } from "@/store/slices/videoSlice";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import ShareDialog from "@/component/ShareDialog";
import useActionHandler from "@/hooks/useActionHandler";
import AddVideoToWatchLaterDialog from "../watchLater/AddVideoToWatchLaterDialog";
import AddVideoToPlaylistDialog from "../playlist/AddVideoToPlaylistDialog";
import Modal from "@/component/CoreUI/Modal";
import { removeVideoToWatchHistory } from "@/store/slices/watchHistorySlice";

const WatchHistoryVideoCard = ({
  video,
  historyId,
}: {
  video: Video;
  historyId: string;
}) => {
   const [
     isShowAddVideoToWatchLaterDialog,
     setIsShowAddVideoToWatchLaterDialog
   ] = useState(false);
  const [isShowAddVideoToPlaylistDialog, setIsShowAddVideoToPlaylistDialog] =
    useState(false);
  const [isVideoRemovedFromHistory, setIsVideoRemovedFromHistory] =
    useState(false);
  const [isShowVideoRemoveConfirmDialog, setIsShowVideoRemoveConfirmDialog] =
    useState(false);
  const [isShowShareDialog, setIsShowShareDialog] = useState(false);

  const { isLoading: isRemovingVideo, handleAction: removeVideo } =
    useActionHandler({
      action: removeVideoToWatchHistory,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Removing video from watch history..." },
    });

  const handleRemoveVideoFromWatchHistory = async () => {
    const { isSuccess, error } = await removeVideo(historyId);

    if (isSuccess && !error) {
      setIsVideoRemovedFromHistory(true);
    }
  };

  if (isVideoRemovedFromHistory) {
    return (
      <p className="p-2 bg-slate-50 dark:bg-[#252525] text-black dark:text-white">
        This video has been removed from the watch history.
      </p>
    );
  }

  return (
    <div className="group/item w-full flex md:gap-3 gap-2.5 p-3 max-md:pr-0 max-md:pl-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#202020]">
      <Link className="flex flex-grow gap-3" to={`/watch/${video?._id}`}>
        <img
          src={video?.thumbnail}
          alt="thumbnail"
          className="md:w-[160px] md:h-[90px] w-[150px] h-[80px] rounded-lg"
        />
        <div className="flex flex-col gap-1 flex-grow h-full">
          <h1 className="text-base max-sm:text-sm max-sm:leading-tight text-black line-clamp-2 dark:text-white font-roboto">
            {video?.title}
          </h1>
          <div className="text-sm max-md:text-xs text-[#606060] dark:text-[#AAAAAA] font-roboto">
            <p className="line-clamp-1">{video?.owner?.fullName}</p>
            <p className="line-clamp-1">
              {`${abbreviateNumber(video?.views, 1)} views · `}
              <TimeAgo date={video?.createdAt} />
            </p>
          </div>
        </div>
      </Link>
      <DropdownMenu
        triggerButton={
          <Button
            btnType="icon-btn"
            className="text-lg hidden group-hover/item:block md:focus-within:block max-md:block"
          >
            <FiMoreVertical />
          </Button>
        }
      >
        <div className="min-w-[200px] flex flex-col gap-3 items-start">
          <Button
            icon={<AiOutlineClockCircle />}
            className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
            onClick={() => setIsShowAddVideoToWatchLaterDialog((prev) => !prev)}
          >
            Save to Watch Later
          </Button>

          <Button
            icon={<BiSolidPlaylist />}
            className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
            onClick={() => setIsShowAddVideoToPlaylistDialog((prev) => !prev)}
          >
            Save to Playlist
          </Button>

          <Button
            icon={<MdDelete />}
            className="bg-red-500 text-sm text-white font-roboto hover:opacity-75 w-full py-2"
            onClick={() => setIsShowVideoRemoveConfirmDialog((prev) => !prev)}
          >
            Remove from History
          </Button>

          <Button
            icon={<FaShare />}
            className="bg-white border-gray-500 dark:border-none text-sm text-black font-roboto hover:opacity-75 w-full py-2"
            onClick={() => setIsShowShareDialog((prev) => !prev)}
          >
            Share
          </Button>
        </div>
      </DropdownMenu>
      <AddVideoToWatchLaterDialog
        open={isShowAddVideoToWatchLaterDialog}
        handleClose={() => setIsShowAddVideoToWatchLaterDialog(false)}
        videoId={video?._id}
      />
      <AddVideoToPlaylistDialog
        videoId={video?._id}
        open={isShowAddVideoToPlaylistDialog}
        handleClose={() => setIsShowAddVideoToPlaylistDialog(false)}
      />
      <Modal
        open={isShowVideoRemoveConfirmDialog}
        handleClose={() => setIsShowVideoRemoveConfirmDialog(false)}
        title="Remove Video From Watch History"
        description="Are you sure you want to remove video from the watch history?"
        isLoading={isRemovingVideo}
        closeButton={
          <Button
            className="w-full py-1.5 px-7 bg-red-600 border-none"
            disabled={isRemovingVideo}
          >
            Cancel
          </Button>
        }
        submitLabel={isRemovingVideo ? "Removing" : "Remove"}
        onSubmit={handleRemoveVideoFromWatchHistory}
      />
      <ShareDialog
        url={`${document.baseURI}watch/${video?._id}`}
        open={isShowShareDialog}
        handleClose={() => setIsShowShareDialog(false)}
      />
    </div>
  );
};

export default WatchHistoryVideoCard;
