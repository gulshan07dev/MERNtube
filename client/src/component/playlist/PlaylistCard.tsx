import { Playlist } from "@/store/slices/playlistSlice";
import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link to={`/playlists/${playlist?._id}`} className="w-[210px] flex flex-col gap-1">
      <div className="h-[115px] w-full rounded-md overflow-hidden">
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
      </div>
      <h1 className="text-[16px] line-clamp-2 font-roboto font-[500] text-gray-800 dark:text-[#f1f1f1]">{playlist?.name}</h1>
    </Link>
  );
}
