import React, { useEffect, useState } from "react";

import ScrollPagination from "../ScrollPagination";
import { ITweetComment, IVideoComment } from "@/interfaces";
import commentService from "@/services/commentService";
import useService from "@/hooks/useService"; 
import AddComment from "./AddComment";
import CommentCard from "./CommentCard";
import EmptyMessage from "../error/EmptyMessage";

interface CommentBoxProps {
  contentId: string;
  type: "video" | "tweet";
}

const CommentBox: React.FC<CommentBoxProps> = ({ contentId, type }) => {
  const [comments, setComments] = useState<(IVideoComment | ITweetComment)[]>([]);
  const [sortType, setSortType] = useState<"recent" | "oldest">("recent");
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  });

  const {
    error: getVideoCommentError,
    isLoading: isVideoCommentFetching,
    handler: getVideoComment,
  } = useService(commentService.getVideoComment);

  const {
    error: getTweetCommentError,
    isLoading: isTweetCommentFetching,
    handler: getTweetComment,
  } = useService(commentService.getTweetComment);

  const fetchComments = async (page: number) => {
    if (type === "video") {
      const { success, responseData } = await getVideoComment({
        videoId: contentId,
        queryParams: {
          page,
          limit: 5,
          sortBy: "createdAt",
          sortType: sortType === "oldest" ? "acc" : "desc",
        },
      });

      if (success) {
        const { page, totalPages, totalDocs, hasNextPage, docs } =
          responseData?.data?.result;

        setComments((prevComments) =>
          page === 1 ? docs : [...prevComments, ...docs]
        );
        setPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        });
      }
    }
    if (type === "tweet") {
      const { success, responseData } = await getTweetComment({
        tweetId: contentId,
        queryParams: {
          page,
          limit: 5,
          sortBy: "createdAt",
          sortType: sortType === "oldest" ? "acc" : "desc",
        },
      });

      if (success) {
        const { page, totalPages, totalDocs, hasNextPage, docs } =
          responseData?.data?.result;

        setComments((prevComments) =>
          page === 1 ? docs : [...prevComments, ...docs]
        );
        setPaginationInfo({
          currentPage: page,
          totalPages,
          totalDocs,
          hasNextPage,
        });
      }
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [contentId, type, sortType]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as "recent" | "oldest");
  };

  return (
    <ScrollPagination
      paginationType="view-more"
      loadNextPage={() => fetchComments(paginationInfo.currentPage + 1)}
      refreshHandler={() => fetchComments(1)}
      dataLength={comments.length}
      loading={
        type === "video" ? isVideoCommentFetching : isTweetCommentFetching
      }
      error={
        type === "video"
          ? getVideoCommentError?.message
          : getTweetCommentError?.message
      }
      currentPage={paginationInfo.currentPage}
      totalItems={paginationInfo.totalDocs}
      totalPages={paginationInfo.totalPages}
      hasNextPage={paginationInfo.hasNextPage}
      endMessage={
        <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
          No more comments to fetch !!!
        </p>
      }
    >
      <div className="flex flex-col gap-5 pt-1">
        <AddComment
          contentId={contentId}
          type={type}
          setComments={setComments}
        />
        {/* Filter */}
        <select
          className="w-min px-4 py-2 bg-slate-50 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#202020] rounded-full text-sm text-gray-700 dark:text-white"
          value={sortType}
          onChange={handleSortChange}
        >
          <option value="recent">Recent</option>
          <option value="oldest">Oldest</option>{" "}
        </select>
        {/* Render comments */}
        {comments?.map((comment) => (
          <CommentCard key={comment?._id} comment={comment} />
        ))}
        {!comments.length &&
          paginationInfo.totalDocs === 0 &&
          paginationInfo.totalPages === 1 &&
          !(type === "video"
            ? isVideoCommentFetching
            : isTweetCommentFetching) && (
            <EmptyMessage
              message="empty comments"
              buttonText="fetch again"
              onRefresh={() => fetchComments(1)}
            />
          )}
      </div>
    </ScrollPagination>
  );
};

export default CommentBox;
