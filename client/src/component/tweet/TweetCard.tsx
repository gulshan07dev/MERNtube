import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import { IoIosChatbubbles, IoIosMore } from "react-icons/io";

import { RootState } from "@/store/store";
import { Tweet } from "@/store/slices/tweetSlice";
import Avatar from "../CoreUI/Avatar";
import Button from "../CoreUI/Button";
import LikeBtn from "../CoreUI/LikeBtn";
import DropdownMenu from "../CoreUI/DropdownMenu";
import TextWithToggle from "../CoreUI/TextWithToggle";
import { toggleTweetLike } from "@/store/slices/likeSlice";
import UpdateTweetDialog from "./UpdateTweetDialog";
import DeleteTweetDialog from "./DeleteTweetDialog";
import Devider from "../Divider";
import CommentBox from "../comment/CommentBox";

const TweetCard = ({ tweet }: { tweet: Tweet }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [tweetContent, setTweetContent] = useState(tweet?.content);
  const [isShowUpdateTweetDialog, setIsShowUpdateTweetDialog] = useState(false);
  const [isShowDeleteConfirmDialog, setIsShowDeleteConfirmDialog] =
    useState(false);
  const [isTweetDeleted, setIsTweetDeleted] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);

  const toggleCommentSection = () => setShowCommentSection((prev) => !prev);

  const { _id: userId } = user || {};
  const {
    owner,
    createdAt,
    isLiked,
    tweetLikesCount,
    _id: tweetId,
  } = tweet || {};
  const { avatar, fullName, username } = owner || {};

  if (isTweetDeleted) {
    return (
      <p className="p-2 bg-slate-50 dark:bg-[#252525] text-black dark:text-white">
        This tweet has been deleted.
      </p>
    );
  }

  return (
    <div className="w-full relative border border-slate-300 dark:border-[#404040] lg:p-5 p-3 group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <div className="flex gap-2">
            <Avatar
              url={avatar}
              fullName={fullName}
              className="h-10 w-10"
              onClick={() => navigate(`/c/${username}`)}
            />
            <div className="flex flex-col">
              <h2 className="text-[16.5px] text-gray-800 dark:text-white font-nunito_sans font-semibold">
                {fullName}
              </h2>
              <h2 className="text-[15px] leading-none text-gray-600 dark:text-[#AAAAAA] font-nunito_sans font-semibold">
                {username}
              </h2>
            </div>
          </div>
          <p className="md:text-sm text-xs text-gray-500 dark:text-[#AAAAAA]">
            <TimeAgo date={createdAt} />
          </p>
        </div>
        {userId === owner?._id && (
          <>
            <DropdownMenu
              className="absolute top-3 right-3"
              triggerButton={
                <Button
                  btnType="icon-btn"
                  className="hidden focus-within:block group-hover:block max-md:block"
                >
                  <IoIosMore size={20} />
                </Button>
              }
            >
              <Button
                className="w-full py-1.5 px-7 bg-blue-500 border-none"
                onClick={() => setIsShowUpdateTweetDialog((prev) => !prev)}
              >
                edit
              </Button>
              <Button
                onClick={() => setIsShowDeleteConfirmDialog((prev) => !prev)}
                className="w-full py-1.5 px-7 bg-red-600 border-none"
              >
                delete
              </Button>
            </DropdownMenu>
            <UpdateTweetDialog
              open={isShowUpdateTweetDialog}
              handleClose={() => setIsShowUpdateTweetDialog(false)}
              tweet={tweet}
              onUpdate={(content) => setTweetContent(content)}
            />
            <DeleteTweetDialog
              open={isShowDeleteConfirmDialog}
              handleClose={() => setIsShowDeleteConfirmDialog(false)}
              tweetId={tweetId}
              onDelete={(isTweetDeleted) => setIsTweetDeleted(isTweetDeleted)}
            />
          </>
        )}
      </div>
      <div className="bg-gray-100 dark:bg-[#121212] p-3 rounded-lg mb-3">
        <TextWithToggle
          initialShowLine={2}
          className="text-lg text-gray-800 dark:text-slate-100 font-poppins font-medium"
        >
          {tweetContent}
        </TextWithToggle>
      </div>
      <div className="flex justify-between items-center pl-3">
        <LikeBtn
          isLiked={isLiked}
          likeCount={tweetLikesCount}
          contentId={tweetId}
          toggleLikeAction={toggleTweetLike}
        />
        <button
          className={`flex items-center space-x-1 text-gray-600 dark:text-slate-200 text-lg transition-all rounded-full px-3 py-1 ${
            showCommentSection
              ? "bg-slate-200 dark:bg-[#474747] text-blue-500"
              : "hover:bg-slate-200 dark:hover:bg-[#272727] hover:text-blue-500"
          }`}
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
          <CommentBox contentId={tweetId} type="tweet" />
        </>
      )}
    </div>
  );
};

export default TweetCard;
