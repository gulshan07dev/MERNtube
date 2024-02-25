import { useSelector } from "react-redux";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";

import Layout from "@/layout/Layout";
import { RootState } from "@/store/store";
import { getPlaylist } from "@/store/slices/playlistSlice";
import useActionHandler from "@/hooks/useActionHandler";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Skeleton from "@/component/Skeleton";
import ErrorDialog from "@/component/error/ErrorDialog";

export default function PlaylistVideos() {
  const { playlistId } = useParams();
  const { playlist } = useSelector((state: RootState) => state?.playlist);

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
    <Layout className="flex max-lg:flex-col max-lg:gap-7 lg:h-full lg:overflow-y-scroll gap-3 py-5">
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
          <div className="lg:w-[30%] w-full lg:h-full flex lg:flex-col md:flex-row md:gap-5 lg:justify-start md:justify-center flex-col gap-y-4 p-5 lg:sticky lg:top-0 lg:overflow-y-scroll bg-gradient-to-b from-red-400 from-[30%] to-dark_bg to-[20%] via-violet-500 dark:via-[#161616] via-[100%] backdrop-blur-2xl dark:bg-[#505050] rounded-lg">
            <div className="lg:w-full md:w-[40%] w-full rounded-xl overflow-hidden">
              <img
                src={playlist?.videos?.[0]?.thumbnail?.url}
                alt="playlistThumbnail"
                className="w-full max-md:w-[70%] max-sm:w-full "
              />
            </div>
            <div className="lg:w-full md:w-[50%] w-full">
              <h1 className="text-2xl text-white font-poppins font-bold capitalize">
                {playlist?.name}
              </h1>
              <div>
                <h2 className="text-base text-white">
                  {playlist?.owner?.fullName}
                </h2>
                <p className="text-xs text-white font-roboto">
                  videos {playlist?.videos?.length}
                </p>
              </div>
              <p className="text-base text-white py-3 font-nunito_sans">
                {playlist?.description}
              </p>
            </div>
          </div>

          {/* playlist videos */}
          <div className="lg:w-[70%] w-full flex flex-col gap-2 px-1 pb-10">
            {playlist?.videos?.map((video, idx) => (
              <div key={video?._id} className="flex gap-3 p-3 items-center rounded-lg hover:bg-slate-200 dark:hover:bg-[#202020]">
                <span className="text-zinc-700 dark:text-slate-50 text-sm">{idx + 1}</span>
                <img
                  src={video?.thumbnail?.url}
                  alt="thumbnail"
                  className="w-[160px] h-[90px] rounded-lg"
                />
                <div className="flex flex-col gap-1 flex-grow h-full">
                  <h1 className="text-base text-black line-clamp-2 dark:text-white font-roboto">
                    {video?.title}
                  </h1>
                  <p className="text-sm text-[#606060] dark:text-[#AAAAAA] font-roboto truncate">
                    {video?.owner?.fullName} {" · "}
                    {abbreviateNumber(video?.views, 1)} views{" · "}
                    <TimeAgo date={video?.createdAt} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
