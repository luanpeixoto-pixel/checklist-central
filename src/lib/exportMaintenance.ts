import type { MaintenanceRecord, Vehicle } from "@/types/fleet";
import { supabase } from "@/lib/supabaseClient";
import { trackUserEvent } from "@/lib/eventTracking";

/* -------------------------------------------------------------------------- */
/* Labels                                                                      */
/* -------------------------------------------------------------------------- */

const maintenanceTypeLabels: Record<string, string> = {
  preventiva: "Preventiva",
  corretiva: "Corretiva",
};

const maintenanceGroupLabels: Record<string, string> = {
  ar: "Ar Condicionado",
  direcao: "Direção",
  freio: "Freio",
  limpadores: "Limpadores",
  motor: "Motor",
  pneus: "Pneus",
  outros: "Outros",
};

const statusLabels: Record<string, string> = {
  realizada: "Realizada",
  agendada: "Agendada",
  pendente: "Pendente",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/* -------------------------------------------------------------------------- */
/* CSV Generator                                                               */
/* -------------------------------------------------------------------------- */

export const generateMaintenanceCSV = (records: MaintenanceRecord[], vehicles: Vehicle[]): string => {
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

  const headers = [
    "Data",
    "Veículo",
    "Placa",
    "Tipo",
    "Grupo",
    "Item",
    "Descrição",
    "Custo",
    "Quilometragem",
    "Próx. Quilometragem",
    "Próx. Data",
    "Fornecedor",
    "Nota Fiscal",
    "Status",
    "Observações",
  ];

  const rows = records.map((record) => {
    const vehicle = record.vehicle || vehicleMap.get(record.vehicle_id);

    return [
      formatDate(record.data_manutencao),
      vehicle ? vehicle.modelo : "Veículo não encontrado",
      vehicle ? vehicle.placa : "-",
      maintenanceTypeLabels[record.tipo_manutencao] || record.tipo_manutencao,
      record.grupo ? maintenanceGroupLabels[record.grupo] || record.grupo : "-",
      record.item,
      record.descricao || "-",
      formatCurrency(record.custo),
      record.quilometragem_atual?.toString() || "-",
      record.quilometragem_proxima?.toString() || "-",
      record.data_proxima ? formatDate(record.data_proxima) : "-",
      record.fornecedor || "-",
      record.nota_fiscal || "-",
      statusLabels[record.status] || record.status,
      record.observacoes || "-",
    ];
  });

  const csvContent = [
    headers.join(";"),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")),
  ].join("\n");

  return "\uFEFF" + csvContent; // BOM for Excel
};

/* -------------------------------------------------------------------------- */
/* Download                                                                    */
/* -------------------------------------------------------------------------- */

const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportMaintenanceToCSV = (records: MaintenanceRecord[], vehicles: Vehicle[]): void => {
  const csv = generateMaintenanceCSV(records, vehicles);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `manutencoes-${date}.csv`);

  void supabase.auth.getUser().then(({ data }) => {
    if (data.user?.id) {
      void trackUserEvent({
        userId: data.user.id,
        action: "exportacao",
        resourceType: "manutencao",
        metadata: { amount: records.length },
      });
    }
  });
};
