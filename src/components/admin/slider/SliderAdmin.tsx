import { useState, useRef } from "react";
import { Plus, Trash2, ExternalLink, GripVertical, Eye, EyeOff, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useHomeSlides, type HomeSlide } from "@/hooks/useHomeSlides";
import { Loader2 } from "lucide-react";

export const SliderAdmin = () => {
  const { slides, loading, createSlide, updateSlide, deleteSlide, uploadImage } = useHomeSlides(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSlide = async (file: File) => {
    if (slides.length >= 5) {
      return;
    }
    setUploading(true);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      await createSlide({
        image_url: imageUrl,
        redirect_url: "",
        display_order: slides.length,
      });
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAddSlide(file);
      e.target.value = "";
    }
  };

  const handleUpdateRedirect = async (slide: HomeSlide, url: string) => {
    await updateSlide(slide.id, { redirect_url: url });
  };

  const handleToggleActive = async (slide: HomeSlide) => {
    await updateSlide(slide.id, { is_active: !slide.is_active });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir este slide?")) {
      await deleteSlide(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Slides da Home</h3>
          <p className="text-sm text-muted-foreground">
            Configure até 5 imagens para o carrossel ({slides.length}/5)
          </p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={slides.length >= 5 || uploading}
          size="sm"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Adicionar Slide
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {slides.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
            <p>Nenhum slide configurado</p>
            <p className="text-xs">Adicione imagens para exibir no carrossel da home</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={!slide.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center pt-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium ml-1">{index + 1}</span>
                </div>

                <div className="w-32 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={slide.image_url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">URL de Redirecionamento</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        defaultValue={slide.redirect_url || ""}
                        placeholder="https://exemplo.com"
                        className="h-8 text-sm"
                        onBlur={(e) => handleUpdateRedirect(slide, e.target.value)}
                      />
                      {slide.redirect_url && (
                        <a
                          href={slide.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className="text-muted-foreground hover:text-foreground"
                    title={slide.is_active ? "Desativar" : "Ativar"}
                  >
                    {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
