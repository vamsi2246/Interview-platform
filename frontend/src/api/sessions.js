import axiosInstance from "../lib/axios";

export const sessionApi = {
    getStreamToken: async () => {
        const res = await axiosInstance.get("/session/stream-token");
        return res.data;
    },

    createSession: async (data) => {
        const res = await axiosInstance.post("/session", data);
        return res.data;
    },

    getActiveSessions: async () => {
        const res = await axiosInstance.get("/session/active");
        return res.data;
    },

    getMyRecentSessions: async () => {
        const res = await axiosInstance.get("/session/my-recent");
        return res.data;
    },

    getSessionById: async (id) => {
        const res = await axiosInstance.get(`/session/${id}`);
        return res.data;
    },

    joinSession: async (id) => {
        const res = await axiosInstance.post(`/session/${id}/join`);
        return res.data;
    },

    endSession: async (id) => {
        const res = await axiosInstance.post(`/session/${id}/end`);
        return res.data;
    },

    deleteSession: async (id) => {
        const res = await axiosInstance.delete(`/session/${id}`);
        return res.data;
    },
};
