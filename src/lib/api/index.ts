export { apiClient } from "@/lib/api/axios";
export { login, logout, register } from "@/lib/api/auth";
export { listCategories } from "@/lib/api/category";
export {
  createImage,
  listImages,
  listImagesByCategory,
  searchImagesByQuery,
  uploadImage,
} from "@/lib/api/image";
export { createTag, listTags } from "@/lib/api/tag";
