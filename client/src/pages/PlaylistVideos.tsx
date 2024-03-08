import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";

import Layout from "@/layout/Layout";
import { RootState } from "@/store/store";
import {
  deletePlaylist,
  getPlaylist,
  getUserPlaylistVideos,
} from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import Skeleton from "@/component/Skeleton";
import ErrorDialog from "@/component/error/ErrorDialog";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import DeletePlaylistDialogButton from "@/component/playlist/DeletePlaylistDialogButton";
import UpdatePlaylistDialog from "@/component/playlist/UpdatePlaylistDialog";
import ScrollPagination from "@/component/ScrollPagination";
import { Video } from "@/store/slices/videoSlice";

export default function PlaylistVideos() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playlist } = useSelector((state: RootState) => state?.playlist);

  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [isShowUpdateDialog, setIsShowUpdateDialog] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState<
    { playlistVideo: Video }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { isLoading: isDeleting, handleAction: deletePlaylistAction } =
    useActionHandler({
      action: deletePlaylist,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Deleting playlist..." },
    });

  const handleDeletePlaylist = async () => {
    const { error, isSuccess } = await deletePlaylistAction(playlistId);
    if (!error && isSuccess) {
      setIsShowDeleteDialog(false);
      navigate(-1);
    }
  };

  const {
    isLoading: isFetchingPlaylist,
    error: playlistFetchingError,
    handleAction: fetchPlaylist,
  } = useActionHandler({
    action: getPlaylist,
    isShowToastMessage: false,
  });

  const {
    isLoading: isFetchingVideos,
    error: videosFetchingError,
    handleAction: fetchPlaylistVideos,
  } = useActionHandler({
    action: getUserPlaylistVideos,
    isShowToastMessage: false,
  });

  const handleFetchPlaylistVideos = async (page: number) => {
    if (!playlist?._id || !playlistId) return;

    const { isSuccess, resData } = await fetchPlaylistVideos({
      playlistId,
      queryParams: { page, limit, sortBy: "createdAt", sortType: "acc" },
    });

    if (isSuccess && resData?.result) {
      const newPlaylistVideos = resData.result.docs;
      setPlaylistVideos(
        page === 1
          ? [...newPlaylistVideos]
          : [...playlistVideos, ...newPlaylistVideos]
      );
      setCurrentPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalVideos(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
    }
  };

  useEffect(() => {
    fetchPlaylist(playlistId);
  }, [playlistId]);

  useEffect(() => {
    handleFetchPlaylistVideos(1);
  }, [playlistId, playlist?._id]);

  return (
    <Layout className="w-full flex max-lg:flex-col max-lg:gap-7 min-h-full gap-3 py-5">
      {playlistFetchingError ? (
        <ErrorDialog
          errorMessage={playlistFetchingError}
          buttonLabel="Try again"
          buttonOnClick={() => fetchPlaylist(playlistId)}
        />
      ) : (
        <>
          {/* Playlist Details */}
          {isFetchingPlaylist ? (
            <Skeleton className="lg:w-[30%] w-full lg:h-[85vh] h-[500px] lg:sticky lg:top-0 rounded-lg" />
          ) : (
            <div
              className={twMerge(
                "lg:w-[30%] w-full lg:h-[85vh] flex lg:flex-col md:flex-row md:gap-5 lg:justify-start md:justify-center flex-col gap-y-4 p-5 lg:top-5 lg:sticky lg:overflow-y-scroll rounded-lg",
                !playlist?.playlistThumbnail
                  ? "bg-none"
                  : [
                      "bg-gradient-to-b from-violet-400 from-[30%] to-dark_bg to-[20%] via-violet-500 dark:via-[#161616] via-[100%]",
                    ]
              )}
            >
              {/* Thumbnail */}
              {playlist?.playlistThumbnail && (
                <div className="lg:w-full md:w-[40%] w-full rounded-xl overflow-hidden">
                  <img
                    src={playlist?.playlistThumbnail?.url}
                    alt="playlistThumbnail"
                    className="w-full max-md:w-[50%] max-sm:w-full mx-auto"
                  />
                </div>
              )}
              {/* Playlist Info */}
              <div
                className={twMerge(
                  "lg:w-full md:w-[50%] w-full flex flex-col gap-4",
                  " text-white dark:text-[#F1F1F1] font-roboto",
                  !playlist?.playlistThumbnail && ["text-[#0F0F0F] md:px-4"]
                )}
              >
                {/* Playlist Name */}
                <div className="w-full flex gap-2 justify-between">
                  <h1 className="md:text-[28px] text-2xl leading-10 font-semibold capitalize  ">
                    {playlist?.name}
                  </h1>
                  <button className="size-10 grid place-items-center rounded-full text-sm text-white bg-black">
                    <FaPencilAlt />
                  </button>
                </div>
                {/* Playlist Metadata */}
                <div className="flex">
                  <div className="flex flex-grow flex-col gap-3">
                    <p className="text-base font-[600]">
                      {playlist?.owner?.fullName}
                    </p>
                    <p className="text-xs">
                      {playlist?.isPrivate ? "Private" : "Public"}
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
                  {/* Dropdown Menu */}
                  <DropdownMenu
                    triggerButton={
                      <button className="size-10 grid place-items-center rounded-full text-black dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-[#222222] dark:hover:bg-[#474747]">
                        <IoIosMore />
                      </button>
                    }
                  >
                    {/* Edit Button */}
                    <Button
                      className="w-full py-1.5 px-7 bg-blue-500 border-none"
                      onClick={() => setIsShowUpdateDialog((prev) => !prev)}
                    >
                      Edit
                    </Button>
                    {/* Delete Button */}
                    <Button
                      icon={<MdDelete />}
                      className="w-full py-1.5 px-7 bg-red-600 border-none"
                      onClick={() => setIsShowDeleteDialog((prev) => !prev)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DropdownMenu>
                  {/* Delete Playlist Dialog */}
                  <DeletePlaylistDialogButton
                    open={isShowDeleteDialog}
                    handleClose={() => setIsShowDeleteDialog(false)}
                    isDeleting={isDeleting}
                    onDelete={handleDeletePlaylist}
                  />
                  {/* Update Playlist Dialog */}
                  <UpdatePlaylistDialog
                    open={isShowUpdateDialog}
                    handleClose={() => setIsShowUpdateDialog(false)}
                    playlistId={playlist?._id || ""}
                    playlistDetails={{
                      name: playlist?.name || "",
                      description: playlist?.description || "",
                      isPrivate: playlist?.isPrivate || false,
                    }}
                    onUpdate={() => fetchPlaylist(playlistId)}
                  />
                </div>
                {/* Description */}
                <p className="text-sm -mt-1 font-nunito_sans">
                  {playlist?.description || "No Description"}
                </p>
              </div>
            </div>
          )}

          {/* Playlist Videos */}
          <ScrollPagination
            paginationType="infinite-scroll"
            loadNextPage={() => handleFetchPlaylistVideos(currentPage + 1)}
            refreshHandler={() => handleFetchPlaylistVideos(1)}
            dataLength={playlistVideos.length}
            loading={isFetchingVideos || isFetchingPlaylist}
            error={videosFetchingError}
            currentPage={currentPage}
            totalItems={totalVideos}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            endMessage={
              <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
                No more playlists to show !!!
              </p>
            }
            className="lg:w-[70%] w-full flex flex-col gap-2 px-1 pb-10"
          >
            {!playlistVideos?.length &&
            totalVideos === 0 &&
            totalPages === 1 &&
            !isFetchingVideos &&
            !isFetchingPlaylist ? (
              <ErrorDialog
                errorMessage="empty videos!"
                buttonLabel="Try again"
                buttonOnClick={() => handleFetchPlaylistVideos(1)}
              />
            ) : (
              playlistVideos?.map(({ playlistVideo: video }, idx) => (
                <Link
                  to={`/watch/${video?._id}`}
                  key={video?._id}
                  className="w-full flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-[#202020]"
                >
                  <span className="self-center text-zinc-700 dark:text-slate-50 text-sm">
                    {idx + 1}
                  </span>
                  <img
                    src={video?.thumbnail?.url}
                    alt="thumbnail"
                    className="w-[160px] h-[90px] rounded-lg"
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
              ))
            )}
            {(isFetchingVideos || isFetchingPlaylist) &&
              currentPage == 1 &&
              Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full flex gap-3 p-3 rounded-lg"
                >
                  <Skeleton className="w-[160px] h-[90px] rounded-lg" />
                  <div className="flex flex-col gap-3 flex-grow h-full">
                    <Skeleton className="lg:w-[80%] w-[95%] h-5" />
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-4 w-[40%]" />
                      <Skeleton className="h-3 w-[30%]" />
                    </div>
                  </div>
                </div>
              ))}
          </ScrollPagination>
        </>
      )}
    </Layout>
  );
}
