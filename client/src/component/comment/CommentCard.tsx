import { useNavigate } from "react-router-dom";
import TimeAgo from "react-timeago";

import { Comment } from "@/store/slices/commentSlice";
import Avatar from "../CoreUI/Avatar";
import LikeBtn from "../CoreUI/LikeBtn";
import { toggleCommentLike } from "@/store/slices/likeSlice";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2">
      <Avatar
        url={comment?.owner?.avatar?.url}
        fullName={comment?.owner?.fullName}
        className="h-10 w-10"
        onClick={() => navigate(`/c/${comment?.owner?.username}`)}
      />
      <div className="flex flex-grow flex-col gap-1">
        <div className="flex gap-3 items-start">
          <h2 className="text-[13px] leading-none text-gray-600 font-nunito_sans font-semibold">
            {comment?.owner?.username}
          </h2>
          <p className="text-xs leading-none text-gray-500">
            <TimeAgo date={comment?.createdAt} />
          </p>
        </div>
        <p className="text-sm text-gray-800 font-roboto  break-all">{comment?.content}</p>
        <LikeBtn
          contentId={comment?._id}
          isLiked={comment?.isLiked}
          likeCount={comment?.commentLikesCount}
          toggleLikeAction={toggleCommentLike}
        />
      </div>
    </div>
  );
};

export default CommentCard;
