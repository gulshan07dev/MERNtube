import Skeleton from "../Skeleton";

export default function PlaylistSkeleton() {
  return (
    <div className="w-[210px] flex flex-col gap-2  max-md:w-full max-md:flex-row max-md:gap-5">
      <Skeleton className="h-[115px] w-full max-md:w-[45%] max-md:min-h-[100px] rounded-md max-md:rounded-lg overflow-hidden" />
      <div className="flex flex-grow flex-col gap-3 max-md:gap-5">
        <Skeleton className="h-2 max-md:h-6 w-[90%] rounded-sm" />
        <Skeleton className="h-1.5 max-md:h-3 w-[50%] rounded-sm" />
      </div>
    </div>
  );
}
