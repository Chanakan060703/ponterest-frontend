import { apiClient } from "@/lib/api/axios";
import { getMockCategories, getMockFeedImages } from "@/lib/mock-data";
import {
  ApiEnvelope,
  FeedCategory,
  FeedImage,
  FeedTag,
  UnknownRecord,
} from "@/lib/types";

const DEFAULT_SIZE = { width: 600, height: 800 };

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

export const asArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? value : [];

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : typeof value === "number" ? String(value) : fallback;

const asNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeTag = (value: unknown, index: number, imageId: string): FeedTag | null => {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? { id: `${imageId}-tag-${index + 1}`, name } : null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const rawName = asString(value.name ?? value.tagName ?? value.label);
  if (!rawName) {
    return null;
  }

  return {
    id: asString(value.id ?? value.tagId, `${imageId}-tag-${index + 1}`),
    name: rawName,
  };
};

const getTagList = (record: UnknownRecord, imageId: string): FeedTag[] => {
  const rawTags =
    record.tags ??
    record.tagIds ??
    record.keywords ??
    (isRecord(record.imageTags) ? Object.values(record.imageTags) : record.imageTags);

  return asArray<unknown>(rawTags)
    .map((tag, index) => normalizeTag(tag, index, imageId))
    .filter((tag): tag is FeedTag => Boolean(tag));
};

export const normalizeCategory = (value: unknown, index: number): FeedCategory | null => {
  if (!isRecord(value)) {
    return null;
  }

  const name = asString(value.name ?? value.categoryName);
  if (!name) {
    return null;
  }

  return {
    id: asString(value.id ?? value.categoryId, `api-category-${index + 1}`),
    name,
    source: "api",
  };
};

const buildPlaceholderUrl = (title: string, width: number, height: number) => {
  const label = encodeURIComponent(`${title}\n${width}x${height}`);
  return `https://placehold.co/${width}x${height}/D9E6F2/17324D?text=${label}`;
};

export const normalizeImage = (value: unknown, index: number): FeedImage | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id ?? value.imageId, `api-image-${index + 1}`);
  const title = asString(value.name ?? value.title, `Image ${index + 1}`);
  const width = asNumber(value.width, DEFAULT_SIZE.width);
  const height = asNumber(value.height, DEFAULT_SIZE.height + [0, 300, -200, 500][index % 4]);
  const rawCategory = isRecord(value.category) ? value.category : null;
  const categoryId = asString(
    value.categoryId ?? rawCategory?.id,
    `api-category-${(index % 6) + 1}`,
  );
  const categoryName = asString(
    rawCategory?.name ?? value.categoryName,
    toTitleCase(categoryId.replace(/^api-category-/, "Category ")),
  );
  const tags = getTagList(value, id);
  const imageUrl = asString(value.url ?? value.imageUrl, buildPlaceholderUrl(title, width, height));

  return {
    id,
    title,
    imageUrl,
    categoryId,
    categoryName,
    tags,
    width,
    height,
    source: "api",
  };
};

const unwrapData = <T>(payload: unknown): T | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const envelope = payload as ApiEnvelope<T>;
  const data = envelope.data;

  if (isRecord(data)) {
    const arrayKeys = ["categories", "images", "tags", "users"];
    for (const key of arrayKeys) {
      const potentialArray = data[key];
      if (Array.isArray(potentialArray)) {
        return potentialArray as unknown as T;
      }
    }
    
    const singleKeys = ["image", "category", "tag", "user"];
    for (const key of singleKeys) {
      if (data[key]) {
        return data[key] as unknown as T;
      }
    }
  }

  return (data ?? null) as T | null;
};

export async function getRequestData<T>(path: string): Promise<T | null> {
  const response = await apiClient.get<ApiEnvelope<T>>(path, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

  return unwrapData<T>(response.data);
}

export const withCategoryFallback = (images: FeedImage[]): FeedImage[] =>
  images.map((image) => ({
    ...image,
    categoryName: image.categoryName || "Uncategorized",
  }));

export const getFallbackCategories = () => getMockCategories();

export const getFallbackImages = (page = 1, limit = 10) => {
  const allImages = getMockFeedImages();
  const start = (page - 1) * limit;
  return allImages.slice(start, start + limit);
};

export const filterFallbackImagesByQuery = (query: string) => {
  const lowerQuery = query.toLowerCase();

  const matches = getMockFeedImages().filter((image) => {
    return (
      image.title.toLowerCase().includes(lowerQuery) ||
      image.categoryName.toLowerCase().includes(lowerQuery) ||
      image.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))
    );
  });

  return matches.length > 0 ? matches : getMockFeedImages();
};
