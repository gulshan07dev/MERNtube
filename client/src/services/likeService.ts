import axiosInstance from "@/helper/axiosInstance";

class LikeService {
  async toggleVideoLike(videoId: string) {
    return await axiosInstance.post(`/likes/video/${videoId}`);
  }

  async toggleCommentLike(commentId: string) {
    return await axiosInstance.post(`/likes/comment/${commentId}`);
  }

  async toggleTweetLike(tweetId: string) {
    return await axiosInstance.post(`/likes/tweet/${tweetId}`);
  }

  async getLikedVideos(queryParams: { page?: number; limit?: number }) {
    return await axiosInstance.get("/likes/videos", { params: queryParams });
  }
}

const likeService = new LikeService();
export default likeService;
