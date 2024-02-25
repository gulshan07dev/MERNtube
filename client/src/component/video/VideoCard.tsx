import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { IoIosMore } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaShare } from "react-icons/fa";

import { Video } from "@/store/slices/videoSlice";
import Avatar from "../CoreUI/Avatar";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import ShareDialog from "../ShareDialog";
import AddVideoToPlaylistDialog from "../playlist/AddVideoToPlaylistDialog";

export default function VideoCard({ data }: { data: Video }) {
  return (
    <div className="group/item rounded-md w-[315px] max-lg:w-[415px] max-sm:w-full ">
      <div className="flex flex-col gap-2">
        <Link to={`/watch/${data?._id}`}>
          <img
            src={data.thumbnail.url}
            title={data.title}
            className="w-full lg:h-[180px] md:h-[215px] h-[200px] rounded-md"
          />
        </Link>
        <div className="flex gap-2">
          <div className="flex gap-2 flex-grow">
            <Avatar
              fullName={data?.owner?.fullName}
              url={data?.owner?.avatar?.url}
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
          {/* more option btn */}
          <DropdownMenu
            button={
              <button className="md:p-3 text-lg rotate-90 rounded-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-[#171717] focus-within:block hidden group-hover/item:block max-md:block">
                <IoIosMore />
              </button>
            }
          >
            <div className="min-w-[200px] flex flex-col gap-3 items-start">
              <Button
                label="Save to Watch Later"
                icon={<AiOutlineClockCircle />}
                className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
              />
              <AddVideoToPlaylistDialog
                videoId={data?._id}
                triggerButton={
                  <Button
                    label="Save to Playlist"
                    icon={<BiSolidPlaylist />}
                    className="bg-white dark:bg-[#333333] border-gray-500 dark:border-[#505050] text-sm text-black dark:text-white font-roboto hover:opacity-75 w-full py-2"
                  />
                }
              />
              <ShareDialog
                url={`${document.baseURI}watch/${data?._id}`}
                triggerButton={
                  <Button
                    label="Share"
                    icon={<FaShare />}
                    className="bg-white border-gray-500 dark:border-none text-sm text-black font-roboto hover:opacity-75 w-full py-2"
                  />
                }
              />
            </div>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
