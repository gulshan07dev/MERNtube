import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import { formatDistanceToNow } from "date-fns";

import { Video } from "@/store/slices/videoSlice";
import Avatar from "../CoreUI/Avatar";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="rounded-md w-[315px] max-lg:w-[415px] max-sm:w-full overflow-hidden">
      <Link to={video._id} className="flex flex-col gap-2">
        <img
          src={video.thumbnail.url}
          title={video.title}
          className="w-full lg:h-[180px] md:h-[215px] h-[200px] rounded-md"
        />
        <div className="flex gap-2">
          <Avatar
            fullName={video?.owner?.fullName}
            url={video?.owner?.avatar?.url}
            className="h-8 w-8"
          />
          <div className="flex flex-col gap-[1px]">
            <h1 className="text-[16px] font-roboto font-medium text-[#0f0f0f] line-clamp-2">
              {video?.title}
            </h1>
            <p className="text-sm text-[#606060] font-roboto font-normal leading-tight">
              {video?.owner?.fullName}
            </p>
            <p className="text-sm text-[#606060] font-roboto font-normal leading-none">
              {abbreviateNumber(video?.views, 1)} views{" · "}
              {formatDistanceToNow(new Date(video?.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
