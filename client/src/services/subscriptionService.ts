import axiosInstance from "@/helper/axiosInstance"

class SubscriptionService {
  async toggleSubscription(channelId: string) {
    return await axiosInstance.post(`/subscriptions/c/${channelId}`);
  }

  async getUserChannelSubscribers({
    channelId,
    queryParams,
  }: {
    channelId: string;
    queryParams: { page?: number; limit?: number };
  }) {
    return await axiosInstance.get(`/subscriptions/c/${channelId}`, {
      params: queryParams,
    });
  }

  async getSubscribedChannels({
    subscriberId,
    queryParams,
  }: {
    subscriberId: string;
    queryParams: { page?: number; limit?: number };
  }) {
    return await axiosInstance.get(`/subscriptions/u/${subscriberId}`, {
      params: queryParams,
    });
  }
}

const subscriptionService = new SubscriptionService()
export default subscriptionService