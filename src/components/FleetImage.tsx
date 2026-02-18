import { useState, useEffect } from "react";
import { getFleetImageUrl } from "@/lib/imageUtils";
import { Loader2 } from "lucide-react";

interface FleetImageProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Renders a fleet image using a signed URL.
 * Handles both legacy public URLs and new storage paths.
 */
export const FleetImage = ({ src, alt = "", className = "" }: FleetImageProps) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      const signed = await getFleetImageUrl(src);
      if (!cancelled) setUrl(signed);
    };
    void resolve();
    return () => { cancelled = true; };
  }, [src]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <img src={url} alt={alt} className={className} />;
};
