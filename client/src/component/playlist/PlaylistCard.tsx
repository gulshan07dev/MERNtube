import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io";
import { MdLock } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";

import { Playlist, deletePlaylist } from "@/store/slices/playlistSlice";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import DeletePlaylistDialogButton from "./DeletePlaylistDialogButton";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const [isDeleted, setIsDeleted] = useState(false);

  const { isLoading: isDeleting, handleAction: deletePlaylistAction } =
    useActionHandler({
      action: deletePlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting playlist..." },
    });

  const handleDeletePlaylist = async (playlistId: string) => {
    setIsDeleted(false);
    const { error, isSuccess } = await deletePlaylistAction(playlistId);

    if (!error && isSuccess) {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return (
      <p className="p-2 max-md:bg-slate-50 max-md:dark:bg-[#252525] max-md:w-full text-black dark:text-white">
        This playlist has been deleted.
      </p>
    );
  }

  return (
    <div className="group/item w-[210px] flex flex-col gap-1 max-md:w-full max-md:flex-row max-md:gap-4">
      <Link
        to={`/playlists/${playlist?._id}`}
        className="relative h-[115px] w-full max-md:w-[45%] max-sm:min-h-[70px] max-sm:max-h-[10px] rounded-md max-md:rounded-lg overflow-hidden"
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
      <div className="flex flex-grow max-md:w-[50%]">
        <div className="flex-grow flex-col gap-1">
          <h1 className="text-[16px] line-clamp-2 font-roboto font-[500] text-gray-800 dark:text-[#f1f1f1]">
            {playlist?.name}
          </h1>
          <p className="text-sm max-sm:text-xs text-zinc-700 dark:text-slate-300 md:leading-6 leading-8 font-roboto">
            {playlist?.isPrivate ? (
              <span className="flex items-center gap-x-1 px-1.5 py-0 max-sm:py-1 rounded-sm bg-slate-200 dark:bg-[#282828] w-fit">
                private <MdLock />
              </span>
            ) : (
              <span className="flex items-center gap-x-1 px-1.5 py-0 max-sm:py-1 rounded-sm bg-slate-200 dark:bg-[#282828] w-fit">
                public <FaGlobe />
              </span>
            )}
          </p>
        </div>
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
          <DeletePlaylistDialogButton
            isDeleting={isDeleting}
            onDelete={() => handleDeletePlaylist(playlist?._id)}
          />
        </DropdownMenu>
      </div>
    </div>
  );
}
