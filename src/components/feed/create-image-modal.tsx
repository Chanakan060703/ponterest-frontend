"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Plus, Search, Loader2 } from "lucide-react";
import {
  createImage,
  uploadImage,
  listCategories,
  listTags,
  createTag
} from "@/lib/api";
import { FeedCategory, FeedTag } from "@/lib/types";
import { toast } from "sonner";

type CreateImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateImageModal({ isOpen, onClose }: CreateImageModalProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [allTags, setAllTags] = useState<FeedTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<FeedTag[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      void loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    const [cats, tags] = await Promise.all([listCategories(), listTags()]);
    setCategories(cats);
    setAllTags(tags);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const toggleTag = (tag: FeedTag) => {
    setSelectedTags((current) =>
      current.some((t) => t.id === tag.id)
        ? current.filter((t) => t.id !== tag.id)
        : [...current, tag],
    );
  };

  const handleAddCustomTag = async () => {
    const trimmed = tagSearch.trim();
    if (!trimmed) return;

    setIsAddingTag(true);
    try {
      const existing = allTags.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        if (!selectedTags.some((t) => t.id === existing.id)) {
          setSelectedTags([...selectedTags, existing]);
        }
      } else {
        const newTag = await createTag(trimmed);
        if (newTag) {
          setAllTags([...allTags, newTag]);
          setSelectedTags([...selectedTags, newTag]);
        }
      }
      setTagSearch("");
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedCategoryId || !file) {
      toast.error("Please fill in all required fields and select an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const image = await createImage({
        name,
        categoryId: selectedCategoryId,
        tagIds: selectedTags.map((t) => t.id),
      });

      if (image && file) {
        const uploaded = await uploadImage(image.id, file);
        if (!uploaded) {
          toast.error("Image metadata was created, but the file upload failed.");
          return;
        }

        toast.success("Image created and uploaded successfully!");
        onClose();
        resetForm();
        window.location.reload(); // Refresh to show new image
      } else {
        toast.error("Failed to create image entry.");
      }
    } catch (error) {
      toast.error("An error occurred during creation.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedCategoryId(null);
    setSelectedTags([]);
    setFile(null);
    setPreviewUrl(null);
    setTagSearch("");
  };

  if (!isOpen) return null;

  const filteredTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTags.some((t) => t.id === tag.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all animate-in fade-in">
      <div className="relative flex min-h-[500px] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white lg:flex-row">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white lg:text-black lg:hover:bg-black/5 lg:hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Left Side: Upload Area */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f0f0f0] p-8 lg:w-1/2">
          {previewUrl ? (
            <div className="relative h-full w-full max-h-[600px] overflow-hidden rounded-2xl group">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
              <button
                onClick={() => { setFile(null); setPreviewUrl(null); }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"
              >
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                  Change Image
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-black/10 bg-black/5 transition hover:bg-black/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                <Upload className="text-[#767676]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-black">Click to upload</p>
                <p className="mt-1 text-sm text-[#767676]">Recommendation: Use high-quality .jpg less than 20MB</p>
              </div>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Right Side: Form Area */}
        <div className="flex flex-1 flex-col p-8 lg:w-1/2">
          <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6">
            <h2 className="text-2xl font-bold">Create new image</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#767676]">Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add your title"
                className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E60023] focus:ring-1 focus:ring-[#E60023]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#767676]">Category</label>
              <select
                value={selectedCategoryId ?? ""}
                onChange={(e) =>
                  setSelectedCategoryId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E60023] focus:ring-1 focus:ring-[#E60023]"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-2 overflow-hidden">
              <label className="text-sm font-medium text-[#767676]">Tags</label>
              
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 rounded-full bg-[#E60023] px-3 py-1 text-sm text-white"
                  >
                    #{tag.name}
                    <button type="button" onClick={() => toggleTag(tag)} className="hover:text-black/50">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Search & Add */}
              <div className="relative">
                <div className="flex items-center gap-2 rounded-xl border border-black/10 px-3 transition-all focus-within:border-[#E60023] focus-within:ring-1 focus-within:ring-[#E60023]">
                  <Search size={18} className="text-[#767676]" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Search or add tags"
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                  />
                  {tagSearch && (
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      disabled={isAddingTag}
                      className="text-sm font-semibold text-[#E60023] hover:underline disabled:opacity-50"
                    >
                      {isAddingTag ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </button>
                  )}
                </div>

                {/* Tag Suggestions Dropdown */}
                {tagSearch && filteredTags.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-40 overflow-y-auto rounded-xl border border-black/5 bg-white p-2 shadow-xl">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => { toggleTag(tag); setTagSearch(""); }}
                        className="flex w-full items-center px-3 py-2 text-sm transition hover:bg-black/5 rounded-lg"
                      >
                        <Plus size={14} className="mr-2 text-[#767676]" />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-auto flex w-full items-center justify-center rounded-xl bg-[#E60023] py-4 font-bold text-white transition hover:bg-[#ad081b] disabled:bg-[#ad081b]/50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
