import Skeleton from "../Skeleton";

export default function VideoSkeleton() {
  return (
    <div className="rounded-md w-[315px] max-lg:w-[415px] max-sm:w-full overflow-hidden">
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="w-full lg:h-[180px] md:h-[215px] h-[200px] rounded-md" />
        <div className="flex gap-2 w-full">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-3 flex-grow">
            <Skeleton className="h-4 w-[90%] rounded" />
            <Skeleton className="h-2.5 w-[70%] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
