import axiosInstance from "@/helper/axiosInstance";

class DashboardService {
  async getChannelStats() {
    return await axiosInstance.get("/dashboards/stats");
  }

  async getChannelVideos() {
    return await axiosInstance.get("/dashboards/videos");
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
