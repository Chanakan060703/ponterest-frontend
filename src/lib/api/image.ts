import { FeedImage } from "@/lib/types";
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
};

export async function listImages(
  options: ListImagesOptions = {},
): Promise<FeedImage[]> {
  const { categoryId } = options;
  
  if (categoryId && categoryId.toString().includes("mock")) {
    return getFallbackImages();
  }

  const query =
    categoryId && categoryId !== "all"
      ? `?categoryId=${encodeURIComponent(categoryId)}`
      : "";

  try {
    const data = await getRequestData<unknown[]>(`/images${query}`);
    const images = asArray<unknown>(data)
      .map((image, index) => normalizeImage(image, index))
      .filter((image): image is FeedImage => Boolean(image));

    if (images.length === 0) {
      return getFallbackImages();
    }

    return withCategoryFallback(images);
  } catch {
    return getFallbackImages();
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
