export interface PopupRule {
  id: string;
  priority: number;
  title: string;
  description: string;
  ctaText: string;
  dismissText?: string;
  input?: {
    placeholder: string;
    required?: boolean;
  };
  conditions: {
    minVisits?: number;
    minDataInputs?: number;
    minVehicles?: number;
    minChecklists?: number;
    minMaintenance?: number;
    minFuelRecords?: number;
    minMaintenanceAmount?: number;
    minFuelAmount?: number;
  };
  maxDisplays?: number;
  cooldownHours?: number;
}

// Editar este array é suficiente para criar/ajustar popups.
export const POPUP_RULES: PopupRule[] = [
  {
    id: "nps_after_usage",
    priority: 100,
    title: "Como está sua experiência até agora?",
    description: "Você já interagiu bastante com o sistema. Queremos ouvir um feedback rápido.",
    ctaText: "Enviar feedback",
    dismissText: "Agora não",
    input: {
      placeholder: "Digite seu feedback",
      required: true,
    },
    conditions: {
      minVisits: 3,
      minDataInputs: 2,
    },
    maxDisplays: 3,
    cooldownHours: 24,
  },
  {
    id: "upsell_fleet_growth",
    priority: 80,
    title: "Sua frota está crescendo 🚀",
    description: "Você já tem veículos e checklists cadastrados. Quer ajuda para montar rotina avançada de manutenção?",
    ctaText: "Quero ajuda",
    dismissText: "Fechar",
    conditions: {
      minVehicles: 3,
      minChecklists: 5,
      minMaintenance: 1,
    },
    maxDisplays: 2,
    cooldownHours: 48,
  },
];
