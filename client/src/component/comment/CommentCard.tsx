import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import { IoIosMore } from "react-icons/io";

import { RootState } from "@/store/store";
import useActionHandler from "@/hooks/useActionHandler";
import {
  Comment,
  deleteComment,
  updateComment,
} from "@/store/slices/commentSlice";
import { toggleCommentLike } from "@/store/slices/likeSlice";
import Avatar from "../CoreUI/Avatar";
import LikeBtn from "../CoreUI/LikeBtn";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import EditableTextarea from "../CoreUI/EditableTextarea";
import Dialog from "../CoreUI/Dialog";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [commentContent, setCommentContent] = useState(comment?.content);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);

  const { isLoading: isDeleting, handleAction: deleteCommentAction } =
    useActionHandler({
      action: deleteComment,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Deleting comment..." },
    });

  const { isLoading: isUpdating, handleAction: updateCommentAction } =
    useActionHandler({
      action: updateComment,
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Updating comment..." },
    });

  const handleDeleteComment = async (commentId: string) => {
    setIsDeleted(false);
    const { error, isSuccess } = await deleteCommentAction(commentId);

    if (!error && isSuccess) {
      setIsDeleted(true);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleUpdateComment = async () => {
    const { isSuccess, error } = await updateCommentAction({
      data: { content: editedContent },
      commentId: comment._id,
    });
    if (isSuccess && !error) {
      setIsEditing(false);
      setCommentContent(editedContent);
    }
  };

  if (isDeleted) {
    return (
      <p className="p-2 bg-slate-50 dark:bg-[#252525] text-black dark:text-white">
        This comment has been deleted.
      </p>
    );
  }

  return (
    <div className="group/item flex gap-2">
      <div className="flex flex-grow gap-2">
        <Avatar
          url={comment?.owner?.avatar?.url}
          fullName={comment.owner.fullName}
          className="h-10 w-10"
          onClick={() => navigate(`/c/${comment?.owner?.username}`)}
        />
        {isEditing ? (
          <div className="flex flex-col flex-grow h-auto gap-3">
            <EditableTextarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 self-end">
              <Button
                label="Cancel"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white"
                disabled={isUpdating}
              />
              <Button
                label={isUpdating ? "updating..." : "Update"}
                onClick={handleUpdateComment}
                disabled={isUpdating}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-grow w-min flex-col gap-1">
            <div className="flex gap-3 items-start">
              <h2 className="text-[13px] leading-none text-gray-600 dark:text-[#AAAAAA] font-nunito_sans font-semibold">
                {comment?.owner?.username}
              </h2>
              <p className="text-xs leading-none text-gray-500 dark:text-[#AAAAAA]">
                <TimeAgo date={comment?.createdAt} />
              </p>
            </div>
            <p className="text-sm text-gray-800 dark:text-slate-50 font-roboto whitespace-break-spaces break-all">
              {commentContent}
            </p>
            <LikeBtn
              contentId={comment._id}
              isLiked={comment.isLiked}
              likeCount={comment.commentLikesCount}
              toggleLikeAction={toggleCommentLike}
            />
          </div>
        )}
      </div>
      {user?._id === comment.owner._id && !isEditing && (
        <DropdownMenu
          button={
            <button className="md:p-3 text-lg rotate-90 rounded-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-[#171717] focus-within:block hidden group-hover/item:block max-md:block">
              <IoIosMore />
            </button>
          }
        >
          <Button
            label="Edit"
            onClick={handleEdit}
            className="w-full py-1.5 px-7 bg-blue-500 border-none"
          />
          <Dialog
            title="Delete Comment"
            description="Are you sure you want to delete the comment?"
            submitLabel={isDeleting ? "deleting..." : "Delete"}
            isLoading={isDeleting}
            onSubmit={() => handleDeleteComment(comment?._id)}
            triggerButton={
              <Button
                label={isDeleting ? "Deleting..." : "Delete"}
                className="w-full py-1.5 px-7 bg-red-600 border-none"
              />
            }
            closeButton={
              <Button
                label="Cancel"
                className="w-full py-1.5 px-7 bg-red-600 border-none"
                disabled={isDeleting}
              />
            }
          />
        </DropdownMenu>
      )}
    </div>
  );
};

export default CommentCard;
