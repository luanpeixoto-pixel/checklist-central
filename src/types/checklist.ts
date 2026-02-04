import type { VehicleType } from "./fleet";
export type { VehicleType };
export { VEHICLE_TYPE_OPTIONS } from "./fleet";

/* -------------------------------------------------------------------------- */
/* Status Types                                                                */
/* -------------------------------------------------------------------------- */

export type ConditionStatus = "good" | "medium" | "bad" | null;
export type YesNoNA = "yes" | "no" | "na" | null;

/* -------------------------------------------------------------------------- */
/* Vehicle Condition                                                           */
/* -------------------------------------------------------------------------- */

export interface VehicleCondition {
  limpezaExterna: ConditionStatus;
  limpezaInterna: ConditionStatus;
  pneus: ConditionStatus;
  estepe: ConditionStatus;
}

/* -------------------------------------------------------------------------- */
/* Light Checks                                                                */
/* -------------------------------------------------------------------------- */

export interface LightCheck {
  farol: YesNoNA;
  seta: YesNoNA;
  lanterna: YesNoNA;
  freio: YesNoNA;
  re: YesNoNA;
}

export const createEmptyLightCheck = (): LightCheck => ({
  farol: null,
  seta: null,
  lanterna: null,
  freio: null,
  re: null,
});

/* -------------------------------------------------------------------------- */
/* Other Items                                                                 */
/* -------------------------------------------------------------------------- */

export interface OtherItems {
  triangulo: YesNoNA;
  extintor: YesNoNA;
  macaco: YesNoNA;
  chaveRoda: YesNoNA;
  documentos: YesNoNA;
}

export const createEmptyOtherItems = (): OtherItems => ({
  triangulo: null,
  extintor: null,
  macaco: null,
  chaveRoda: null,
  documentos: null,
});

/* -------------------------------------------------------------------------- */
/* Mechanical Checks                                                           */
/* -------------------------------------------------------------------------- */

export interface MechanicalChecks {
  nivelOleo: YesNoNA;
  nivelAgua: YesNoNA;
  fluidoFreio: YesNoNA;
  bateria: YesNoNA;
  correia: YesNoNA;
}

export const createEmptyMechanicalChecks = (): MechanicalChecks => ({
  nivelOleo: null,
  nivelAgua: null,
  fluidoFreio: null,
  bateria: null,
  correia: null,
});

/* -------------------------------------------------------------------------- */
/* Vehicle Area Marker                                                         */
/* -------------------------------------------------------------------------- */

export interface VehicleAreaMarker {
  id: string;
  x: number;
  y: number;
  type: "risco" | "amassado" | "quebrado" | "outro";
  description?: string;
}

/* -------------------------------------------------------------------------- */
/* Checklist Data                                                              */
/* -------------------------------------------------------------------------- */

export interface ChecklistData {
  id?: string;

  // Inspetor / contexto
  nome: string;
  data: string;

  // RELAÇÃO COM VEÍCULO (única e obrigatória)
  vehicle_id: string;

  // Metadados do checklist
  tipoVeiculo: VehicleType | null;
  quilometragem: string;

  // Checklist em si
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

export const createEmptyChecklist = (): ChecklistData => ({
  nome: "",
  data: new Date().toISOString().split("T")[0],

  vehicle_id: "",

  tipoVeiculo: null,
  quilometragem: "",

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
  observacoes: "",
});
