import { API_BASE_URL } from "./apiConfig";

export const getImgPath = (path: string): string => {
  if (!path) return "/images/placeholder.jpg";
  if (path.startsWith("http")) return path;

  // Ensure path starts with /
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // If it's a relative backend path and doesn't have /storage/, add it
  // But avoid adding it to local images in /images/ or /assets/
  if (!normalizedPath.startsWith("/storage/") &&
    !normalizedPath.startsWith("/images/") &&
    !normalizedPath.startsWith("/assets/")) {
    normalizedPath = `/storage${normalizedPath}`;
  }

  // If basePath is already in the normalizedPath (shouldn't happen with http check), return as is
  if (normalizedPath.startsWith(API_BASE_URL)) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
};

export const getDataPath = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith(API_BASE_URL)) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
};
