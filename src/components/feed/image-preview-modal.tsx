"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, Loader2, X } from "lucide-react";
import { FeedImage } from "@/lib/types";

type ImagePreviewModalProps = {
  image: FeedImage | null;
  onClose: () => void;
  onTagSelect: (tagId: number, tagName: string) => void;
};

const getImageFileName = (image: FeedImage) => {
  const safeTitle = image.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeTitle || "ponterest-image"}-${Math.abs(image.id)}.jpg`;
};

export function ImagePreviewModal({
  image,
  onClose,
  onTagSelect,
}: ImagePreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null;

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(image.imageUrl);
      if (!response.ok) {
        throw new Error("Image download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getImageFileName(image);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement("a");
      link.href = image.imageUrl;
      link.download = getImageFileName(image);
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15110e]/80 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${image.title}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="grid max-h-[92svh] w-full max-w-6xl overflow-hidden rounded-[1.5rem] bg-[#fbf7f2] shadow-[0_30px_90px_rgba(0,0,0,0.35)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-h-0 items-center justify-center bg-[#1c1713] p-3 sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.title}
            className="max-h-[72svh] w-full rounded-[1rem] object-contain lg:max-h-[86svh]"
          />
        </div>

        <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#806758]">
                {image.categoryName}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#21160f]">
                {image.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5b4638] transition hover:bg-black/5"
              aria-label="Close preview"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {image.tags.map((tag, index) => (
              <button
                key={`${tag.id}-${index}`}
                type="button"
                onClick={() => {
                  onTagSelect(tag.id, tag.name);
                  onClose();
                }}
                className="rounded-full bg-[#eee3d9] px-3 py-1.5 text-sm text-[#5f493c] transition hover:bg-[#dfd0c4]"
              >
                #{tag.name}
              </button>
            ))}
          </div>

          <div className="mt-auto grid gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 rounded-full bg-[#1f4d3c] px-5 py-3 text-sm font-semibold text-[#f8efe6] transition hover:bg-[#173c2f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download size={18} />
              )}
              Download image
            </button>
            <a
              href={image.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-[#5b4638] transition hover:bg-white"
            >
              <ExternalLink size={17} />
              Open original
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
