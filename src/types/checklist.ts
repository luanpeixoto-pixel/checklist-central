export type ConditionStatus = 'good' | 'medium' | 'bad' | null;
export type YesNoNA = 'yes' | 'no' | 'na' | null;
export type VehicleType = 'caminhao' | 'carro_passeio' | 'van' | 'furgao' | 'onibus' | 'moto' | 'picape' | null;

export const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'caminhao', label: 'Caminhão' },
  { value: 'carro_passeio', label: 'Carro de Passeio' },
  { value: 'van', label: 'Van' },
  { value: 'furgao', label: 'Furgão' },
  { value: 'onibus', label: 'Ônibus' },
  { value: 'moto', label: 'Moto' },
  { value: 'picape', label: 'Picape' },
];

export interface VehicleCondition {
  limpezaExterna: ConditionStatus;
  limpezaInterna: ConditionStatus;
  pneus: ConditionStatus;
  estepe: ConditionStatus;
}

export interface LightCheck {
  luzDaPlaca: YesNoNA;
  luzDeRe: YesNoNA;
  seta: YesNoNA;
  farolAlto: YesNoNA;
  farolBaixo: YesNoNA;
  neblina: YesNoNA;
  luzDeFreio: YesNoNA;
}

export interface OtherItems {
  alarme: YesNoNA;
  buzina: YesNoNA;
  chaveDeRoda: YesNoNA;
  cintos: YesNoNA;
  documentos: YesNoNA;
  seguranca: YesNoNA;
  extintor: YesNoNA;
  limpadores: YesNoNA;
  macaco: YesNoNA;
  painel: YesNoNA;
  retroVisorInterno: YesNoNA;
  retroVisorDireito: YesNoNA;
  retroVisorEsquerdo: YesNoNA;
  travas: YesNoNA;
  triangulo: YesNoNA;
}

export interface MechanicalChecks {
  acelerador: YesNoNA;
  aguaDoLimpador: YesNoNA;
  aguaDoRadiador: YesNoNA;
  motor: YesNoNA;
  embreagem: YesNoNA;
  freio: YesNoNA;
  freioMao: YesNoNA;
  oleoDoFreio: YesNoNA;
  oleoDoMotor: YesNoNA;
  tanqueDePartida: YesNoNA;
}

export interface VehicleAreaMarker {
  id: string;
  x: number;
  y: number;
  position: 'front' | 'back' | 'left' | 'right' | 'top';
  view?: 'left' | 'front' | 'back' | 'top';
}

export interface ChecklistData {
  id?: string;
  nome: string;
  data: string;
  tipoVeiculo: VehicleType;
  veiculo: string;
  empresa: string;
  placa: string;
  quilometragem: string;
  vehicleCondition: VehicleCondition;
  luzesDianteirasEsquerda: LightCheck;
  luzesDianteirasDireita: LightCheck;
  luzesTraseirasEsquerda: LightCheck;
  luzesTraseiraDireita: LightCheck;
  otherItems: OtherItems;
  mechanicalChecks: MechanicalChecks;
  areaMarkers: VehicleAreaMarker[];
  observacoes: string;
  createdAt?: Date;
}

export const createEmptyLightCheck = (): LightCheck => ({
  luzDaPlaca: null,
  luzDeRe: null,
  seta: null,
  farolAlto: null,
  farolBaixo: null,
  neblina: null,
  luzDeFreio: null,
});

export const createEmptyOtherItems = (): OtherItems => ({
  alarme: null,
  buzina: null,
  chaveDeRoda: null,
  cintos: null,
  documentos: null,
  seguranca: null,
  extintor: null,
  limpadores: null,
  macaco: null,
  painel: null,
  retroVisorInterno: null,
  retroVisorDireito: null,
  retroVisorEsquerdo: null,
  travas: null,
  triangulo: null,
});

export const createEmptyMechanicalChecks = (): MechanicalChecks => ({
  acelerador: null,
  aguaDoLimpador: null,
  aguaDoRadiador: null,
  motor: null,
  embreagem: null,
  freio: null,
  freioMao: null,
  oleoDoFreio: null,
  oleoDoMotor: null,
  tanqueDePartida: null,
});

export const createEmptyChecklist = (): ChecklistData => ({
  nome: '',
  data: new Date().toISOString().split('T')[0],
  tipoVeiculo: null,
  veiculo: '',
  empresa: '',
  placa: '',
  quilometragem: '',
  vehicleCondition: {
    limpezaExterna: null,
    limpezaInterna: null,
    pneus: null,
    estepe: null,
  },
  luzesDianteirasEsquerda: createEmptyLightCheck(),
  luzesDianteirasDireita: createEmptyLightCheck(),
  luzesTraseirasEsquerda: createEmptyLightCheck(),
  luzesTraseiraDireita: createEmptyLightCheck(),
  otherItems: createEmptyOtherItems(),
  mechanicalChecks: createEmptyMechanicalChecks(),
  areaMarkers: [],
  observacoes: '',
});
