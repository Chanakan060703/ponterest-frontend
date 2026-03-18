import { FeedImage } from "@/lib/types";
import { ImageCard } from "@/components/feed/image-card";

type ImageGridProps = {
  images: FeedImage[];
  activeTagId: string | null;
  onTagSelect: (tagId: string, tagName: string) => void;
};

export function ImageGrid({
  images,
  activeTagId,
  onTagSelect,
}: ImageGridProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          activeTagId={activeTagId}
          onTagSelect={onTagSelect}
        />
      ))}
    </div>
  );
}
