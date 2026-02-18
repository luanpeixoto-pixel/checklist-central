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
 * Upload a file to the fleet-images bucket after converting to WebP.
 * Returns the public URL.
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

  const { data } = supabase.storage.from("fleet-images").getPublicUrl(fileName);
  return data.publicUrl;
};

/**
 * Delete an image from fleet-images bucket by its public URL.
 */
export const deleteFleetImage = async (publicUrl: string): Promise<void> => {
  const bucketPath = publicUrl.split("/fleet-images/")[1];
  if (!bucketPath) return;

  const { error } = await supabase.storage.from("fleet-images").remove([bucketPath]);
  if (error) console.error("Error deleting image:", error);
};
