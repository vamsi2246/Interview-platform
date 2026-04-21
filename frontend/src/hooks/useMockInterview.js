import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockInterviewApi } from "../api/mockInterview";

export const useMyInterviews = () =>
  useQuery({
    queryKey: ["myInterviews"],
    queryFn: mockInterviewApi.getMyInterviews,
  });

export const useInterviewById = (id) =>
  useQuery({
    queryKey: ["interview", id],
    queryFn: () => mockInterviewApi.getInterviewById(id),
    enabled: !!id,
  });

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockInterviewApi.createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInterviews"] });
    },
  });
};

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockInterviewApi.saveAnswer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["interview", variables.interviewId] });
    },
  });
};

export const useGenerateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockInterviewApi.generateFeedback,
    onSuccess: (data) => {
      const id = data?.interview?._id;
      if (id) queryClient.invalidateQueries({ queryKey: ["interview", id] });
      queryClient.invalidateQueries({ queryKey: ["myInterviews"] });
    },
  });
};
