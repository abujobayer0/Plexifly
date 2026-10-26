import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// Natural pixel size of an image file.
export async function getImageSize(file: File) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

// Uploads an image to Convex file storage and resolves to its public URL.
export const useImageUpload = () => {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const getUrl = useMutation(api.images.getUrl);

  return useCallback(
    async (file: File) => {
      const postUrl = await generateUploadUrl();
      const response = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json();
      return await getUrl({ storageId });
    },
    [generateUploadUrl, getUrl]
  );
};
