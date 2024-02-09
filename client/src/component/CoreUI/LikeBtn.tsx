import React, { useState } from "react";
import { IoIosThumbsUp } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import useActionHandler from "@/hooks/useActionHandler";
import {
  AsyncThunk,
  AsyncThunkConfig,
} from "node_modules/@reduxjs/toolkit/dist/createAsyncThunk";

interface LikeBtnProps {
  isLiked: boolean;
  likeCount: number;
  contentId: string;
  toggleLikeAction: AsyncThunk<any, void, AsyncThunkConfig>;
}

const LikeBtn: React.FC<LikeBtnProps> = ({
  isLiked,
  likeCount,
  contentId,
  toggleLikeAction,
}) => {
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);

  const { isLoading, error, handleAction } = useActionHandler({
    action: toggleLikeAction,
    isShowToastMessage: true,
  });

  const toggleLike = async () => {
    if (isLoading) return;

    const updatedLikeCount = isLikedState
      ? likeCountState - 1
      : likeCountState + 1;
    setLikeCountState(updatedLikeCount);
    setIsLikedState(!isLikedState);

    // Call the toggle like action
    await handleAction(contentId);

    // Revert state changes if request fails
    if (error) {
      setLikeCountState(likeCountState);
      setIsLikedState(isLikedState);
    }
  };

  return (
    <button
      className={twMerge(
        "flex items-center space-x-1 text-gray-600 text-lg rounded-full",
        "px-3 py-1 transition-all hover:bg-slate-100 disabled:opacity-75",
        (isLikedState || isLoading) && ["text-blue-500 bg-slate-100"]
      )}
      onClick={toggleLike}
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
