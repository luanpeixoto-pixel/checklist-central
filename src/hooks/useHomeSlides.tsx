import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HomeSlide {
  id: string;
  image_url: string;
  redirect_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHomeSlides = (adminMode = false) => {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("home_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      if (import.meta.env.DEV) console.error("Error fetching slides:", error);
    } else {
      setSlides((data as HomeSlide[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("home-slides")
      .upload(fileName, file);

    if (error) {
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("home-slides")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const createSlide = async (data: { image_url: string; redirect_url?: string; display_order: number }) => {
    const { error } = await supabase.from("home_slides").insert(data as any);
    if (error) {
      toast.error("Erro ao criar slide");
      throw error;
    }
    toast.success("Slide criado com sucesso");
    await fetchSlides();
  };

  const updateSlide = async (id: string, data: Partial<HomeSlide>) => {
    const { error } = await supabase.from("home_slides").update(data as any).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar slide");
      throw error;
    }
    toast.success("Slide atualizado");
    await fetchSlides();
  };

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from("home_slides").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir slide");
      throw error;
    }
    toast.success("Slide excluído");
    await fetchSlides();
  };

  const activeSlides = slides.filter((s) => s.is_active);

  return { slides, activeSlides, loading, createSlide, updateSlide, deleteSlide, uploadImage, refetch: fetchSlides };
};
