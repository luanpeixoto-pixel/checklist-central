import { useState } from "react";
import { X } from "lucide-react";
import type { VehicleAreaMarker, VehicleType } from "@/types/checklist";

interface VehicleDiagramProps {
  markers: VehicleAreaMarker[];
  onAddMarker: (marker: VehicleAreaMarker) => void;
  onRemoveMarker: (id: string) => void;
  vehicleType: VehicleType;
}

// SVG components for each vehicle type
const CarSVG = () => (
  <>
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
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Windshield */}
    <path
      d="M 60 55 Q 60 45, 100 45 Q 140 45, 140 55 L 145 75 Q 145 85, 100 85 Q 55 85, 55 75 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Rear windshield */}
    <path
      d="M 60 245 Q 60 255, 100 255 Q 140 255, 140 245 L 145 225 Q 145 215, 100 215 Q 55 215, 55 225 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Wheels */}
    <ellipse cx="42" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="230" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="230" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="28" cy="85" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="85" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="65" cy="28" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="135" cy="28" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="65" cy="272" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="135" cy="272" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const TruckSVG = () => (
  <>
    {/* Truck cabin */}
    <path
      d="M 55 25 
         Q 55 15, 100 15 
         Q 145 15, 145 25
         L 150 40
         Q 155 55, 155 70
         L 155 100
         L 45 100
         L 45 70
         Q 45 55, 50 40
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Truck cabin windshield */}
    <path
      d="M 62 32 Q 62 24, 100 24 Q 138 24, 138 32 L 142 48 Q 142 56, 100 56 Q 58 56, 58 48 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Truck cargo area */}
    <rect
      x="40"
      y="110"
      width="120"
      height="160"
      rx="5"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Cargo lines */}
    <line x1="40" y1="145" x2="160" y2="145" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="40" y1="180" x2="160" y2="180" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="40" y1="215" x2="160" y2="215" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="40" y1="250" x2="160" y2="250" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="42" cy="85" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="85" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels (dual) */}
    <ellipse cx="42" cy="240" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="240" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="200" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="200" rx="14" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="28" cy="55" rx="10" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="55" rx="10" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="65" cy="20" rx="8" ry="4" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="135" cy="20" rx="8" ry="4" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="55" cy="275" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="145" cy="275" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const VanSVG = () => (
  <>
    {/* Van body */}
    <path
      d="M 50 35 
         Q 50 20, 100 20 
         Q 150 20, 150 35
         L 160 55
         Q 165 70, 165 90
         L 165 250
         Q 165 270, 150 275
         Q 100 285, 50 275
         Q 35 270, 35 250
         L 35 90
         Q 35 70, 40 55
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Windshield */}
    <path
      d="M 58 45 Q 58 32, 100 32 Q 142 32, 142 45 L 148 70 Q 148 82, 100 82 Q 52 82, 52 70 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Side windows */}
    <rect x="45" y="95" width="30" height="40" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="125" y="95" width="30" height="40" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Rear windows */}
    <rect x="55" y="245" width="35" height="20" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="110" y="245" width="35" height="20" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Sliding door line */}
    <line x1="80" y1="95" x2="80" y2="200" stroke="hsl(var(--border))" strokeWidth="1.5" />
    <line x1="120" y1="95" x2="120" y2="200" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Wheels */}
    <ellipse cx="42" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="70" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="235" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="235" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="28" cy="75" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="75" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="65" cy="26" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="135" cy="26" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="60" cy="278" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="140" cy="278" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const FurgaoSVG = () => (
  <>
    {/* Furgao body - taller van */}
    <path
      d="M 50 40 
         Q 50 20, 100 20 
         Q 150 20, 150 40
         L 160 60
         Q 165 75, 165 95
         L 165 255
         Q 165 275, 150 278
         Q 100 285, 50 278
         Q 35 275, 35 255
         L 35 95
         Q 35 75, 40 60
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Windshield */}
    <path
      d="M 58 48 Q 58 35, 100 35 Q 142 35, 142 48 L 148 72 Q 148 82, 100 82 Q 52 82, 52 72 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Cargo area separator */}
    <line x1="40" y1="100" x2="160" y2="100" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Rear doors */}
    <line x1="100" y1="100" x2="100" y2="275" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Door handles */}
    <rect x="92" y="180" width="4" height="15" rx="2" fill="hsl(var(--border))" />
    <rect x="104" y="180" width="4" height="15" rx="2" fill="hsl(var(--border))" />
    
    {/* Wheels */}
    <ellipse cx="42" cy="72" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="72" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="238" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="238" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="28" cy="78" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="78" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="65" cy="26" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="135" cy="26" rx="8" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="60" cy="278" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="140" cy="278" rx="8" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const BusSVG = () => (
  <>
    {/* Bus body */}
    <path
      d="M 45 30 
         Q 45 15, 100 15 
         Q 155 15, 155 30
         L 160 45
         Q 165 55, 165 70
         L 165 260
         Q 165 280, 155 283
         Q 100 290, 45 283
         Q 35 280, 35 260
         L 35 70
         Q 35 55, 40 45
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Windshield */}
    <path
      d="M 55 38 Q 55 25, 100 25 Q 145 25, 145 38 L 150 58 Q 150 68, 100 68 Q 50 68, 50 58 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Side windows row 1 */}
    <rect x="42" y="80" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="68" y="80" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="110" y="80" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="136" y="80" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Side windows row 2 */}
    <rect x="42" y="115" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="68" y="115" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="110" y="115" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="136" y="115" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Side windows row 3 */}
    <rect x="42" y="150" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="68" y="150" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="110" y="150" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="136" y="150" width="22" height="25" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Rear window */}
    <path
      d="M 55 255 Q 55 265, 100 265 Q 145 265, 145 255 L 148 240 Q 148 230, 100 230 Q 52 230, 52 240 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Door */}
    <rect x="92" y="80" width="16" height="55" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Wheels */}
    <ellipse cx="42" cy="58" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="58" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="210" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="210" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="42" cy="250" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="158" cy="250" rx="12" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="28" cy="55" rx="10" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="55" rx="10" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="60" cy="20" rx="10" ry="4" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="140" cy="20" rx="10" ry="4" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="60" cy="283" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="140" cy="283" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const MotorcycleSVG = () => (
  <>
    {/* Main body/tank */}
    <ellipse cx="100" cy="130" rx="25" ry="45" fill="url(#vehicleGradient)" stroke="hsl(var(--border))" strokeWidth="2" filter="url(#shadow)" />
    
    {/* Seat */}
    <ellipse cx="100" cy="190" rx="18" ry="35" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Front fork */}
    <line x1="100" y1="85" x2="100" y2="45" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="6" />
    
    {/* Rear frame */}
    <line x1="100" y1="175" x2="100" y2="240" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="4" />
    
    {/* Handlebars */}
    <line x1="60" y1="55" x2="140" y2="55" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="5" />
    <ellipse cx="55" cy="55" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="145" cy="55" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheel */}
    <circle cx="100" cy="35" r="22" fill="none" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="8" />
    <circle cx="100" cy="35" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Rear wheel */}
    <circle cx="100" cy="260" r="22" fill="none" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="8" />
    <circle cx="100" cy="260" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Front light */}
    <circle cx="100" cy="18" r="8" fill="hsl(var(--warning))" opacity="0.6" />
    
    {/* Rear light */}
    <ellipse cx="100" cy="282" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    
    {/* Mirrors */}
    <ellipse cx="45" cy="48" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="155" cy="48" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Exhaust */}
    <ellipse cx="130" cy="220" rx="12" ry="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
  </>
);

const PickupSVG = () => (
  <>
    {/* Cabin */}
    <path
      d="M 50 35 
         Q 50 20, 100 20 
         Q 150 20, 150 35
         L 158 55
         Q 163 70, 163 90
         L 163 130
         L 37 130
         L 37 90
         Q 37 70, 42 55
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Windshield */}
    <path
      d="M 58 45 Q 58 32, 100 32 Q 142 32, 142 45 L 148 68 Q 148 78, 100 78 Q 52 78, 52 68 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.4)"
      strokeWidth="1.5"
    />
    
    {/* Cabin back window */}
    <rect x="55" y="95" width="90" height="25" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    
    {/* Truck bed */}
    <path
      d="M 37 140
         L 163 140
         L 163 265
         Q 163 280, 150 282
         Q 100 288, 50 282
         Q 37 280, 37 265
         Z"
      fill="url(#vehicleGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      filter="url(#shadow)"
    />
    
    {/* Bed floor lines */}
    <line x1="50" y1="155" x2="150" y2="155" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="180" x2="150" y2="180" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="205" x2="150" y2="205" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="230" x2="150" y2="230" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="255" x2="150" y2="255" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="40" cy="75" rx="13" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="160" cy="75" rx="13" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels */}
    <ellipse cx="40" cy="240" rx="13" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="160" cy="240" rx="13" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Side mirrors */}
    <ellipse cx="26" cy="78" rx="9" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="174" cy="78" rx="9" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Lights */}
    <ellipse cx="65" cy="26" rx="10" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="135" cy="26" rx="10" ry="5" fill="hsl(var(--warning))" opacity="0.6" />
    <ellipse cx="60" cy="280" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
    <ellipse cx="140" cy="280" rx="10" ry="5" fill="hsl(var(--destructive))" opacity="0.6" />
  </>
);

const getVehicleSVG = (type: VehicleType) => {
  switch (type) {
    case 'caminhao':
      return <TruckSVG />;
    case 'van':
      return <VanSVG />;
    case 'furgao':
      return <FurgaoSVG />;
    case 'onibus':
      return <BusSVG />;
    case 'moto':
      return <MotorcycleSVG />;
    case 'picape':
      return <PickupSVG />;
    case 'carro_passeio':
    default:
      return <CarSVG />;
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

export const VehicleDiagram = ({ markers, onAddMarker, onRemoveMarker, vehicleType }: VehicleDiagramProps) => {
  const [hoveredArea] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    let markerType: VehicleAreaMarker['type'] = 'outro';
    if (y < 25) markerType = 'amassado';
    else if (y > 75) markerType = 'quebrado';
    else if (x < 35) markerType = 'risco';
    else if (x > 65) markerType = 'risco';
    
    const newMarker: VehicleAreaMarker = {
      id: `marker-${Date.now()}`,
      x,
      y,
      type: markerType,
    };
    
    onAddMarker(newMarker);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Clique no diagrama para marcar áreas afetadas do <strong>{getVehicleLabel(vehicleType)}</strong>
      </p>
      <svg
        viewBox="0 0 200 300"
        className="w-full h-auto cursor-crosshair"
        onClick={handleClick}
      >
        {/* Definitions */}
        <defs>
          <linearGradient id="vehicleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
        </defs>
        
        {/* Vehicle SVG based on type */}
        {getVehicleSVG(vehicleType)}
        
        {/* Labels */}
        <text x="100" y="8" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium">FRENTE</text>
        <text x="100" y="298" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium">TRASEIRA</text>
        <text x="12" y="150" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium" transform="rotate(-90, 12, 150)">ESQUERDA</text>
        <text x="188" y="150" textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium" transform="rotate(90, 188, 150)">DIREITA</text>
        
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
