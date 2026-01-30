import { useState } from "react";
import { X } from "lucide-react";
import type { VehicleAreaMarker } from "@/types/checklist";

interface VehicleDiagramProps {
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
}

export const VehicleDiagram = ({ markers, onAddMarker, onRemoveMarker }: VehicleDiagramProps) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    let position: VehicleAreaMarker['position'] = 'top';
    if (y < 25) position = 'front';
    else if (y > 75) position = 'back';
    else if (x < 35) position = 'left';
    else if (x > 65) position = 'right';
    
    const newMarker: VehicleAreaMarker = {
      id: `marker-${Date.now()}`,
      x,
      y,
      position,
    };
    
    onAddMarker(newMarker);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Clique no diagrama para marcar áreas afetadas
      </p>
      <svg
        viewBox="0 0 200 300"
        className="w-full h-auto cursor-crosshair"
        onClick={handleClick}
      >
        {/* Car body outline - Top view */}
        <defs>
          <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
        </defs>
        
        {/* Main car body */}
        <path
          d="M 50 40 
             Q 50 20, 100 20 
             Q 150 20, 150 40
             L 160 60
             Q 165 80, 165 100
             L 165 200
             Q 165 220, 160 240
             L 150 260
             Q 150 280, 100 280
             Q 50 280, 50 260
             L 40 240
             Q 35 220, 35 200
             L 35 100
             Q 35 80, 40 60
             Z"
          fill="url(#carGradient)"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          filter="url(#shadow)"
          className={`transition-opacity duration-200 ${hoveredArea === 'body' ? 'opacity-80' : ''}`}
          onMouseEnter={() => setHoveredArea('body')}
          onMouseLeave={() => setHoveredArea(null)}
        />
        
        {/* Windshield */}
        <path
          d="M 60 55 
             Q 60 45, 100 45
             Q 140 45, 140 55
             L 145 75
             Q 145 85, 100 85
             Q 55 85, 55 75
             Z"
          fill="hsl(var(--primary) / 0.15)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1.5"
        />
        
        {/* Rear windshield */}
        <path
          d="M 60 245 
             Q 60 255, 100 255
             Q 140 255, 140 245
             L 145 225
             Q 145 215, 100 215
             Q 55 215, 55 225
             Z"
          fill="hsl(var(--primary) / 0.15)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1.5"
        />
        
        {/* Front wheels */}
        <ellipse cx="42" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
        <ellipse cx="158" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
        
        {/* Rear wheels */}
        <ellipse cx="42" cy="230" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
        <ellipse cx="158" cy="230" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
        
        {/* Side mirrors */}
        <ellipse cx="28" cy="85" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
        <ellipse cx="172" cy="85" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
        
        {/* Front lights */}
        <ellipse cx="65" cy="28" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
        <ellipse cx="135" cy="28" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
        
        {/* Rear lights */}
        <ellipse cx="65" cy="272" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
        <ellipse cx="135" cy="272" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
        
        {/* Labels */}
        <text x="100" y="12" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium">FRENTE</text>
        <text x="100" y="295" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium">TRASEIRA</text>
        <text x="15" y="150" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium" transform="rotate(-90, 15, 150)">ESQUERDA</text>
        <text x="185" y="150" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium" transform="rotate(90, 185, 150)">DIREITA</text>
        
        {/* Markers */}
        {markers.map((marker) => (
          <g key={marker.id}>
            <circle
              cx={marker.x * 2}
              cy={marker.y * 3}
              r="10"
              fill="hsl(var(--destructive))"
              stroke="hsl(var(--destructive-foreground))"
              strokeWidth="2"
              className="cursor-pointer animate-scale-in"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMarker(marker.id);
              }}
            />
            <foreignObject
              x={marker.x * 2 - 6}
              y={marker.y * 3 - 6}
              width="12"
              height="12"
              className="pointer-events-none"
            >
              <X className="h-3 w-3 text-destructive-foreground" />
            </foreignObject>
          </g>
        ))}
      </svg>
      
      {markers.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {markers.length} área(s) marcada(s) - clique para remover
        </p>
      )}
    </div>
  );
};
