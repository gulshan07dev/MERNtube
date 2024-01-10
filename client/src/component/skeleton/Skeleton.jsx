import { twMerge } from "tailwind-merge";

const Skeleton = ({ className }) => {
  return (
    <div
      className={twMerge("animate-pulse bg-gray-300", className)}
    ></div>
  );
};
 

export default Skeleton;
