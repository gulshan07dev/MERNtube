import Skeleton from "../Skeleton";

export default function WatchHistoryVideoSkeleton() {
  return (
    <div className="w-full flex gap-3 p-3 rounded-lg">
      <Skeleton className="w-[160px] h-[90px] rounded-lg" />
      <div className="flex flex-col gap-3 flex-grow h-full">
        <Skeleton className="lg:w-[80%] w-[95%] h-5" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-3 w-[30%]" />
        </div>
      </div>
    </div>
  );
}
