"use client";

import { useState, useEffect } from "react";
import { FeedImage } from "@/lib/types";
import { ImageCard } from "@/components/feed/image-card";

type ImageGridProps = {
  images: FeedImage[];
  activeTagId: number | null;
  onTagSelect: (tagId: number, tagName: string) => void;
};

function useColumnsCount() {
  const [cols, setCols] = useState<number>(1);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= 1280) setCols(4);
      else if (width >= 1024) setCols(3);
      else if (width >= 640) setCols(2);
      else setCols(1);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return cols;
}

export function ImageGrid({
  images,
  activeTagId,
  onTagSelect,
}: ImageGridProps) {
  const numCols = useColumnsCount();

  const cols = Array.from<FeedImage, FeedImage[]>({ length: numCols }, () => []);
  images.forEach((img, index) => {
    cols[index % numCols].push(img);
  });

  return (
    <div className="flex gap-5">
      {cols.map((colImages, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col gap-5">
          {colImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              activeTagId={activeTagId}
              onTagSelect={onTagSelect}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
