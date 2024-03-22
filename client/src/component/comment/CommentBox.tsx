import React, { useEffect, useState } from "react";

import ScrollPagination from "../ScrollPagination";
import AddComment from "./AddComment";
import CommentCard from "./CommentCard";
import {
  TweetComment,
  VideoComment,
  getTweetComment,
  getVideoComment,
} from "@/store/slices/commentSlice";
import useActionHandler from "@/hooks/useActionHandler";
import EmptyMessage from "../EmptyMessage";

interface CommentBoxProps {
  contentId: string;
  type: "video" | "tweet";
}

const CommentBox: React.FC<CommentBoxProps> = ({ contentId, type }) => {
  const [comments, setComments] = useState<(VideoComment | TweetComment)[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [sortType, setSortType] = useState<"recent" | "oldest">("recent");
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { error, isLoading, handleAction } = useActionHandler({
    action: type === "video" ? getVideoComment : getTweetComment,
    isShowToastMessage: false,
  });

  const fetchComments = async (page: number) => {
    const { isSuccess, resData } = await handleAction({
      videoId: contentId,
      tweetId: contentId,
      queryParams: {
        page,
        limit: 5,
        sortBy: "createdAt",
        sortType: sortType === "oldest" ? "acc" : "desc",
      },
    });

    if (isSuccess && resData?.result) {
      setComments((prevComments) =>
        page === 1
          ? resData.result.docs
          : [...prevComments, ...resData.result.docs]
      );
      setCurrPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalDocs(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
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
      loadNextPage={() => fetchComments(currPage + 1)}
      refreshHandler={() => fetchComments(1)}
      dataLength={comments.length}
      loading={isLoading}
      error={error}
      currentPage={currPage}
      totalItems={totalDocs}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
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
          totalDocs === 0 &&
          totalPages === 1 &&
          !isLoading && (
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
