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

interface CommentBoxProps {
  contentId: string;
  type: "video" | "tweet";
}

const CommentBox: React.FC<CommentBoxProps> = ({ contentId, type }) => {
  const [comments, setComments] = useState<(VideoComment | TweetComment)[]>([]);
  const [currPage, setCurrPage] = useState(1);
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
      queryParams: { page, limit: 2 },
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
  }, [contentId, type]);

  return (
    <div className={`flex flex-col ${error ? "gap-14" : "gap-5"}`}>
      <AddComment contentId={contentId} type={type} setComments={setComments} />
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
          <p className="py-4 text-lg text-gray-800 text-center font-Noto_sans">
            No more comments to fetch !!!
          </p>
        }
      >
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </div>
      </ScrollPagination>
    </div>
  );
};

export default CommentBox;
