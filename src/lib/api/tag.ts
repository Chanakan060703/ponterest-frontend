import { FeedTag } from "@/lib/types";
import { apiClient } from "@/lib/api/axios";
import { asArray, getRequestData } from "@/lib/api/shared";

const normalizeTagRecord = (value: unknown, index: number): FeedTag | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : "";
  if (!name) {
    return null;
  }

  const id =
    typeof record.id === "number" ? record.id : -(index + 1);

  return { id, name };
};

export async function listTags(): Promise<FeedTag[]> {
  try {
    const data = await getRequestData<unknown[]>("/tags");
    return asArray<unknown>(data)
      .map((tag, index) => normalizeTagRecord(tag, index))
      .filter((tag): tag is FeedTag => Boolean(tag));
  } catch {
    return [];
  }
}

export async function createTag(name: string): Promise<FeedTag | null> {
  try {
    const response = await apiClient.post("/tags", { name });
    const tag = response.data?.data?.tag;
    return tag ? { id: tag.id, name: tag.name } : null;
  } catch (error) {
    console.error("Failed to create tag:", error);
    return null;
  }
}
