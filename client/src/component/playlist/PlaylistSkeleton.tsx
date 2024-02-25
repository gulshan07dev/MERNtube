import Skeleton from "../Skeleton";

export default function PlaylistSkeleton() {
  return (
    <div className="w-[210px] flex flex-col gap-2">
      <Skeleton className="h-[115px] w-full rounded-md overflow-hidden" />
      <Skeleton className="h-2 w-[90%] rounded-sm" />
    </div>
  );
}
