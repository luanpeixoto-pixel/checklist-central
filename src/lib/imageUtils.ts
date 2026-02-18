import { supabase } from "@/integrations/supabase/client";

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const WEBP_QUALITY = 0.82;

/**
 * Convert a File (image) to WebP using Canvas API.
 * Returns a Blob in image/webp format.
 */
export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("WebP conversion failed"));
        },
        "image/webp",
        WEBP_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

/**
 * Extract the storage path from a stored reference.
 * Handles both full public URLs (legacy) and plain paths.
 */
const extractStoragePath = (ref: string): string | null => {
  if (ref.includes("/fleet-images/")) {
    return ref.split("/fleet-images/")[1] ?? null;
  }
  // Already a plain path
  if (ref && !ref.startsWith("http")) {
    return ref;
  }
  return null;
};

/**
 * Upload a file to the fleet-images bucket after converting to WebP.
 * Returns the storage path (NOT a public URL).
 */
export const uploadFleetImage = async (
  file: File,
  userId: string,
  folder: "maintenance" | "fuel" | "checklist",
): Promise<string> => {
  const webpBlob = await convertToWebP(file);
  const fileName = `${userId}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await supabase.storage
    .from("fleet-images")
    .upload(fileName, webpBlob, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) throw error;

  // Return the storage path instead of a public URL
  return fileName;
};

/**
 * Get a signed URL for a fleet image (valid for 1 hour).
 */
export const getFleetImageUrl = async (ref: string): Promise<string | null> => {
  const path = extractStoragePath(ref);
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("fleet-images")
    .createSignedUrl(path, 3600); // 1 hour

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
};

/**
 * Get signed URLs for multiple fleet images.
 */
export const getFleetImageUrls = async (refs: string[]): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  const paths = refs.map((ref) => extractStoragePath(ref)).filter(Boolean) as string[];

  if (paths.length === 0) return results;

  const { data, error } = await supabase.storage
    .from("fleet-images")
    .createSignedUrls(paths, 3600);

  if (error || !data) return results;

  data.forEach((item, index) => {
    if (item.signedUrl) {
      results[refs[index]] = item.signedUrl;
    }
  });

  return results;
};

/**
 * Delete an image from fleet-images bucket by its stored reference.
 */
export const deleteFleetImage = async (ref: string): Promise<void> => {
  const bucketPath = extractStoragePath(ref);
  if (!bucketPath) return;

  const { error } = await supabase.storage.from("fleet-images").remove([bucketPath]);
  if (error && import.meta.env.DEV) {
    console.error("Error deleting image:", error);
  }
};
