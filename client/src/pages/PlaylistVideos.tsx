import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { abbreviateNumber } from "js-abbreviation-number";
import { MdDelete } from "react-icons/md";
import { IoIosMore } from "react-icons/io";

import PageLayout from "@/layout/PageLayout";
import ScrollPagination from "@/component/ScrollPagination";
import playlistService from "@/services/playlistService";
import useService from "@/hooks/useService";
import { setPlaylist } from "@/store/slices/playlistSlice";
import { RootState } from "@/store/store";
import { IVideo } from "@/interfaces";
import Skeleton from "@/component/Skeleton";
import ErrorDialog from "@/component/error/ErrorDialog";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import Button from "@/component/CoreUI/Button";
import DeletePlaylistDialogButton from "@/component/playlist/DeletePlaylistDialogButton";
import UpdatePlaylistDialog from "@/component/playlist/UpdatePlaylistDialog";
import PlaylistVideoCard from "@/component/playlist/playlistVideo/PlaylistVideoCard";
import PlaylistVideoSkeleton from "@/component/playlist/playlistVideo/PlaylistVideoSkeleton";
import TextWithToggle from "@/component/CoreUI/TextWithToggle";

type SortType =
  | "date-added-newest"
  | "date-added-oldest"
  | "popular"
  | "date-published-newest"
  | "date-published-oldest";

export default function PlaylistVideos() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playlist } = useSelector((state: RootState) => state?.playlist);
  const [playlistVideos, setPlaylistVideos] = useState<
    { playlistVideo: IVideo }[]
  >([]);
  const [modalOpen, setModalOpen] = useState<
    "delete_playlist_dialog" | "update_playlist_dialog" | null
  >(null);
  const [sortType, setSortType] = useState<SortType>("date-added-newest");
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  });
  const limit = 5;

  const {
    isLoading: isFetchingPlaylist,
    error: playlistFetchingError,
    handler: getPlaylist,
  } = useService(playlistService.getPlaylist);

  const { isLoading: isDeleting, handler: deletePlaylist } = useService(
    playlistService.deletePlaylist,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Deleting playlist..." },
    }
  );

  const {
    isLoading: isFetchingPlaylistVideos,
    error: playlistVideosFetchingError,
    handler: getUserPlaylistVideos,
  } = useService(playlistService.getUserPlaylistVideos);

  const handleFetchePlaylist = async () => {
    const { error, success, responseData } = await getPlaylist(playlistId!);
    if (!error && success) {
      dispatch(setPlaylist(responseData?.data?.playlist));
    }
  };

  const handleDeletePlaylist = async () => {
    const { error, success } = await deletePlaylist(playlistId!);
    if (!error && success) {
      setModalOpen(null);
      navigate(-1);
    }
  };

  const handleFetchPlaylistVideos = async (page: number) => {
    if (!playlist?._id || !playlistId) return;

    if (page == 1) {
      setPlaylistVideos([]);
    }

    const { success, responseData } = await getUserPlaylistVideos({
      playlistId,
      queryParams: {
        page,
        limit,
        orderBy: sortType.includes("date-added")
          ? sortType.includes("newest")
            ? "desc"
            : "acc"
          : undefined,
        sortBy: !sortType.includes("date-added")
          ? sortType.includes("popular")
            ? "views"
            : "createdAt"
          : undefined,
        sortType: !sortType.includes("date-added")
          ? sortType.includes("popular")
            ? "desc"
            : sortType.includes("newest")
            ? "desc"
            : "acc"
          : undefined,
      },
    });

    if (success) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      setPlaylistVideos(page === 1 ? docs : [...playlistVideos, ...docs]);
      setPaginationInfo({
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      });
    }
  };

  useEffect(() => {
    if (playlist?._id === playlistId) return;
    handleFetchePlaylist();
  }, [playlistId]);

  useEffect(() => {
    handleFetchPlaylistVideos(1);
  }, [playlistId, playlist?._id, sortType]);

  return (
    <PageLayout className="w-full flex max-lg:flex-col max-lg:gap-7 gap-3">
      {playlistFetchingError ? (
        <ErrorDialog
          errorMessage={playlistFetchingError?.message}
          buttonLabel="Try again"
          buttonOnClick={() => handleFetchePlaylist()}
        />
      ) : (
        <>
          {/* Playlist Details */}
          {isFetchingPlaylist ? (
            <Skeleton className="lg:w-[30%] w-full lg:h-[85vh] h-[250px] lg:sticky lg:top-0 rounded-lg" />
          ) : (
            <div
              className={twMerge(
                "lg:w-[30%] w-full lg:h-[calc(100vh-85px)] flex lg:flex-col md:flex-row md:gap-5 lg:justify-start md:justify-center flex-col gap-y-1 p-5 lg:sticky lg:top-[72px] lg:overflow-y-scroll rounded-lg max-md:rounded-none",
                !playlist?.playlistThumbnail
                  ? "bg-none"
                  : [
                      "bg-gradient-to-b from-violet-400 from-[30%] to-dark_bg to-[20%] via-violet-500 dark:via-[#161616] via-[100%]",
                    ]
              )}
            >
              {/* Thumbnail */}
              {playlist?.playlistThumbnail && (
                <div className="lg:w-full md:w-[40%] w-[80%] mx-auto rounded-xl overflow-hidden">
                  <img
                    src={playlist?.playlistThumbnail}
                    alt="playlistThumbnail"
                    className="w-full max-md:w-[50%] max-sm:w-full max-sm:h-[150px] max-sm:rounded-2xl mx-auto"
                  />
                </div>
              )}
              {/* Playlist Info */}
              <div
                className={twMerge(
                  "lg:w-full md:w-[50%] w-full flex flex-col gap-4 max-sm:gap-2",
                  " text-white dark:text-[#F1F1F1] font-roboto",
                  !playlist?.playlistThumbnail && ["text-[#0F0F0F] md:px-4"]
                )}
              >
                {/* Playlist Name */}
                <h1 className="md:text-[28px] text-xl leading-10 font-semibold capitalize  ">
                  {playlist?.name}
                </h1>
                {/* Playlist Metadata */}
                <div className="flex">
                  <div className="flex flex-grow flex-col md:gap-3 gap-1">
                    <p className="md:text-base text-[14.5px] md:font-[600]">
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
                      <Button
                        btnType="icon-btn"
                        className="bg-white dark:bg-dark_bg text-lg"
                      >
                        <IoIosMore />
                      </Button>
                    }
                  >
                    {/* Edit Button */}
                    <Button
                      className="w-full py-1.5 px-7 bg-blue-500 border-none"
                      onClick={() => setModalOpen("update_playlist_dialog")}
                    >
                      Edit
                    </Button>
                    {/* Delete Button */}
                    <Button
                      icon={<MdDelete />}
                      className="w-full py-1.5 px-7 bg-red-600 border-none"
                      onClick={() => setModalOpen("delete_playlist_dialog")}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DropdownMenu>
                  {/* Delete Playlist Dialog */}
                  <DeletePlaylistDialogButton
                    open={modalOpen === "delete_playlist_dialog"}
                    handleClose={() => setModalOpen(null)}
                    isDeleting={isDeleting}
                    onDelete={handleDeletePlaylist}
                  />
                  {/* Update Playlist Dialog */}
                  <UpdatePlaylistDialog
                    open={modalOpen === "update_playlist_dialog"}
                    handleClose={() => setModalOpen(null)}
                    playlistId={playlist?._id || ""}
                    playlistDetails={{
                      name: playlist?.name || "",
                      description: playlist?.description || "",
                      isPrivate: playlist?.isPrivate || false,
                    }}
                    onUpdate={(updatedPlaylist) =>
                      dispatch(setPlaylist(updatedPlaylist))
                    }
                  />
                </div>
                {/* Description */}
                <TextWithToggle
                  initialShowLine={2}
                  className="text-sm font-nunito_sans"
                >
                  {playlist?.description || "No Description"}
                </TextWithToggle>
              </div>
            </div>
          )}

          {/* Playlist Videos */}
          <ScrollPagination
            paginationType="infinite-scroll"
            loadNextPage={() =>
              handleFetchPlaylistVideos(paginationInfo.currentPage + 1)
            }
            refreshHandler={() => handleFetchPlaylistVideos(1)}
            dataLength={playlistVideos.length}
            loading={isFetchingPlaylistVideos || isFetchingPlaylist}
            error={playlistVideosFetchingError?.message}
            currentPage={paginationInfo.currentPage}
            totalItems={paginationInfo.totalDocs}
            totalPages={paginationInfo.totalPages}
            hasNextPage={paginationInfo.hasNextPage}
            endMessage={
              <p className="py-4 pt-5 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
                No more playlists to show !!!
              </p>
            }
            className="lg:w-[70%] w-full flex flex-col gap-2"
          >
            {!playlistVideos?.length &&
            paginationInfo.totalDocs === 0 &&
            paginationInfo.totalPages === 1 &&
            !isFetchingPlaylistVideos &&
            !isFetchingPlaylist ? (
              <ErrorDialog
                errorMessage="empty videos!"
                buttonLabel="Try again"
                buttonOnClick={() => handleFetchPlaylistVideos(1)}
              />
            ) : (
              <>
                <select
                  className="w-min px-4 py-2 mb-3 bg-slate-50 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#202020] rounded-full text-sm text-gray-700 dark:text-white"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                >
                  <option value="date-added-newest">Date added (newest)</option>
                  <option value="date-added-oldest">Date added (oldest)</option>
                  <option value="popular">Most popular</option>
                  <option value="date-published-newest">
                    Date published (newest)
                  </option>
                  <option value="date-published-oldest">
                    Date published (oldest)
                  </option>
                </select>
                {playlistVideos?.map(({ playlistVideo: video }, idx) => (
                  <PlaylistVideoCard
                    key={video?._id}
                    video={video}
                    playlistId={playlistId || ""}
                    idx={idx}
                  />
                ))}
              </>
            )}
            {(isFetchingPlaylistVideos || isFetchingPlaylist) &&
              paginationInfo.currentPage == 1 &&
              Array.from({ length: 10 }).map((_, idx) => (
                <PlaylistVideoSkeleton key={idx} />
              ))}
          </ScrollPagination>
        </>
      )}
    </PageLayout>
  );
}
