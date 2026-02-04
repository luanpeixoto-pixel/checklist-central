export interface ChecklistData {
  id?: string;

  // Inspetor / contexto
  nome: string;
  data: string;

  // RELAÇÃO COM VEÍCULO (única e obrigatória)
  vehicle_id: string;

  // Metadados do checklist
  tipoVeiculo: VehicleType;
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
