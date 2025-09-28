import { useMutation } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";

export interface UploadResponse {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export interface UploadError {
  message: string;
}

export const useUploadImage = () => {
  const getApi = useAuthenticatedApi();

  return useMutation<UploadResponse, UploadError, File>({
    mutationFn: async (file: File) => {
      const api = await getApi();

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });
};

export const useUploadMultipleImages = () => {
  const getApi = useAuthenticatedApi();

  return useMutation<UploadResponse[], UploadError, File[]>({
    mutationFn: async (files: File[]) => {
      const api = await getApi();

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      });

      return Promise.all(uploadPromises);
    },
    onError: (error) => {
      console.error("Multiple upload failed:", error);
    },
  });
};
