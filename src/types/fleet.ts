// =====================================================
// TIPOS DO SISTEMA MODULAR DE GESTÃO DE FROTA
// =====================================================

export type VehicleType = 'caminhao' | 'carro_passeio' | 'van' | 'furgao' | 'onibus' | 'moto' | 'picape';
export type VehicleStatus = 'ativo' | 'inativo' | 'em_manutencao';
export type MaintenanceStatus = 'realizada' | 'agendada' | 'pendente';
export type MaintenanceType = 'preventiva' | 'corretiva';
export type MaintenanceGroup = 'ar' | 'direcao' | 'freio' | 'limpadores' | 'motor' | 'pneus' | 'outros';
export type FuelType = 'gasolina_comum' | 'gasolina_aditivada' | 'etanol' | 'diesel' | 'diesel_s10' | 'gnv';

// Opções para selects
export const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'caminhao', label: 'Caminhão' },
  { value: 'carro_passeio', label: 'Carro de Passeio' },
  { value: 'van', label: 'Van' },
  { value: 'furgao', label: 'Furgão' },
  { value: 'onibus', label: 'Ônibus' },
  { value: 'moto', label: 'Moto' },
  { value: 'picape', label: 'Picape' },
];

export const VEHICLE_STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'em_manutencao', label: 'Em Manutenção' },
];

export const MAINTENANCE_TYPE_OPTIONS: { value: MaintenanceType; label: string }[] = [
  { value: 'preventiva', label: 'Preventiva' },
  { value: 'corretiva', label: 'Corretiva' },
];

export const MAINTENANCE_GROUP_OPTIONS: { value: MaintenanceGroup; label: string }[] = [
  { value: 'ar', label: 'Ar Condicionado' },
  { value: 'direcao', label: 'Direção' },
  { value: 'freio', label: 'Freio' },
  { value: 'limpadores', label: 'Limpadores' },
  { value: 'motor', label: 'Motor' },
  { value: 'pneus', label: 'Pneus' },
  { value: 'outros', label: 'Outros' },
];

export const MAINTENANCE_ITEMS: Record<MaintenanceGroup, string[]> = {
  ar: ['Correia do compressor do ar', 'Limpeza + Filtro do ar'],
  direcao: ['Fluido da direção hidráulica', 'Correia poly-v (bomba d\'água)'],
  freio: ['Pastilha de freio', 'Disco do freio', 'Fluido de freio'],
  limpadores: ['Limpadores de parabrisa', 'Água do limpador de parabrisa'],
  motor: ['Filtro de combustível', 'Correia dentada + rolamentos tensores', 'Velas', 'Correia do alternador', 'Óleo do motor'],
  pneus: ['Alinhamento dos pneus', 'Calibragem dos pneus', 'Calibragem do estepe', 'Pneus', 'Rodízio dos pneus'],
  outros: ['Fluido das transmissões', 'Luzes', 'Bateria', 'Sistema da suspensão', 'Mangueiras', 'Líquido + Limpeza do radiador'],
};

export const FUEL_TYPE_OPTIONS: { value: FuelType; label: string }[] = [
  { value: 'gasolina_comum', label: 'Gasolina Comum' },
  { value: 'gasolina_aditivada', label: 'Gasolina Aditivada' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'diesel_s10', label: 'Diesel S10' },
  { value: 'gnv', label: 'GNV' },
];

// Interfaces
export interface Vehicle {
  id: string;
  user_id: string;
  placa: string;
  modelo: string;
  tipo: string; // VehicleType from DB
  marca?: string | null;
  ano?: number | null;
  cor?: string | null;
  empresa?: string | null;
  quilometragem_atual: number;
  status: string; // VehicleStatus from DB
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  user_id: string;
  vehicle_id: string;
  tipo_manutencao: string; // MaintenanceType from DB
  grupo?: string | null; // MaintenanceGroup from DB
  item: string;
  descricao?: string | null;
  custo: number;
  quilometragem_atual?: number | null;
  quilometragem_proxima?: number | null;
  data_manutencao: string;
  data_proxima?: string | null;
  fornecedor?: string | null;
  nota_fiscal?: string | null;
  status: string; // MaintenanceStatus from DB
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
  imagens?: string[] | null;
  // Joined data
  vehicle?: Vehicle | null;
}

export interface FuelRecord {
  id: string;
  user_id: string;
  vehicle_id: string;
  data_abastecimento: string;
  posto?: string | null;
  tipo_combustivel: string; // FuelType from DB
  litros: number;
  valor_total: number;
  valor_litro?: number | null;
  quilometragem: number;
  km_rodados?: number | null;
  km_por_litro?: number | null;
  tanque_cheio: boolean;
  condutor?: string | null;
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
  imagens?: string[] | null;
  // Joined data
  vehicle?: Vehicle | null;
}

// Form data types (for creating/updating)
export type VehicleFormData = Omit<Vehicle, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type MaintenanceFormData = Omit<MaintenanceRecord, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle'>;
export type FuelFormData = Omit<FuelRecord, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle' | 'valor_litro' | 'km_rodados' | 'km_por_litro'>;

// Dashboard metrics
export interface FleetMetrics {
  totalVehicles: number;
  activeVehicles: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  topMaintenanceTypes: { item: string; count: number; cost: number }[];
  fuelConsumptionAvg: number;
}
