import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Avatar from "../CoreUI/Avatar";

const SearchVideoCard = ({ video }: { video: Video }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<
    null | "add_video_to_watch_later" | "add_video_to_playlist" | "share_video"
  >(null);

  const handleModalClose = () => {
    setModalOpen(null);
  };

  return (
    <div
      onClick={() => navigate(`/watch/${video?._id}`)}
      className="group/item cursor-pointer w-full flex md:gap-3 gap-2.5 p-3 max-md:pr-0 max-md:pl-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#202020]"
    >
      <div className="flex flex-grow gap-3">
        <img
          src={video?.thumbnail}
          alt="thumbnail"
          className="md:w-[360px] md:h-[190px] w-[150px] h-[80px] rounded-lg"
        />
        <div className="flex flex-col flex-grow h-full">
          <h1 className="text-2xl max-sm:text-sm max-sm:leading-tight text-black line-clamp-2 dark:text-white font-roboto">
            {video?.title}
          </h1>
          <div className="text-sm max-md:text-xs text-[#606060] dark:text-[#AAAAAA] font-roboto">
            <p className="line-clamp-1">
              {`${abbreviateNumber(video?.views, 1)} views · `}
              <TimeAgo date={video?.createdAt} />
            </p>
            <Link
              to={`/c/${video?.owner?.username}/videos`}
              onClick={(e) => e.stopPropagation()}
              title={video?.owner?.username}
              className="group flex gap-2 items-center md:py-3 pt-1 w-fit"
            >
              <Avatar
                fullName={video?.owner?.fullName}
                url={video?.owner?.avatar}
                className="md:h-8 md:w-8 h-7 w-7 flex-shrink-0"
              />
              <p className="line-clamp-1 group-hover:text-black dark:group-hover:text-white">
                {video?.owner?.fullName}
              </p>
            </Link>
          </div>
        </div>
      </div>
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
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen("add_video_to_watch_later");
            }}
          >
            Save to Watch Later
          </Button>

          <Button
            icon={<BiSolidPlaylist />}
            className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen("add_video_to_playlist");
            }}
          >
            Save to Playlist
          </Button>

          <Button
            icon={<FaShare />}
            className="bg-white border-gray-500 dark:border-none text-sm text-black font-roboto hover:opacity-75 w-full py-2"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen("share_video");
            }}
          >
            Share
          </Button>
        </div>
      </DropdownMenu>
      <AddVideoToWatchLaterDialog
        open={modalOpen === "add_video_to_watch_later"}
        handleClose={handleModalClose}
        videoId={video?._id}
      />
      <AddVideoToPlaylistDialog
        videoId={video?._id}
        open={modalOpen === "add_video_to_playlist"}
        handleClose={handleModalClose}
      />
      <ShareDialog
        url={`${document.baseURI}watch/${video?._id}`}
        open={modalOpen === "share_video"}
        handleClose={handleModalClose}
      />
    </div>
  );
};

export default SearchVideoCard;
