import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io";
import { MdDelete, MdLock } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";

import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { IPlaylist } from "@/interfaces";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import DeletePlaylistDialogButton from "./DeletePlaylistDialogButton";
import UpdatePlaylistDialog from "./UpdatePlaylistDialog";

export default function PlaylistCard({ playlist }: { playlist: IPlaylist }) {
  const [playlistDetails, setPlaylistDetails] = useState<IPlaylist>(playlist);
  const [modalOpen, setModalOpen] = useState<
    "delete_playlist_dialog" | "update_playlist_dialog" | null
  >(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const { isLoading: isPlaylistDeleting, handler: deletePlaylist } = useService(
    playlistService.deletePlaylist,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting playlist..." },
    }
  );

  const handleDeletePlaylist = async (playlistId: string) => {
    setIsDeleted(false);
    const { error, success } = await deletePlaylist(playlistId);

    if (!error && success) {
      setModalOpen(null);
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }
  return (
    <div className="group/item w-[210px] flex flex-col gap-1 max-md:w-full max-md:flex-row max-md:gap-4">
      <Link
        to={`/playlists/${playlistDetails?._id}`}
        className="relative h-[115px] w-full max-md:w-[45%] max-sm:min-h-[60px] max-sm:max-h-[90px] rounded-md max-md:rounded-lg overflow-hidden"
      >
        {playlist?.playlistThumbnail ? (
          <img
            src={playlist?.playlistThumbnail}
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
          {playlist?.videosCount || 0}{" "}
          {playlist?.videosCount && playlist?.videosCount > 1
            ? "videos"
            : "video"}
        </span>
      </Link>
      <div className="flex flex-grow max-md:w-[50%]">
        <div className="flex-grow flex-col gap-1">
          <h1 className="text-[16px] line-clamp-2 font-roboto font-[500] text-gray-800 dark:text-[#f1f1f1]">
            {playlistDetails?.name}
          </h1>
          <p className="text-sm max-sm:text-xs text-zinc-700 dark:text-slate-300 md:leading-6 leading-8 font-roboto">
            {playlistDetails?.isPrivate ? (
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
          triggerButton={
            <button className="p-3 text-lg rotate-90 rounded-full text-black dark:text-white hover:bg-slate-100 focus-within:bg-slate-100 dark:hover:bg-[#171717] focus-within:dark:bg-[#171717] focus-within:block hidden group-hover/item:block max-md:block">
              <IoIosMore />
            </button>
          }
        >
          <Button
            className="w-full py-1.5 px-7 bg-blue-500 border-none"
            onClick={() => setModalOpen("update_playlist_dialog")}
          >
            Edit
          </Button>
          <Button
            icon={<MdDelete />}
            className="w-full py-1.5 px-7 bg-red-600 border-none"
            onClick={() => setModalOpen("delete_playlist_dialog")}
            disabled={isPlaylistDeleting}
          >
            {isPlaylistDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DropdownMenu>
        <DeletePlaylistDialogButton
          open={modalOpen === "delete_playlist_dialog"}
          handleClose={() => setModalOpen(null)}
          isDeleting={isPlaylistDeleting}
          onDelete={() => handleDeletePlaylist(playlistDetails?._id)}
        />
        <UpdatePlaylistDialog
          open={modalOpen === "update_playlist_dialog"}
          handleClose={() => setModalOpen(null)}
          playlistId={playlistDetails?._id}
          playlistDetails={{
            name: playlistDetails?.name,
            description: playlistDetails?.description,
            isPrivate: playlistDetails?.isPrivate,
          }}
          onUpdate={(updatedPlaylist: IPlaylist) =>
            setPlaylistDetails(updatedPlaylist)
          }
        />
      </div>
    </div>
  );
}
