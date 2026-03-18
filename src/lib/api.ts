import {
  ApiEnvelope,
  FeedCategory,
  FeedImage,
  FeedTag,
  UnknownRecord,
} from "@/lib/types";
import { getMockCategories, getMockFeedImages } from "@/lib/mock-data";

const API_BASE_URL = "http://localhost:5001";

const DEFAULT_SIZE = { width: 600, height: 800 };

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : []);

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

const normalizeCategory = (value: unknown, index: number): FeedCategory | null => {
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

const normalizeImage = (value: unknown, index: number): FeedImage | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id ?? value.imageId, `api-image-${index + 1}`);
  const title = asString(value.name ?? value.title, `Image ${index + 1}`);
  const width = asNumber(value.width, DEFAULT_SIZE.width);
  const height = asNumber(value.height, DEFAULT_SIZE.height + (index % 4) * 60);
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
  return (envelope.data ?? null) as T | null;
};

async function apiRequest<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  return unwrapData<T>(payload);
}

export async function fetchCategories(): Promise<FeedCategory[]> {
  try {
    const data = await apiRequest<unknown[]>("/categories");
    const categories = asArray<unknown>(data)
      .map((category, index) => normalizeCategory(category, index))
      .filter((category): category is FeedCategory => Boolean(category));

    if (categories.length === 0) {
      return getMockCategories();
    }

    return [{ id: "all", name: "All", source: "api" }, ...categories];
  } catch {
    return getMockCategories();
  }
}

type FetchImageOptions = {
  categoryId?: string | null;
};

const withAllCategoryIfMissing = (images: FeedImage[]): FeedImage[] =>
  images.map((image) => ({
    ...image,
    categoryName: image.categoryName || "Uncategorized",
  }));

export async function fetchImages(options: FetchImageOptions = {}): Promise<FeedImage[]> {
  const query = options.categoryId && options.categoryId !== "all"
    ? `?categoryId=${encodeURIComponent(options.categoryId)}`
    : "";

  try {
    const data = await apiRequest<unknown[]>(`/images${query}`);
    const images = asArray<unknown>(data)
      .map((image, index) => normalizeImage(image, index))
      .filter((image): image is FeedImage => Boolean(image));

    if (images.length === 0) {
      return getMockFeedImages();
    }

    return withAllCategoryIfMissing(images);
  } catch {
    return getMockFeedImages();
  }
}

export async function searchImages(searchTerm: string): Promise<FeedImage[]> {
  const query = searchTerm.trim();
  if (!query) {
    return fetchImages();
  }

  try {
    const data = await apiRequest<unknown[]>(
      `/images/search?search=${encodeURIComponent(query)}`,
    );
    const images = asArray<unknown>(data)
      .map((image, index) => normalizeImage(image, index))
      .filter((image): image is FeedImage => Boolean(image));

    if (images.length === 0) {
      const fallback = getMockFeedImages().filter((image) => {
        const lowerQuery = query.toLowerCase();
        return (
          image.title.toLowerCase().includes(lowerQuery) ||
          image.categoryName.toLowerCase().includes(lowerQuery) ||
          image.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))
        );
      });

      return fallback.length > 0 ? fallback : getMockFeedImages();
    }

    return withAllCategoryIfMissing(images);
  } catch {
    const lowerQuery = query.toLowerCase();
    const fallback = getMockFeedImages().filter((image) => {
      return (
        image.title.toLowerCase().includes(lowerQuery) ||
        image.categoryName.toLowerCase().includes(lowerQuery) ||
        image.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))
      );
    });

    return fallback.length > 0 ? fallback : getMockFeedImages();
  }
}
