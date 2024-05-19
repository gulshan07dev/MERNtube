import axiosInstance from "@/helper/axiosInstance";

class AuthService {
  async registerUser(data: {
    fullName: string;
    email: string;
    password: string;
    avatar?: File | null;
    coverImage?: File | null;
  }) {
    return await axiosInstance.post("/users/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async loginUser(data: { usernameOrEmail: string; password: string }) {
    return await axiosInstance.post("/users/login", data);
  }

  async logoutUser() {
    return await axiosInstance.get("/users/logout");
  }

  async refreshAccessToken() {
    return await axiosInstance.post("/users/refresh-token");
  }

  async changeUserPassword(data: { oldPassword: string; newPassword: string }) {
    return await axiosInstance.patch("/users/change-password", data);
  }

  async changeAccountDetails(data: { fullName?: string; username?: string }) {
    return await axiosInstance.patch("/users/change-account", data);
  }

  async changeUserAvatar(data: { avatar: File | null }) {
    return await axiosInstance.patch("/users/change-avatar", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async changeCoverImage(data: { coverImage: File | null }) {
    return await axiosInstance.patch("/users/change-coverImage", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async getCurrentUser() {
    return await axiosInstance.get("/users/current-user");
  }

  async getChannel(data: { username: string }) {
    return await axiosInstance.get(`/users/c/${data.username}`);
  }
}

const authService = new AuthService();
export default authService;
