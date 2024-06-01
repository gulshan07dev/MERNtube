import axiosInstance from "@/helper/axiosInstance";

class FeedbackService {
  async sendFeedback(query: string) {
    return  axiosInstance.post("/feedbacks", { query });
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
