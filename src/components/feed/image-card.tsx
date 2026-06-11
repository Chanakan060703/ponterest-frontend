import { FeedImage } from "@/lib/types";
import { Download, Heart, Maximize2 } from "lucide-react";

type ImageCardProps = {
  image: FeedImage;
  activeTagId: number | null;
  onTagSelect: (tagId: number, tagName: string) => void;
  onImageSelect: (image: FeedImage) => void;
  showFavoriteAction?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (image: FeedImage) => void;
};

export function ImageCard({
  image,
  activeTagId,
  onTagSelect,
  onImageSelect,
  showFavoriteAction = false,
  isFavorite = false,
  onFavoriteToggle,
}: ImageCardProps) {
  return (
    <article className="mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_22px_60px_rgba(34,23,15,0.08)]">
      <button
        type="button"
        onClick={() => onImageSelect(image)}
        className="group relative block w-full overflow-hidden bg-[#efe7e1] text-left"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        aria-label={`View ${image.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.imageUrl}
          alt={image.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/45 via-black/0 to-black/20 p-3 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="line-clamp-2 max-w-[70%] rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#24170f] shadow-sm">
            {image.title}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#24170f] shadow-sm">
            <Maximize2 size={17} />
          </span>
        </div>
      </button>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onImageSelect(image)}
            className="line-clamp-2 text-left text-sm font-semibold text-[#24170f] transition hover:text-[#1f4d3c]"
          >
            {image.title}
          </button>
          <div className="flex shrink-0 items-center gap-2">
            {showFavoriteAction ? (
              <button
                type="button"
                onClick={() => onFavoriteToggle?.(image)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full transition",
                  isFavorite
                    ? "bg-[#ffe3e8] text-[#c9184a]"
                    : "bg-[#f6efe9] text-[#624d40] hover:bg-[#ece0d6]",
                ].join(" ")}
                aria-label={isFavorite ? `Remove ${image.title} from favorites` : `Add ${image.title} to favorites`}
                aria-pressed={isFavorite}
              >
                <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onImageSelect(image)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe9] text-[#624d40] transition hover:bg-[#ece0d6]"
              aria-label={`Download ${image.title}`}
            >
              <Download size={16} />
            </button>
          </div>
        </div>
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
