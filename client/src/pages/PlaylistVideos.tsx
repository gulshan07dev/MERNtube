import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { abbreviateNumber } from "js-abbreviation-number";
import { twMerge } from "tailwind-merge";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

import Layout from "@/layout/Layout";
import { RootState } from "@/store/store";
import { deletePlaylist, getPlaylist } from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import Skeleton from "@/component/Skeleton";
import ErrorDialog from "@/component/error/ErrorDialog";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import DeletePlaylistDialogButton from "@/component/playlist/DeletePlaylistDialogButton";

export default function PlaylistVideos() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playlist } = useSelector((state: RootState) => state?.playlist);

  const { isLoading: isDeleting, handleAction: deletePlaylistAction } =
    useActionHandler({
      action: deletePlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting playlist..." },
    });

  const handleDeletePlaylist = async () => {
    const { error, isSuccess } = await deletePlaylistAction(playlistId);

    if (!error && isSuccess) {
      navigate(-1);
    }
  };

  const { isLoading, error, handleAction } = useActionHandler({
    action: getPlaylist,
    isShowToastMessage: false,
  });

  const fetchPlaylist = async () => {
    await handleAction(playlistId);
  };

  useEffect(() => {
    fetchPlaylist();
    console.log(playlist);
  }, [playlistId]);
  return (
    <Layout className="w-full flex max-lg:flex-col max-lg:gap-7 lg:h-full lg:overflow-y-scroll gap-3 py-5">
      {/* playlist details */}
      {isLoading ? (
        <Skeleton className="lg:w-[30%] w-full lg:h-full h-[500px] lg:sticky lg:top-0 rounded-lg" />
      ) : error ? (
        <ErrorDialog
          errorMessage={error}
          buttonLabel="Try again"
          buttonOnClick={fetchPlaylist}
        />
      ) : (
        <>
          <div
            className={twMerge(
              "lg:w-[30%] w-full lg:h-full flex lg:flex-col md:flex-row md:gap-5 lg:justify-start md:justify-center flex-col gap-y-4 p-5 lg:top-0 lg:sticky lg:overflow-y-scroll rounded-lg",
              !playlist?.playlistThumbnail
                ? "bg-none"
                : [
                    "bg-gradient-to-b from-violet-400 from-[30%] to-dark_bg to-[20%] via-violet-500 dark:via-[#161616] via-[100%]",
                  ]
            )}
          >
            {playlist?.playlistThumbnail && (
              <div className="lg:w-full md:w-[40%] w-full rounded-xl overflow-hidden">
                <img
                  src={playlist?.playlistThumbnail?.url}
                  alt="playlistThumbnail"
                  className="w-full max-md:w-[50%] max-sm:w-full mx-auto"
                />
              </div>
            )}
            <div
              className={twMerge(
                "lg:w-full md:w-[50%] w-full flex flex-col gap-4",
                " text-white dark:text-[#F1F1F1] font-roboto",
                !playlist?.playlistThumbnail && ["text-[#0F0F0F] md:px-4"]
              )}
            >
              <div className="flex">
                <h1 className="flex-grow text-[28px] font-semibold capitalize">
                  {playlist?.name}
                </h1>
                <button className="size-10 grid place-items-center rounded-full text-black dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-[#222222] dark:hover:bg-[#474747]">
                  <FaPencilAlt />
                </button>
              </div>
              <div className="flex">
                <div className="flex flex-grow flex-col gap-3">
                  <p className="text-base font-[600]">
                    {playlist?.owner?.fullName}
                  </p>
                  <p className="text-xs">
                    {playlist?.isPrivate ? "private" : "public"}
                  </p>
                  <p className="text-xs">
                    {playlist?.videosCount
                      ? `${abbreviateNumber(playlist?.videosCount)} ${
                          playlist?.videosCount > 1 ? "videos" : "video"
                        }`
                      : "No vdeos"}{" "}
                    {playlist?.totalViews
                      ? `${abbreviateNumber(playlist?.totalViews)} ${
                          playlist?.totalViews > 1 ? "views" : "view"
                        }`
                      : "No views"}
                  </p>
                </div>
                <DropdownMenu
                  button={
                    <button className="size-10 grid place-items-center rounded-full text-black dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-[#222222] dark:hover:bg-[#474747]">
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
                    onDelete={handleDeletePlaylist}
                  />
                </DropdownMenu>
              </div>
              <p className="text-sm -mt-1 font-nunito_sans">
                {playlist?.description
                  ? playlist?.description
                  : "No Description"}{" "}
              </p>
            </div>
          </div>

          {/* playlist videos */}
          <div className="lg:w-[70%] w-full h-screen bg-slate-300 dark:bg-gray-500 flex flex-col gap-2 px-1 pb-10">
            {/* TODO */}
            hey
          </div>
        </>
      )}
    </Layout>
  );
}
