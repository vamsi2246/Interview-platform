import axiosInstance from "../lib/axios";

export const mockInterviewApi = {
  createInterview: async ({ role, techStack, experience }) => {
    const res = await axiosInstance.post("/mock-interview", { role, techStack, experience });
    return res.data;
  },

  getMyInterviews: async () => {
    const res = await axiosInstance.get("/mock-interview");
    return res.data;
  },

  getInterviewById: async (id) => {
    const res = await axiosInstance.get(`/mock-interview/${id}`);
    return res.data;
  },

  saveAnswer: async ({ interviewId, questionId, answerText }) => {
    const res = await axiosInstance.post(`/mock-interview/${interviewId}/answer`, {
      questionId,
      answerText,
    });
    return res.data;
  },

  generateFeedback: async (interviewId) => {
    const res = await axiosInstance.post(`/mock-interview/${interviewId}/feedback`);
    return res.data;
  },
};
