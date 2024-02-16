import { Link } from "react-router-dom";
import { abbreviateNumber } from "js-abbreviation-number";
import TimeAgo from "react-timeago";

import { Video } from "@/store/slices/videoSlice";
import Avatar from "../CoreUI/Avatar";

export default function VideoCard({ data }: { data: Video }) {
  return (
    <div className="rounded-md w-[315px] max-lg:w-[415px] max-sm:w-full overflow-hidden">
      <Link to={data._id} className="flex flex-col gap-2">
        <img
          src={data.thumbnail.url}
          title={data.title}
          className="w-full lg:h-[180px] md:h-[215px] h-[200px] rounded-md"
        />
        <div className="flex gap-2">
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
      </Link>
    </div>
  );
}
