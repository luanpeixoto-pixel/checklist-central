import type { VehicleViewProps } from "./types";

export const TruckLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 380 130" className={className}>
    <defs>
      <linearGradient id="truckBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Trailer */}
    <rect x="15" y="20" width="220" height="85" rx="3" fill="url(#truckBodyGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Trailer lines */}
    <line x1="75" y1="20" x2="75" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="135" y1="20" x2="135" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="195" y1="20" x2="195" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Cabin */}
    <path
      d="M 240 105 L 240 50 Q 240 30, 260 25 L 340 25 Q 355 25, 360 40 L 365 60 Q 370 75, 370 90 L 370 105
         Q 370 112, 360 112 L 340 112 Q 330 112, 330 102 Q 330 92, 320 92 L 310 92 Q 300 92, 300 102 Q 300 112, 290 112
         L 250 112 Q 240 112, 240 105 Z"
      fill="url(#truckBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Cabin windshield */}
    <path
      d="M 258 28 L 338 28 Q 350 28, 355 40 L 358 58 L 258 58 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Door */}
    <rect x="260" y="60" width="45" height="42" rx="2" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="270" y="75" width="10" height="4" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Trailer wheels */}
    <circle cx="45" cy="100" r="16" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="45" cy="100" r="8" fill="hsl(var(--muted))" />
    <circle cx="85" cy="100" r="16" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="85" cy="100" r="8" fill="hsl(var(--muted))" />
    <circle cx="165" cy="100" r="16" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="165" cy="100" r="8" fill="hsl(var(--muted))" />
    <circle cx="205" cy="100" r="16" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="205" cy="100" r="8" fill="hsl(var(--muted))" />
    
    {/* Cabin wheel */}
    <circle cx="315" cy="100" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="315" cy="100" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="315" cy="100" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="367" cy="78" rx="4" ry="10" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <rect x="15" y="35" width="5" height="20" rx="1" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirror */}
    <ellipse cx="370" cy="42" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const TruckFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 180 150" className={className}>
    <defs>
      <linearGradient id="truckFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Truck cabin front */}
    <path
      d="M 15 25 L 165 25 Q 175 25, 175 35 L 175 125 Q 175 135, 165 135 L 15 135 Q 5 135, 5 125 L 5 35 Q 5 25, 15 25 Z"
      fill="url(#truckFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <rect x="18" y="30" width="144" height="45" rx="4" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Grille */}
    <rect x="30" y="85" width="120" height="30" rx="4" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="85" x2="50" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="70" y1="85" x2="70" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="90" y1="85" x2="90" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="110" y1="85" x2="110" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="130" y1="85" x2="130" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Headlights */}
    <rect x="8" y="80" width="20" height="35" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="152" y="80" width="20" height="35" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="120" width="164" height="12" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="0" cy="48" rx="8" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="180" cy="48" rx="8" ry="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="18" cy="132" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="162" cy="132" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const TruckBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 180 150" className={className}>
    <defs>
      <linearGradient id="truckBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Trailer back */}
    <rect x="10" y="15" width="160" height="110" rx="4" fill="url(#truckBackGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Doors */}
    <line x1="90" y1="15" x2="90" y2="120" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Door handles */}
    <rect x="80" y="60" width="8" height="20" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="92" y="60" width="8" height="20" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Hinges */}
    <rect x="15" y="30" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="15" y="70" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="15" y="110" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="160" y="30" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="160" y="70" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="160" y="110" width="5" height="10" rx="1" fill="hsl(var(--foreground) / 0.4)" />
    
    {/* Taillights */}
    <rect x="12" y="20" width="12" height="25" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="156" y="20" width="12" height="25" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="65" y="100" width="50" height="12" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="10" y="128" width="160" height="10" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="25" cy="138" rx="12" ry="10" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="55" cy="138" rx="12" ry="10" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="125" cy="138" rx="12" ry="10" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="155" cy="138" rx="12" ry="10" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const TruckTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 100 320" className={className}>
    <defs>
      <linearGradient id="truckTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Trailer top */}
    <rect x="10" y="10" width="80" height="200" rx="4" fill="url(#truckTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Trailer roof lines */}
    <line x1="15" y1="55" x2="85" y2="55" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="15" y1="100" x2="85" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="15" y1="145" x2="85" y2="145" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="15" y1="190" x2="85" y2="190" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Cabin top */}
    <rect x="15" y="220" width="70" height="80" rx="5" fill="url(#truckTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Cabin windshield */}
    <rect x="20" y="260" width="60" height="35" rx="3" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="5" cy="270" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="95" cy="270" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Trailer wheels */}
    <ellipse cx="5" cy="40" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="95" cy="40" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="5" cy="80" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="95" cy="80" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="5" cy="160" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="95" cy="160" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="5" cy="200" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="95" cy="200" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Cabin wheels */}
    <ellipse cx="5" cy="250" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="95" cy="250" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Taillights */}
    <ellipse cx="25" cy="8" rx="8" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    <ellipse cx="75" cy="8" rx="8" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    
    {/* Headlights */}
    <ellipse cx="30" cy="302" rx="8" ry="3" fill="hsl(var(--warning) / 0.5)" />
    <ellipse cx="70" cy="302" rx="8" ry="3" fill="hsl(var(--warning) / 0.5)" />
  </svg>
);
