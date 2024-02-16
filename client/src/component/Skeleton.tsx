import { twMerge } from "tailwind-merge";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        "animate-pulse bg-gray-300 dark:bg-[#303030]",
        className
      )}
    ></div>
  );
};

export default Skeleton;
