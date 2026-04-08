import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import {
  CreateLinkRequest,
  CreateLinkResponse,
  DeleteLinkResponse,
  ListLinksResponse,
  ReorderLinksRequest,
  ReorderLinksResponse,
  UpdateLinkRequest,
  UpdateLinkResponse,
} from "@/app/types/links";

const LINKS_QUERY_KEY = ["links"];

export const useGetLinks = () => {
  return useQuery<ListLinksResponse, Error>({
    queryKey: LINKS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.getClient().get("/links");
      return response.data;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateLink = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateLinkResponse, Error, CreateLinkRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.getClient().post("/links", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};

export const useUpdateLink = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateLinkResponse,
    Error,
    { id: string; data: UpdateLinkRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.getClient().patch(`/links/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};

export const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteLinkResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.getClient().delete(`/links/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};

export const useReorderLinks = () => {
  const queryClient = useQueryClient();

  return useMutation<ReorderLinksResponse, Error, ReorderLinksRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .patch("/links/reorder", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};
