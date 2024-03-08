import { useState } from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaShare } from "react-icons/fa";

import { Video } from "@/store/slices/videoSlice";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import ShareDialog from "@/component/ShareDialog";
import useActionHandler from "@/hooks/useActionHandler";
import { removeVideoFromPlaylist } from "@/store/slices/playlistSlice";
import Modal from "@/component/CoreUI/Modal";

const playlistVideoCard = ({
  video,
  playlistId,
  idx,
}: {
  video: Video;
  playlistId: string;
  idx: number;
}) => {
  const [isVideoRemovedFromPlaylist, setIsVideoRemovedFromPlaylist] =
    useState(false);
  const [isShowVideoRemoveConfirmDialog, setIsShowVideoRemoveConfirmDialog] =
    useState(false);
  const [isShowShareDialog, setIsShowShareDialog] = useState(false);

  const { isLoading: isRemovingVideo, handleAction: removeVideo } =
    useActionHandler({
      action: removeVideoFromPlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Removing video from playlist..." },
    });

  const handleRemoveVideoFromPlaylist = async () => {
    const { isSuccess, error } = await removeVideo({
      playlistId,
      videoId: video?._id,
    });

    if (isSuccess && !error) {
      setIsVideoRemovedFromPlaylist(true);
    }
  };

  if (isVideoRemovedFromPlaylist) {
    return (
      <p className="p-2 bg-slate-50 dark:bg-[#252525] text-black dark:text-white">
        This video has been removed from this playlist.
      </p>
    );
  }

  return (
    <div className="w-full flex md:gap-3 gap-2.5 p-3 max-md:pr-0 max-md:pl-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#202020]">
      <span className="self-center text-zinc-700 dark:text-slate-50 text-sm">
        {idx + 1}
      </span>
      <Link className="flex flex-grow gap-3" to={`/watch/${video?._id}`}>
        <img
          src={video?.thumbnail?.url}
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
          <Button btnType="icon-btn" className="text-lg">
            <FiMoreVertical />
          </Button>
        }
      >
        <div className="min-w-[200px] flex flex-col gap-3 items-start">
          <Button
            icon={<AiOutlineClockCircle />}
            className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
          >
            Save to Watch Later
          </Button>

          <Button
            icon={<MdDelete />}
            className="bg-red-500 text-sm text-white font-roboto hover:opacity-75 w-full py-2"
            onClick={() => setIsShowVideoRemoveConfirmDialog((prev) => !prev)}
          >
            Remove from Playlist
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
      <Modal
        open={isShowVideoRemoveConfirmDialog}
        handleClose={() => setIsShowVideoRemoveConfirmDialog(false)}
        title="Remove Video From Playlist"
        description="Are you sure you want to remove video from the playlist?"
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
        onSubmit={handleRemoveVideoFromPlaylist}
      />
      <ShareDialog
        url={`${document.baseURI}watch/${video?._id}`}
        open={isShowShareDialog}
        handleClose={() => setIsShowShareDialog(false)}
      />
    </div>
  );
};

export default playlistVideoCard;
