import Skeleton from "../Skeleton";

export default function TweetSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3 relative border border-slate-300 dark:border-[#252525] lg:p-5 p-3">
      {/* Top Section */}
      <div className="flex gap-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-grow flex-col gap-2">
          <Skeleton className="w-[35%] h-3.5 rounded-md" />
          <Skeleton className="w-[32%] h-2.5 rounded-md" />
        </div>
      </div>

      {/* Content */}
      <Skeleton className="w-full h-[80px] rounded-lg" />

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Like Button */}
        <Skeleton className="w-12 h-6 rounded-full" />

        {/* Comment Button */}
        <Skeleton className="w-[100px] h-6 rounded-full" />
      </div>
    </div>
  );
}
