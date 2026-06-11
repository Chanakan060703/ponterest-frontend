import { FeedImage } from "@/lib/types";
import { apiClient } from "@/lib/api/axios";
import {
  asArray,
  getRequestData,
  normalizeImage,
  withCategoryFallback,
} from "@/lib/api/shared";

export async function listFavorites(): Promise<FeedImage[]> {
  const data = await getRequestData<unknown[]>("/favorites");
  const images = asArray<unknown>(data)
    .map((image, index) => normalizeImage(image, index))
    .filter((image): image is FeedImage => Boolean(image));

  return withCategoryFallback(images);
}

export async function addFavorite(imageId: number): Promise<FeedImage | null> {
  const response = await apiClient.post(`/favorites/${imageId}`);
  const image = normalizeImage(response.data?.data?.image, 0);
  return image ? withCategoryFallback([image])[0] : null;
}

export async function removeFavorite(imageId: number): Promise<number | null> {
  const response = await apiClient.delete(`/favorites/${imageId}`);
  const removedId = response.data?.data?.imageId;
  return typeof removedId === "number" ? removedId : null;
}
