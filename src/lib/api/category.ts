import { FeedCategory } from "@/lib/types";
import {
  asArray,
  getFallbackCategories,
  getRequestData,
  normalizeCategory,
} from "@/lib/api/shared";

export async function listCategories(): Promise<FeedCategory[]> {
  try {
    const data = await getRequestData<unknown[]>("/categories");
    const categories = asArray<unknown>(data)
      .map((category, index) => normalizeCategory(category, index))
      .filter((category): category is FeedCategory => Boolean(category));

    if (categories.length === 0) {
      return getFallbackCategories();
    }

    return [{ id: "all", name: "All", source: "api" }, ...categories];
  } catch {
    return getFallbackCategories();
  }
}
