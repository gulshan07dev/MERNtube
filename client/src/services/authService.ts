import axiosInstance from "@/helper/axiosInstance";

class AuthService {
  static async registerUser(data: {
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

  static async loginUser(data: { usernameOrEmail: string; password: string }) {
    return await axiosInstance.post("/users/login", data);
  }

  static async logoutUser() {
    return await axiosInstance.get("/users/logout");
  }

  static async refreshAccessToken() {
    return await axiosInstance.post("/users/refresh-token");
  }

  static async changeUserPassword(data: {
    oldPassword: string;
    newPassword: string;
  }) {
    return await axiosInstance.patch("/users/change-password", data);
  }

  static async changeAccountDetails(data: {
    fullName?: string;
    username?: string;
  }) {
    return await axiosInstance.patch("/users/change-account", data);
  }

  static async changeUserAvatar(data: { avatar: File | null }) {
    return await axiosInstance.patch("/users/change-avatar", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static async changeCoverImage(data: { coverImage: File | null }) {
    return await axiosInstance.patch("/users/change-coverImage", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static async getCurrentUser() {
    return await axiosInstance.get("/users/current-user");
  }

  static async getChannel(data: { username: string }) {
    return await axiosInstance.get(`/users/c/${data.username}`);
  }
}

export default AuthService;
