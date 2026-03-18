import { FeedImage } from "@/lib/types";
import { apiClient } from "@/lib/api/axios";
import {
  asArray,
  filterFallbackImagesByQuery,
  getFallbackImages,
  getRequestData,
  normalizeImage,
  withCategoryFallback,
} from "@/lib/api/shared";

type ListImagesOptions = {
  categoryId?: string | null;
  tagId?: string | null;
  page?: number;
  limit?: number;
};

export async function listImages(
  options: ListImagesOptions = {},
): Promise<FeedImage[]> {
  const { categoryId, tagId, page = 1, limit = 10 } = options;
  
  if ((categoryId && categoryId.toString().includes("mock")) || (tagId && tagId.toString().includes("mock"))) {
    return getFallbackImages(page, limit);
  }

  const params = new URLSearchParams();
  if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
  if (tagId) params.append("tagId", tagId);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const query = `?${params.toString()}`;

  try {
    const data = await getRequestData<unknown[]>(`/images${query}`);
    const images = asArray<unknown>(data)
      .map((image, index) => normalizeImage(image, index))
      .filter((image): image is FeedImage => Boolean(image));

    if (images.length === 0) {
      return getFallbackImages(page, limit);
    }

    return withCategoryFallback(images);
  } catch {
    return getFallbackImages(page, limit);
  }
}

export async function searchImagesByQuery(searchTerm: string): Promise<FeedImage[]> {
  const query = searchTerm.trim();
  if (!query) {
    return listImages();
  }

  try {
    const data = await getRequestData<unknown[]>(
      `/images/search?search=${encodeURIComponent(query)}`,
    );
    const images = asArray<unknown>(data)
      .map((image, index) => normalizeImage(image, index))
      .filter((image): image is FeedImage => Boolean(image));

    if (images.length === 0) {
      return filterFallbackImagesByQuery(query);
    }

    return withCategoryFallback(images);
  } catch {
    return filterFallbackImagesByQuery(query);
  }
}

export async function listImagesByCategory(categoryId: string): Promise<FeedImage[]> {
  return listImages({ categoryId });
}

export async function createImage(data: {
  name: string;
  categoryId: string | number;
  tagIds?: (string | number)[];
}): Promise<FeedImage | null> {
  try {
    const response = await apiClient.post("/images", data);
    const image = normalizeImage(response.data?.data?.image, 0);
    return image;
  } catch (error) {
    console.error("Failed to create image:", error);
    return null;
  }
}

export async function uploadImage(
  imageId: string | number,
  file: File,
): Promise<{ url: string } | null> {
  try {
    const formData = new FormData();
    formData.append("imageId", imageId.toString());
    formData.append("file", file);

    const response = await apiClient.put("/images/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return null;
  }
}
