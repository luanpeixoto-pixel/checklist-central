import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFleetImage, deleteFleetImage } from "@/lib/imageUtils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder: "maintenance" | "fuel" | "checklist";
  maxImages?: number;
}

export const ImageUpload = ({ images, onChange, folder, maxImages = 5 }: ImageUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !user) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Máximo de ${maxImages} imagens`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const urls: string[] = [];
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem`);
          continue;
        }
        const url = await uploadFleetImage(file, user.id, folder);
        urls.push(url);
      }

      if (urls.length > 0) {
        onChange([...images, ...urls]);
        toast.success(`${urls.length} imagen${urls.length > 1 ? "s" : ""} enviada${urls.length > 1 ? "s" : ""}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async (url: string) => {
    try {
      await deleteFleetImage(url);
      onChange(images.filter((img) => img !== url));
    } catch {
      toast.error("Erro ao remover imagem");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-[10px]">Adicionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};
