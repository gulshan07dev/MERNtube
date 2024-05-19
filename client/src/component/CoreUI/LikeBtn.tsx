import React, { useState } from "react";
import { IoIosThumbsUp } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface LikeBtnProps {
  isLiked: boolean;
  likeCount: number;
  onToggleLike: () => Promise<boolean>;
  isLoading: boolean;
}

const LikeBtn: React.FC<LikeBtnProps> = ({
  isLiked,
  likeCount,
  onToggleLike,
  isLoading,
}) => {
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);

  const handleToggleLike = async () => {
    if (isLoading) return;

    setIsLikedState((prev) => !prev);
    setLikeCountState((prevCount) =>
      isLikedState ? prevCount - 1 : prevCount + 1
    );

    const success = await onToggleLike();

    // Revert state changes if any error occur
    if (!success) {
      setIsLikedState((prev) => !prev);
      setLikeCountState((prevCount) =>
        isLikedState ? prevCount + 1 : prevCount - 1
      );
    }
  };

  return (
    <button
      className={twMerge(
        "flex items-center gap-1 w-fit text-gray-600 dark:text-slate-400 text-lg rounded-full",
        "px-3 -ml-3 py-1 transition-all hover:bg-slate-200 dark:hover:bg-[#272727] disabled:opacity-75",
        isLikedState || isLoading
          ? "text-blue-500 dark:text-white bg-slate-200 dark:bg-[#272727]"
          : ""
      )}
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      <span className="text-xl">
        <IoIosThumbsUp />
      </span>
      <span>{likeCountState}</span>
    </button>
  );
};

export default LikeBtn;
