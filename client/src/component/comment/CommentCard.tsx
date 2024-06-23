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
import Modal from "../Modal";
import TextWithToggle from "../CoreUI/TextWithToggle";
import DeletedMessage from "../DeletedMessage";
import AutoExpandingTextarea from "../CoreUI/AutoExpandingTextarea";

interface CommentCardProps {
  comment: IComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [commentContent, setCommentContent] = useState(comment?.content);
  const [isCommentDeleteDialogOpen, setIsCommentDeleteDialogOpen] =
    useState(false);
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

  const handleDeleteComment = async () => {
    setIsDeleted(false);
    const { success } = await deleteComment(comment?._id);

    if (success) {
      setIsDeleted(true);
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleUpdateComment = async () => {
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
    return <DeletedMessage message="This comment has been deleted." />;
  }

  return (
    <div className="group/item flex gap-3">
      <div className="flex flex-grow gap-2">
        <Avatar
          url={comment?.owner?.avatar}
          fullName={comment.owner.fullName}
          className="h-6 w-6"
          onClick={() => navigate(`/c/${comment?.owner?.username}`)}
        />
        {isEditing ? (
          <div className="flex flex-col flex-grow h-auto gap-3">
            <AutoExpandingTextarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 self-end">
              <Button
                onClick={handleCancelEdit}
                isLarge={false}
                className="py-1.5 px-6 text-[15px] rounded-full bg-[#212121] hover:bg-[#505050]"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateComment}
                isLarge={false}
                className={"py-1.5 px-6 text-[15px] rounded-full"}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow w-min flex-col gap-1">
            <div className="relative flex gap-3 items-start w-full">
              <h2 className="text-[12px] leading-none text-zinc-950 dark:text-slate-50 font-poppins font-[500]">
                {comment?.owner?.username}
              </h2>
              <p className="text-xs leading-none text-gray-500 dark:text-[#AAAAAA]">
                <TimeAgo date={comment?.createdAt} />
              </p>
              {user?._id === comment.owner._id && !isEditing && (
                <>
                  <DropdownMenu
                    className="absolute -right-4 top-0"
                    triggerButton={
                      <Button
                        btnType="icon-btn"
                        className="focus-within:block max-md:block text-lg"
                      >
                        <FiMoreVertical />
                      </Button>
                    }
                  >
                    <Button
                      onClick={handleEditComment}
                      className="w-full py-1.5 px-7 bg-blue-500 border-none"
                    >
                      Edit
                    </Button>
                    <Button
                      className="w-full py-1.5 px-7 bg-red-600 border-none"
                      onClick={() => setIsCommentDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </DropdownMenu>
                  <Modal
                    open={isCommentDeleteDialogOpen}
                    handleClose={() => setIsCommentDeleteDialogOpen(false)}
                    title="Delete Comment"
                    description="Are you sure you want to delete the comment?"
                    submitLabel={isDeleting ? "Deleting..." : "Delete"}
                    isLoading={isDeleting}
                    onSubmit={() => handleDeleteComment()}
                  />
                </>
              )}
            </div>
            <div className="w-[94%]">
              <TextWithToggle
                initialShowLine={4}
                className="text-sm text-gray-800 dark:text-slate-200 font-[400] font-poppins leading-[18.5px]"
              >
                {commentContent}
              </TextWithToggle>
            </div>
            <LikeBtn
              isLiked={comment?.isLiked}
              likeCount={comment?.commentLikesCount}
              onToggleLike={handleToggleLike}
              isLoading={isCommentLikeLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
