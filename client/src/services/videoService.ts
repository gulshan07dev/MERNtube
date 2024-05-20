import axiosInstance from "@/helper/axiosInstance";

class VideoService {
  async createVideo(data: {
    title: string;
    description: string;
    videoFile: File | null;
    thumbnail: File | null;
    isPublished: boolean;
  }) {
    return await axiosInstance.post("/videos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async updateVideo({
    videoId,
    data,
  }: {
    videoId: string;
    data: { title: string; description: string; thumbnail?: File | null };
  }) {
    return await axiosInstance.patch(`/videos/${videoId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async getVideoByVideoId(videoId: string) {
    return await axiosInstance.get(`/videos/${videoId}`);
  }

  async getAllVideos(queryParams: {
    page?: number;
    limit?: number;
    query?: string;
    sortBy?: string;
    sortType?: "acc" | "desc";
    userId?: string;
  }) {
    return await axiosInstance.get("/videos", {
      params: queryParams,
    });
  }

  async deleteVideo(videoId: string) {
    return await axiosInstance.delete(`/videos/${videoId}`);
  }

  async toggleVideoPublishStatus(videoId: string) {
    return await axiosInstance.post(`/videos/toggle-status/${videoId}`);
  }
}

const videoService = new VideoService();
export default videoService;
