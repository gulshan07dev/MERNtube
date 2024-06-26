import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaShare } from "react-icons/fa";

import { IVideo } from "@/interfaces";
import Avatar from "../CoreUI/Avatar";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import ShareDialog from "../ShareDialog";
import AddVideoToWatchLaterDialog from "../watchLater/AddVideoToWatchLaterDialog";
import AddVideoToPlaylistDialog from "../playlist/AddVideoToPlaylistDialog";

const VideoCard = ({ data }: { data: IVideo }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<
    | "add_video_to_watch_later_dialog"
    | "add_video_to_playlist_dialog"
    | "video_share_dialog"
    | null
  >(null);

  const handleCloseModal = () => {
    setModalOpen(null);
  };

  return (
    <div className="group/item rounded-md w-[315px] max-lg:w-[415px] max-sm:w-full">
      <div className="flex flex-col gap-2">
        <Link to={`/watch/${data?._id}`}>
          <img
            src={data.thumbnail}
            title={data.title}
            className="w-full lg:h-[180px] md:h-[215px] h-[200px] rounded-md"
          />
        </Link>
        <div className="flex gap-2">
          <div className="flex gap-2 flex-grow">
            <Avatar
              fullName={data?.owner?.fullName}
              url={data?.owner?.avatar}
              onClick={() => navigate(`/c/${data?.owner?.username}`)}
              className="h-8 w-8"
            />
            <div className="flex flex-col gap-[1px]">
              <h1 className="text-[16px] font-roboto font-medium text-[#0f0f0f] dark:text-[#f1f1f1] line-clamp-2">
                {data?.title}
              </h1>
              <p className="text-sm text-[#606060] dark:text-[#AAAAAA] font-roboto font-normal leading-tight">
                {data?.owner?.fullName}
              </p>
              <p className="text-sm text-[#606060] dark:text-[#AAAAAA] font-roboto font-normal leading-none">
                {abbreviateNumber(data?.views, 1)} views{" · "}
                <TimeAgo date={data?.createdAt} />
              </p>
            </div>
          </div>
          <DropdownMenu
            triggerButton={
              <Button
                btnType="icon-btn"
                title="video-menu-options"
                className="hidden group-hover/item:block max-md:block"
              >
                <FiMoreVertical size={15} />
              </Button>
            }
          >
            <div className="min-w-[200px] flex flex-col gap-3 items-start">
              <Button
                icon={<AiOutlineClockCircle />}
                className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
                onClick={() => setModalOpen("add_video_to_watch_later_dialog")}
              >
                Save to Watch Later
              </Button>

              <Button
                icon={<BiSolidPlaylist />}
                className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
                onClick={() => setModalOpen("add_video_to_playlist_dialog")}
              >
                Save to Playlist
              </Button>

              <Button
                icon={<FaShare />}
                className="bg-white border-gray-500 dark:border-none text-sm text-black font-roboto hover:opacity-75 w-full py-2"
                onClick={() => setModalOpen("video_share_dialog")}
              >
                Share
              </Button>
            </div>
          </DropdownMenu>
          <AddVideoToWatchLaterDialog
            open={modalOpen === "add_video_to_watch_later_dialog"}
            handleClose={handleCloseModal}
            videoId={data?._id}
          />
          <AddVideoToPlaylistDialog
            open={modalOpen === "add_video_to_playlist_dialog"}
            handleClose={handleCloseModal}
            videoId={data?._id}
          />
          <ShareDialog
            open={modalOpen === "video_share_dialog"}
            handleClose={handleCloseModal}
            url={`${document.baseURI}watch/${data?._id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
