import { FeedCategory } from "@/lib/types";

type CategoryTabsProps = {
  categories: FeedCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
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
                  ? "bg-[#22170f] text-[#f7efe8] shadow-[0_14px_30px_rgba(34,23,15,0.2)]"
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
