import axiosInstance from "@/helper/axiosInstance";

class WatchLaterService {
  async addVideoToWatchLater(videoId: string) {
    return await axiosInstance.post(`/watch_later/${videoId}`);
  }

  async removeVideoFromWatchLater(videoId: string) {
    return await axiosInstance.delete(`/watch_later/${videoId}`);
  }

  async getUserWatchLaterVideos({
    queryParams,
  }: {
    queryParams: { page?: number; limit?: number };
  }) {
    return await axiosInstance.get("/watch_later", {
      params: queryParams,
    });
  }
}

const watchLaterService = new WatchLaterService();
export default watchLaterService;
