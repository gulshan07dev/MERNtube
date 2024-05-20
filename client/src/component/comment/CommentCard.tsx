import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import { FiMoreVertical } from "react-icons/fi";

import commentService from "@/services/commentService";
import { IComment } from "@/interfaces";
import likeService from "@/services/likeService";
import useService from "@/hooks/useService";
import { RootState } from "@/store/store";
import Avatar from "../CoreUI/Avatar";
import LikeBtn from "../CoreUI/LikeBtn";
import DropdownMenu from "../CoreUI/DropdownMenu";
import Button from "../CoreUI/Button";
import EditableTextarea from "../CoreUI/EditableTextarea";
import Modal from "../CoreUI/Modal";
import TextWithToggle from "../CoreUI/TextWithToggle";

interface CommentCardProps {
  comment: IComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [commentContent, setCommentContent] = useState(comment?.content);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);

  const { isLoading: isDeleting, handler: deleteComment } = useService(
    commentService.deleteComment,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Deleting comment..." },
    }
  );

  const { isLoading: isUpdating, handler: updateComment } = useService(
    commentService.updateComment,
    {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Updating comment..." },
    }
  );

  const { isLoading: isCommentLikeLoading, handler: toggleCommentLike } =
    useService(likeService.toggleCommentLike, {
      isShowToastMessage: true,
    });

  const handleDelete = async () => {
    setIsDeleted(false);
    const { success } = await deleteComment(comment?._id);

    if (success) {
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

  const handleUpdate = async () => {
    const { success, error } = await updateComment({
      data: { content: editedContent },
      commentId: comment._id,
    });
    if (success && !error) {
      setIsEditing(false);
      setCommentContent(editedContent);
    }
  };

  const handleToggleLike = async () => {
    const { success } = await toggleCommentLike(comment?._id);
    return success;
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
          url={comment?.owner?.avatar}
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
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
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
            <TextWithToggle
              initialShowLine={2}
              className="text-sm text-gray-800 dark:text-slate-50 font-roboto whitespace-break-spaces break-all"
            >
              {commentContent}
            </TextWithToggle>
            <LikeBtn
              isLiked={comment?.isLiked}
              likeCount={comment?.commentLikesCount}
              onToggleLike={handleToggleLike}
              isLoading={isCommentLikeLoading}
            />
          </div>
        )}
      </div>
      {user?._id === comment.owner._id && !isEditing && (
        <>
          <DropdownMenu
            triggerButton={
              <Button
                btnType="icon-btn"
                className="focus-within:block hidden group-hover/item:block max-md:block"
              >
                <FiMoreVertical size={15} />
              </Button>
            }
          >
            <Button
              onClick={handleEdit}
              className="w-full py-1.5 px-7 bg-blue-500 border-none"
            >
              Edit
            </Button>
            <Button
              className="w-full py-1.5 px-7 bg-red-600 border-none"
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DropdownMenu>
          <Modal
            open={isDeleted}
            handleClose={() => setIsDeleted(false)}
            title="Delete Comment"
            description="Are you sure you want to delete the comment?"
            submitLabel={isDeleting ? "Deleting..." : "Delete"}
            isLoading={isDeleting}
            onSubmit={() => handleDelete()}
            closeButton={
              <Button
                className="w-full py-1.5 px-7 bg-red-600 border-none"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            }
          />
        </>
      )}
    </div>
  );
};

export default CommentCard;
