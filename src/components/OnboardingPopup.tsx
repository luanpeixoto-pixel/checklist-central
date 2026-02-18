import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CARGO_OPTIONS, SETOR_OPTIONS, TAMANHO_FROTA_OPTIONS } from "@/config/profileOptions";
import { Loader2 } from "lucide-react";

export const OnboardingPopup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    telefone: "",
    empresa: "",
    setor: "",
    cargo: "",
    tamanho_frota: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    if (!user || checked) return;
    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("profile_completed")
        .eq("user_id", user.id)
        .single();
      if (data && !(data as any).profile_completed) {
        setOpen(true);
      }
      setChecked(true);
    };
    check();
  }, [user, checked]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        telefone: form.telefone,
        empresa: form.empresa,
        setor: form.setor,
        cargo: form.cargo,
        tamanho_frota: form.tamanho_frota,
        cidade: form.cidade,
        estado: form.estado,
        profile_completed: true,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil completado!" });
      setOpen(false);
    }
  };

  const handleLater = () => setOpen(false);

  const goToProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete seu cadastro 🎉</DialogTitle>
          <DialogDescription>
            Preencha seus dados para ter uma experiência mais completa.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Telefone</Label>
              <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Empresa</Label>
              <Input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Sua empresa" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Cargo</Label>
              <Select value={form.cargo} onValueChange={(v) => setForm({ ...form, cargo: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CARGO_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Setor</Label>
              <Select value={form.setor} onValueChange={(v) => setForm({ ...form, setor: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {SETOR_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Tamanho da Frota</Label>
              <Select value={form.tamanho_frota} onValueChange={(v) => setForm({ ...form, tamanho_frota: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TAMANHO_FROTA_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Cidade</Label>
              <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Estado</Label>
              <Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} placeholder="UF" maxLength={2} />
            </div>
          </div>
          <div className="flex justify-between pt-3">
            <Button variant="ghost" onClick={handleLater}>Depois</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={goToProfile}>Ver perfil completo</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
