import type { ChecklistData, VehicleType } from "@/types/checklist";

const vehicleTypeLabels: Record<NonNullable<VehicleType>, string> = {
  caminhao: 'Caminhão',
  carro_passeio: 'Carro de Passeio',
  van: 'Van',
  furgao: 'Furgão',
  onibus: 'Ônibus',
  moto: 'Moto',
  picape: 'Picape',
};

const conditionLabels: Record<string, string> = {
  good: 'Bom',
  medium: 'Regular',
  bad: 'Ruim',
  yes: 'Sim',
  no: 'Não',
  na: 'N/A',
};

const formatValue = (value: string | null): string => {
  if (!value) return '-';
  return conditionLabels[value] || value;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

export const generateChecklistCSV = (checklists: ChecklistData[]): string => {
  const headers = [
    'Data',
    'Nome',
    'Veículo',
    'Tipo',
    'Placa',
    'Empresa',
    'Quilometragem',
    'Limpeza Externa',
    'Limpeza Interna',
    'Pneus',
    'Estepe',
    'Áreas Afetadas',
    'Observações',
  ];

  const rows = checklists.map(checklist => [
    formatDate(checklist.data),
    checklist.nome,
    checklist.veiculo,
    checklist.tipoVeiculo ? vehicleTypeLabels[checklist.tipoVeiculo] : '-',
    checklist.placa,
    checklist.empresa || '-',
    checklist.quilometragem || '-',
    formatValue(checklist.vehicleCondition.limpezaExterna),
    formatValue(checklist.vehicleCondition.limpezaInterna),
    formatValue(checklist.vehicleCondition.pneus),
    formatValue(checklist.vehicleCondition.estepe),
    checklist.areaMarkers.length.toString(),
    checklist.observacoes || '-',
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(';')),
  ].join('\n');

  return '\uFEFF' + csvContent; // BOM for Excel UTF-8 compatibility
};

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportChecklistsToCSV = (checklists: ChecklistData[]): void => {
  const csv = generateChecklistCSV(checklists);
  const date = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `inspecoes-veiculares-${date}.csv`);
};
