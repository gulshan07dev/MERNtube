import { useState } from "react";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { FaShare } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";

import { Video } from "@/store/slices/videoSlice";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import ShareDialog from "@/component/ShareDialog";
import AddVideoToWatchLaterDialog from "../watchLater/AddVideoToWatchLaterDialog";
import AddVideoToPlaylistDialog from "../playlist/AddVideoToPlaylistDialog";

const LikedVideoCard = ({ video }: { video: Video }) => {
  const [
    isShowAddVideoToWatchLaterDialog,
    setIsShowAddVideoToWatchLaterDialog,
  ] = useState(false);
  const [isShowAddVideoToPlaylistDialog, setIsShowAddVideoToPlaylistDialog] =
    useState(false);
  const [isShowShareDialog, setIsShowShareDialog] = useState(false);

  return (
    <div className="group/item w-full flex md:gap-3 gap-2.5 p-3 max-md:pr-0 max-md:pl-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#202020]">
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
      <ShareDialog
        url={`${document.baseURI}watch/${video?._id}`}
        open={isShowShareDialog}
        handleClose={() => setIsShowShareDialog(false)}
      />
    </div>
  );
};

export default LikedVideoCard;
