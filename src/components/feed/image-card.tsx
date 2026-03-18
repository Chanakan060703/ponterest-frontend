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
      <div
        className="overflow-hidden bg-[#efe7e1]"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <img
          src={image.imageUrl}
          alt={image.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {image.tags.map((tag, index) => {
            const isActive = activeTagId === tag.id;

            return (
              <button
                key={`${tag.id}-${index}`}
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
