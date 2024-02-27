import { Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io";

import { Playlist } from "@/store/slices/playlistSlice";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="group/item w-[210px] flex flex-col gap-1">
      <Link
        to={`/playlists/${playlist?._id}`}
        className="relative h-[115px] w-full rounded-md overflow-hidden"
      >
        {playlist?.playlistThumbnail ? (
          <img
            src={playlist?.playlistThumbnail?.url}
            alt="playlist-thumbnail"
            className="size-full"
          />
        ) : (
          <div className="size-full bg-slate-300 dark:bg-[#404040] flex justify-center items-center">
            <p className="text-black dark:text-slate-100 text-lg font-nunito_sans font-semibold">
              empty playlist
            </p>
          </div>
        )}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-sm bg-gray-600 dark:bg-[#202020] text-white text-xs">
          {playlist?.videosCount}{" "}
          {playlist?.videosCount || 0 > 1 ? "videos" : "video"}
        </span>
      </Link>
      <div className="flex justify-between">
        <h1 className="flex-grow text-[16px] line-clamp-2 font-roboto font-[500] text-gray-800 dark:text-[#f1f1f1]">
          {playlist?.name}
        </h1>
        <DropdownMenu
          button={
            <button className="p-3 text-lg rotate-90 rounded-full text-black dark:text-white hover:bg-slate-100 focus-within:bg-slate-100 dark:hover:bg-[#171717] focus-within:dark:bg-[#171717] focus-within:block hidden group-hover/item:block max-md:block">
              <IoIosMore />
            </button>
          }
        >
          <Button
            label="Edit"
            className="w-full py-1.5 px-7 bg-blue-500 border-none"
          />
          <Button
            label="Delete"
            className="w-full py-1.5 px-7 bg-red-600 border-none"
          />
        </DropdownMenu>
      </div>
    </div>
  );
}
