import axiosInstance from "@/helper/axiosInstance";

class TweetService {
  async createTweet(data: { content: string }) {
    return await axiosInstance.post("/tweets", data);
  }

  async updateTweet({
    data,
    tweetId,
  }: {
    data: { content: string };
    tweetId: string;
  }) {
    return await axiosInstance.patch(`/tweets/${tweetId}`, data);
  }

  async deleteTweet(tweetId: string) {
    return await axiosInstance.delete(`/tweets/${tweetId}`);
  }

  async getTweetById(tweetId: string) {
    return await axiosInstance.get(`/tweets/${tweetId}`);
  }

  async getUserTweets({
    userId,
    queryParams,
  }: {
    userId: string;
    queryParams: { page?: number; limit?: number };
  }) {
    return await axiosInstance.get(`/tweets/user/${userId}`, {
      params: queryParams,
    });
  }
}

const tweetService = new TweetService();
export default tweetService;
