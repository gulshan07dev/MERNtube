import axiosInstance from "@/helper/axiosInstance"

class WatchHistoryService {
  async addVideoToWatchHistory(videoId: string) {
    return await axiosInstance.post(`/watch_history/add/${videoId}`);
  }

  async removeVideoFromWatchHistory(historyId: string) {
    return await axiosInstance.delete(`/watch_history/remove/${historyId}`);
  }

  async clearWatchHistory() {
    return await axiosInstance.delete("/watch_history");
  }

  async toggleWatchHistoryPauseStatus() {
    return await axiosInstance.patch("/watch_history/toggle_status");
  }

  async getWatchHistory({
    queryParams,
  }: {
    queryParams: { page?: number; limit?: number };
  }) {
    return await axiosInstance.get("/watch_history", {
      params: queryParams,
    });
  }
}

const watchHistoryService = new WatchHistoryService()
export default watchHistoryService