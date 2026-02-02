import { useState } from "react";
import { X } from "lucide-react";
import type { VehicleAreaMarker, VehicleType } from "@/types/checklist";
import type { ViewType } from "./vehicle-diagrams/types";

// Import all vehicle views
import { CarLeftView, CarFrontView, CarBackView, CarTopView } from "./vehicle-diagrams/CarViews";
import { PickupLeftView, PickupFrontView, PickupBackView, PickupTopView } from "./vehicle-diagrams/PickupViews";
import { VanLeftView, VanFrontView, VanBackView, VanTopView } from "./vehicle-diagrams/VanViews";
import { TruckLeftView, TruckFrontView, TruckBackView, TruckTopView } from "./vehicle-diagrams/TruckViews";
import { BusLeftView, BusFrontView, BusBackView, BusTopView } from "./vehicle-diagrams/BusViews";
import { MotorcycleLeftView, MotorcycleFrontView, MotorcycleBackView, MotorcycleTopView } from "./vehicle-diagrams/MotorcycleViews";
import { FurgaoLeftView, FurgaoFrontView, FurgaoBackView, FurgaoTopView } from "./vehicle-diagrams/FurgaoViews";

interface VehicleDiagramProps {
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
  vehicleType: VehicleType;
}

interface ViewConfig {
  component: React.FC<{ className?: string }>;
  label: string;
  view: ViewType;
}

const getVehicleViews = (type: VehicleType): ViewConfig[] => {
  switch (type) {
    case 'caminhao':
      return [
        { component: TruckLeftView, label: 'Lateral', view: 'left' },
        { component: TruckFrontView, label: 'Frente', view: 'front' },
        { component: TruckBackView, label: 'Traseira', view: 'back' },
        { component: TruckTopView, label: 'Superior', view: 'top' },
      ];
    case 'van':
      return [
        { component: VanLeftView, label: 'Lateral', view: 'left' },
        { component: VanFrontView, label: 'Frente', view: 'front' },
        { component: VanBackView, label: 'Traseira', view: 'back' },
        { component: VanTopView, label: 'Superior', view: 'top' },
      ];
    case 'furgao':
      return [
        { component: FurgaoLeftView, label: 'Lateral', view: 'left' },
        { component: FurgaoFrontView, label: 'Frente', view: 'front' },
        { component: FurgaoBackView, label: 'Traseira', view: 'back' },
        { component: FurgaoTopView, label: 'Superior', view: 'top' },
      ];
    case 'onibus':
      return [
        { component: BusLeftView, label: 'Lateral', view: 'left' },
        { component: BusFrontView, label: 'Frente', view: 'front' },
        { component: BusBackView, label: 'Traseira', view: 'back' },
        { component: BusTopView, label: 'Superior', view: 'top' },
      ];
    case 'moto':
      return [
        { component: MotorcycleLeftView, label: 'Lateral', view: 'left' },
        { component: MotorcycleFrontView, label: 'Frente', view: 'front' },
        { component: MotorcycleBackView, label: 'Traseira', view: 'back' },
        { component: MotorcycleTopView, label: 'Superior', view: 'top' },
      ];
    case 'picape':
      return [
        { component: PickupLeftView, label: 'Lateral', view: 'left' },
        { component: PickupFrontView, label: 'Frente', view: 'front' },
        { component: PickupBackView, label: 'Traseira', view: 'back' },
        { component: PickupTopView, label: 'Superior', view: 'top' },
      ];
    case 'carro_passeio':
    default:
      return [
        { component: CarLeftView, label: 'Lateral', view: 'left' },
        { component: CarFrontView, label: 'Frente', view: 'front' },
        { component: CarBackView, label: 'Traseira', view: 'back' },
        { component: CarTopView, label: 'Superior', view: 'top' },
      ];
  }
};

const getVehicleLabel = (type: VehicleType): string => {
  switch (type) {
    case 'caminhao':
      return 'Caminhão';
    case 'van':
      return 'Van';
    case 'furgao':
      return 'Furgão';
    case 'onibus':
      return 'Ônibus';
    case 'moto':
      return 'Moto';
    case 'picape':
      return 'Picape';
    case 'carro_passeio':
    default:
      return 'Veículo';
  }
};

// Map view type to position type for markers
const viewToPosition = (view: ViewType): VehicleAreaMarker['position'] => {
  switch (view) {
    case 'left':
      return 'left';
    case 'front':
      return 'front';
    case 'back':
      return 'back';
    case 'top':
      return 'top';
    default:
      return 'top';
  }
};

interface ViewPanelProps {
  config: ViewConfig;
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
}

const ViewPanel = ({ config, markers, onAddMarker, onRemoveMarker }: ViewPanelProps) => {
  const ViewComponent = config.component;
  const viewMarkers = markers.filter(m => m.position === viewToPosition(config.view));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newMarker: VehicleAreaMarker = {
      id: `marker-${Date.now()}-${config.view}`,
      x,
      y,
      position: viewToPosition(config.view),
    };
    
    onAddMarker(newMarker);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium text-muted-foreground mb-1">{config.label}</span>
      <div 
        className="relative bg-card/50 rounded-lg border border-border/50 p-2 cursor-crosshair hover:border-primary/50 transition-colors"
        onClick={handleClick}
      >
        <ViewComponent className="w-full h-auto" />
        
        {/* Markers overlay */}
        {viewMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-scale-in z-10"
            style={{ 
              left: `${marker.x}%`, 
              top: `${marker.y}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveMarker(marker.id);
            }}
          >
            <div className="w-full h-full rounded-full bg-destructive border-2 border-destructive-foreground flex items-center justify-center shadow-lg">
              <X className="h-3 w-3 text-destructive-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VehicleDiagram = ({ markers, onAddMarker, onRemoveMarker, vehicleType }: VehicleDiagramProps) => {
  const views = getVehicleViews(vehicleType);

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Clique nas vistas para marcar áreas afetadas do <strong>{getVehicleLabel(vehicleType)}</strong>
      </p>
      
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {views.map((viewConfig) => (
          <ViewPanel
            key={viewConfig.view}
            config={viewConfig}
            markers={markers}
            onAddMarker={onAddMarker}
            onRemoveMarker={onRemoveMarker}
          />
        ))}
      </div>
      
      {markers.length > 0 && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {markers.length} área(s) marcada(s) - clique para remover
        </p>
      )}
    </div>
  );
};
