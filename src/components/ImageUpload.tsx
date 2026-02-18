import { useState, useRef, useEffect } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadFleetImage, deleteFleetImage, getFleetImageUrls } from "@/lib/imageUtils";
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
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve signed URLs for display
  useEffect(() => {
    if (images.length === 0) {
      setSignedUrls({});
      return;
    }

    let cancelled = false;
    const resolve = async () => {
      const urls = await getFleetImageUrls(images);
      if (!cancelled) setSignedUrls(urls);
    };
    void resolve();
    return () => { cancelled = true; };
  }, [images]);

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
      const paths: string[] = [];
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem`);
          continue;
        }
        const path = await uploadFleetImage(file, user.id, folder);
        paths.push(path);
      }

      if (paths.length > 0) {
        onChange([...images, ...paths]);
        toast.success(`${paths.length} imagen${paths.length > 1 ? "s" : ""} enviada${paths.length > 1 ? "s" : ""}`);
      }
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async (ref: string) => {
    try {
      await deleteFleetImage(ref);
      onChange(images.filter((img) => img !== ref));
    } catch {
      toast.error("Erro ao remover imagem");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((ref) => (
          <div key={ref} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border">
            {signedUrls[ref] ? (
              <img src={signedUrls[ref]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemove(ref)}
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
