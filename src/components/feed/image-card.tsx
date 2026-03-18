import { FeedImage } from "@/lib/types";

type ImageCardProps = {
  image: FeedImage;
  activeTagId: string | null;
  onTagSelect: (tagId: string, tagName: string) => void;
};

export function ImageCard({
  image,
  activeTagId,
  onTagSelect,
}: ImageCardProps) {
  return (
    <article className="mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_22px_60px_rgba(34,23,15,0.08)]">
      <div className="overflow-hidden bg-[#efe7e1]">
        {/* Intentionally using a native img because backend URLs may come from varying hosts. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.imageUrl}
          alt={image.title}
          width={image.width}
          height={image.height}
          className="h-auto w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#24170f]">
              {image.title}
            </h2>
            <p className="mt-1 text-sm text-[#7d6657]">{image.categoryName}</p>
          </div>
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-[0.18em]",
              image.source === "api"
                ? "bg-[#e3efe9] text-[#1c533f]"
                : "bg-[#f0e6de] text-[#7a5d49]",
            ].join(" ")}
          >
            {image.source}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {image.tags.map((tag) => {
            const isActive = activeTagId === tag.id;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagSelect(tag.id, tag.name)}
                className={[
                  "rounded-full px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-[#22170f] text-[#f7efe8]"
                    : "bg-[#f6efe9] text-[#624d40] hover:bg-[#ece0d6]",
                ].join(" ")}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
