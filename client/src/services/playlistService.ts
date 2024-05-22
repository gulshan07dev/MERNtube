import axiosInstance from "@/helper/axiosInstance";

class PlaylistService {
  async createPlaylist(data: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) {
    return await axiosInstance.post("/playlists", data);
  }

  async getUserPlaylists({
    userId,
    queryParams,
  }: {
    userId: string;
    queryParams: { page?: number; limit?: number; videoId?: string };
  }) {
    return await axiosInstance.get(`/playlists/user/${userId}`, {
      params: queryParams,
    });
  }

  async getPlaylist(playlistId: string) {
    return await axiosInstance.get(`/playlists/${playlistId}`);
  }

  async getUserPlaylistVideos({
    playlistId,
    queryParams,
  }: {
    playlistId: string;
    queryParams: {
      page?: number;
      limit?: number;
      orderBy?: "acc" | "desc";
      sortBy?: "createdAt" | "views";
      sortType?: "acc" | "desc";
    };
  }) {
    return await axiosInstance.get(`/playlists/${playlistId}/videos`, {
      params: queryParams,
    });
  }

  async addVideoToPlaylist({
    playlistId,
    videoId,
  }: {
    playlistId: string;
    videoId: string;
  }) {
    return await axiosInstance.post(`/playlists/${playlistId}/${videoId}`);
  }

  async removeVideoFromPlaylist({
    playlistId,
    videoId,
  }: {
    playlistId: string;
    videoId: string;
  }) {
    return await axiosInstance.delete(`/playlists/${playlistId}/${videoId}`);
  }

  async deletePlaylist(playlistId: string) {
    return await axiosInstance.delete(`/playlists/${playlistId}`);
  }

  async updatePlaylist({
    playlistId,
    data,
  }: {
    playlistId: string;
    data: { name: string; description: string; isPrivate: boolean };
  }) {
    return await axiosInstance.patch(`/playlists/${playlistId}`, data);
  }
}

const playlistService = new PlaylistService();
export default playlistService;
