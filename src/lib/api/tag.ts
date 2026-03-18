import { FeedTag } from "@/lib/types";
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
    typeof record.id === "string" || typeof record.id === "number"
      ? String(record.id)
      : `api-tag-${index + 1}`;

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
