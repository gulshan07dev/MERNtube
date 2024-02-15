import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import { IoIosChatbubbles, IoIosMore } from "react-icons/io";

import LikeBtn from "../CoreUI/LikeBtn";
import { Tweet, deleteTweet } from "@/store/slices/tweetSlice";
import { toggleTweetLike } from "@/store/slices/likeSlice";
import Avatar from "../CoreUI/Avatar";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { RootState } from "@/store/store";
import { useState } from "react";
import Devider from "../Divider";
import { twMerge } from "tailwind-merge";
import CommentBox from "../comment/CommentBox";

const TweetCard = ({ data }: { data: Tweet }) => {
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const { user } = useSelector((state: RootState) => state?.auth);

  const { isLoading: isDeleting, handleAction: deleteTweetAction } =
    useActionHandler({
      action: deleteTweet,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "deleting tweet..." },
    });

  const handleDeleteTweet = async (tweetId: string) => {
    setIsDeleted(false);
    const { error, isSuccess } = await deleteTweetAction(tweetId);

    if (!error && isSuccess) {
      setIsDeleted(true);
    }
  };

  const toggleCommentSection = () => {
    setShowCommentSection((prev) => !prev);
  };

  if (isDeleted) {
    return <p className="p-2 bg-slate-50">it was deleted !</p>;
  }

  return (
    <div className="lg:w-[75%] w-[95%] relative border border-slate-300 lg:p-5 p-3 group">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <div className="flex gap-2">
            <Avatar
              url={data?.owner?.avatar?.url}
              fullName={data?.owner?.fullName}
              className="h-10 w-10"
              onClick={() => navigate(`/c/${data?.owner?.username}`)}
            />
            <div className="flex flex-col">
              <h2 className="text-[16.5px] text-gray-800 font-nunito_sans font-semibold">
                {data?.owner?.fullName}
              </h2>
              <h2 className="text-[15px] leading-none text-gray-600 font-nunito_sans font-semibold">
                {data?.owner?.username}
              </h2>
            </div>
          </div>
          <p className="md:text-sm text-xs text-gray-500">
            <TimeAgo date={data.createdAt} />
          </p>
        </div>
        {/* more option menu for edit and delete, only for owner */}
        {user?._id === data?.owner?._id && (
          <DropdownMenu
            className="absolute top-3 right-3"
            button={
              <button className="p-3 text-lg rounded-full hover:bg-slate-100 hidden focus-within:block group-hover:block max-md:block">
                <IoIosMore />
              </button>
            }
          >
            <Button
              label="edit"
              className="w-full py-1.5 px-7 bg-blue-500 border-none"
              onClick={() => navigate(`/edit/tweet/${data?._id}`)}
            />
            <Button
              label={isDeleting ? "deleting..." : "delete"}
              className="w-full py-1.5 px-7 bg-red-600 border-none"
              disabled={isDeleting}
              onClick={() => handleDeleteTweet(data._id)}
            />
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="bg-gray-100 p-3 rounded-lg mb-3">
        <p className="text-lg text-gray-800 font-poppins font-medium">
          {data?.content}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center pl-3">
        {/* Like Button */}
        <LikeBtn
          isLiked={data?.isLiked}
          likeCount={data?.tweetLikesCount}
          contentId={data?._id}
          toggleLikeAction={toggleTweetLike}
        />

        {/* Comment Button */}
        <button
          className={twMerge(
            "flex items-center space-x-1 text-gray-600 text-lg transition-all rounded-full px-3 py-1",
            "hover:bg-slate-100  hover:text-blue-500",
            showCommentSection && "bg-slate-100 text-blue-500"
          )}
          onClick={toggleCommentSection}
        >
          <span className="text-xl">
            <IoIosChatbubbles />
          </span>
          <span>Comment</span>
        </button>
      </div>
      {showCommentSection && (
        <>
          <Devider className="my-3" />
          {/* comment section */}
          <CommentBox contentId={data?._id} type="tweet" />
        </>
      )}
    </div>
  );
};

export default TweetCard;
