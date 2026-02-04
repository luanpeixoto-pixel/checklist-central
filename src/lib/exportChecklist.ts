import type { ChecklistData, VehicleType } from "@/types/checklist";
import type { Vehicle } from "@/types/fleet";

/* -------------------------------------------------------------------------- */
/* Labels                                                                      */
/* -------------------------------------------------------------------------- */

const vehicleTypeLabels: Record<NonNullable<VehicleType>, string> = {
  caminhao: "Caminhão",
  carro_passeio: "Carro de Passeio",
  van: "Van",
  furgao: "Furgão",
  onibus: "Ônibus",
  moto: "Moto",
  picape: "Picape",
};

const conditionLabels: Record<string, string> = {
  good: "Bom",
  medium: "Regular",
  bad: "Ruim",
  yes: "Sim",
  no: "Não",
  na: "N/A",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const formatValue = (value: string | null): string => (value ? conditionLabels[value] || value : "-");

const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString("pt-BR");

/* -------------------------------------------------------------------------- */
/* CSV Generator                                                               */
/* -------------------------------------------------------------------------- */

export const generateChecklistCSV = (checklists: ChecklistData[], vehicles: Vehicle[]): string => {
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

  const headers = [
    "Data",
    "Inspetor",
    "Veículo",
    "Placa",
    "Tipo",
    "Quilometragem",
    "Limpeza Externa",
    "Limpeza Interna",
    "Pneus",
    "Estepe",
    "Áreas Afetadas",
    "Observações",
  ];

  const rows = checklists.map((checklist) => {
    const vehicle = vehicleMap.get(checklist.vehicle_id);

    return [
      formatDate(checklist.data),
      checklist.nome,
      vehicle ? vehicle.modelo : "Veículo não encontrado",
      vehicle ? vehicle.placa : "-",
      checklist.tipoVeiculo ? vehicleTypeLabels[checklist.tipoVeiculo] : "-",
      checklist.quilometragem || "-",
      formatValue(checklist.vehicleCondition.limpezaExterna),
      formatValue(checklist.vehicleCondition.limpezaInterna),
      formatValue(checklist.vehicleCondition.pneus),
      formatValue(checklist.vehicleCondition.estepe),
      checklist.areaMarkers.length.toString(),
      checklist.observacoes || "-",
    ];
  });

  const csvContent = [
    headers.join(";"),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";")),
  ].join("\n");

  return "\uFEFF" + csvContent; // BOM for Excel
};

/* -------------------------------------------------------------------------- */
/* Download                                                                    */
/* -------------------------------------------------------------------------- */

export const downloadCSV = (content: string, filename: string): void => {
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

export const exportChecklistsToCSV = (checklists: ChecklistData[], vehicles: Vehicle[]): void => {
  const csv = generateChecklistCSV(checklists, vehicles);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `inspecoes-veiculares-${date}.csv`);
};
