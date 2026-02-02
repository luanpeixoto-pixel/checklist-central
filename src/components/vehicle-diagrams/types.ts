import type { VehicleAreaMarker, VehicleType } from "@/types/checklist";

export type ViewType = 'left' | 'front' | 'back' | 'top';

export interface VehicleViewProps {
  className?: string;
}

export interface VehicleDiagramProps {
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
  vehicleType: VehicleType;
}

export interface ViewMarker extends VehicleAreaMarker {
  view: ViewType;
}
