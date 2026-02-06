import type { FuelRecord, Vehicle } from "@/types/fleet";
import { supabase } from "@/lib/supabaseClient";
import { trackUserEvent } from "@/lib/eventTracking";

/* -------------------------------------------------------------------------- */
/* Labels                                                                      */
/* -------------------------------------------------------------------------- */

const fuelTypeLabels: Record<string, string> = {
  gasolina_comum: "Gasolina Comum",
  gasolina_aditivada: "Gasolina Aditivada",
  etanol: "Etanol",
  diesel: "Diesel",
  diesel_s10: "Diesel S10",
  gnv: "GNV",
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

const formatNumber = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined) return "-";
  return value.toFixed(decimals).replace(".", ",");
};

/* -------------------------------------------------------------------------- */
/* CSV Generator                                                               */
/* -------------------------------------------------------------------------- */

export const generateFuelCSV = (records: FuelRecord[], vehicles: Vehicle[]): string => {
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

  const headers = [
    "Data",
    "Veículo",
    "Placa",
    "Posto",
    "Combustível",
    "Litros",
    "Valor Total",
    "Valor/Litro",
    "Quilometragem",
    "Km Rodados",
    "Km/L",
    "Tanque Cheio",
    "Condutor",
    "Observações",
  ];

  const rows = records.map((record) => {
    const vehicle = record.vehicle || vehicleMap.get(record.vehicle_id);

    return [
      formatDate(record.data_abastecimento),
      vehicle ? vehicle.modelo : "Veículo não encontrado",
      vehicle ? vehicle.placa : "-",
      record.posto || "-",
      fuelTypeLabels[record.tipo_combustivel] || record.tipo_combustivel,
      formatNumber(record.litros, 3),
      formatCurrency(record.valor_total),
      formatCurrency(record.valor_litro),
      record.quilometragem.toString(),
      record.km_rodados?.toString() || "-",
      formatNumber(record.km_por_litro, 2),
      record.tanque_cheio ? "Sim" : "Não",
      record.condutor || "-",
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

export const exportFuelToCSV = (records: FuelRecord[], vehicles: Vehicle[]): void => {
  const csv = generateFuelCSV(records, vehicles);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `abastecimentos-${date}.csv`);

  void supabase.auth.getUser().then(({ data }) => {
    if (data.user?.id) {
      void trackUserEvent({
        userId: data.user.id,
        action: "exportacao",
        resourceType: "abastecimento",
        metadata: { amount: records.length },
      });
    }
  });
};
