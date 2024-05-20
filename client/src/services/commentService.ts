import axiosInstance from "@/helper/axiosInstance";

class CommentService {
  async addCommentToVideo({
    data,
    videoId,
  }: {
    data: { content: string };
    videoId: string;
  }) {
    return await axiosInstance.post(`/comments/video/${videoId}`, data);
  }

  async addCommentToTweet({
    data,
    tweetId,
  }: {
    data: { content: string };
    tweetId: string;
  }) {
    return await axiosInstance.post(`/comments/tweet/${tweetId}`, data);
  }

  async updateComment({
    data,
    commentId,
  }: {
    data: { content: string };
    commentId: string;
  }) {
    return await axiosInstance.patch(`/comments/${commentId}`, data);
  }

  async deleteComment(commentId: string) {
    return await axiosInstance.delete(`/comments/${commentId}`);
  }

  async getVideoComment({
    videoId,
    queryParams,
  }: {
    videoId: string;
    queryParams: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortType?: "acc" | "desc";
    };
  }) {
    return await axiosInstance.get(`/comments/video/${videoId}`, {
      params: queryParams,
    });
  }

  async getTweetComment({
    tweetId,
    queryParams,
  }: {
    tweetId: string;
    queryParams: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortType?: "acc" | "desc";
    };
  }) {
    return await axiosInstance.get(`/comments/tweet/${tweetId}`, {
      params: queryParams,
    });
  }
}

const commentService = new CommentService();
export default commentService;
