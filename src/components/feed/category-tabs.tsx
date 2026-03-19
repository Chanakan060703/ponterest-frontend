import { FeedCategory } from "@/lib/types";

type CategoryTabsProps = {
  categories: FeedCategory[];
  activeCategoryId: number | null;
  onSelect: (categoryId: number | null) => void;
};

export function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={[
            "rounded-full px-4 py-2.5 text-sm font-medium transition",
            activeCategoryId === null
              ? "bg-[#22170f] text-[#f7efe8]"
              : "border border-black/5 bg-white/80 text-[#684f40] hover:bg-[#f5eee7]",
          ].join(" ")}
        >
          All
        </button>
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "rounded-full px-4 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[#22170f] text-[#f7efe8]"
                  : "border border-black/5 bg-white/80 text-[#684f40] hover:bg-[#f5eee7]",
              ].join(" ")}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
