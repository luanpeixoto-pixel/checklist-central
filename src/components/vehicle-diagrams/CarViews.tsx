import type { VehicleViewProps } from "./types";

export const CarLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 300 120" className={className}>
    <defs>
      <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Car body */}
    <path
      d="M 30 75 
         L 50 75 L 60 45 L 90 30 L 140 28 L 180 28 L 220 35 L 250 55 L 270 75 L 270 85
         Q 270 95, 260 95 L 230 95 
         Q 220 95, 220 85 Q 220 75, 210 75 L 200 75 Q 190 75, 190 85 Q 190 95, 180 95
         L 120 95 Q 110 95, 110 85 Q 110 75, 100 75 L 90 75 Q 80 75, 80 85 Q 80 95, 70 95
         L 40 95 Q 30 95, 30 85 Z"
      fill="url(#carBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windows */}
    <path
      d="M 65 48 L 93 33 L 140 30 L 140 55 L 68 55 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    <path
      d="M 145 30 L 180 30 L 210 40 L 230 58 L 145 58 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Door lines */}
    <line x1="140" y1="30" x2="140" y2="75" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="200" y1="40" x2="200" y2="75" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Door handles */}
    <rect x="150" y="60" width="12" height="4" rx="2" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="165" y="60" width="12" height="4" rx="2" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Wheels */}
    <circle cx="95" cy="85" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="95" cy="85" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="95" cy="85" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    <circle cx="205" cy="85" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="205" cy="85" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="205" cy="85" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="265" cy="70" rx="6" ry="8" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <ellipse cx="35" cy="70" rx="5" ry="8" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirror */}
    <ellipse cx="62" cy="48" rx="5" ry="3" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const CarFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="carFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Car body front */}
    <path
      d="M 25 65 
         Q 25 45, 40 35 L 50 25 Q 80 15, 110 25 L 120 35 Q 135 45, 135 65
         L 140 80 Q 145 95, 140 100 L 140 115 Q 140 120, 135 120
         L 25 120 Q 20 120, 20 115 L 20 100 Q 15 95, 20 80 Z"
      fill="url(#carFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 38 38 Q 80 25, 122 38 L 130 58 Q 130 65, 80 65 Q 30 65, 30 58 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Grille */}
    <rect x="45" y="75" width="70" height="18" rx="4" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="60" y1="75" x2="60" y2="93" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="75" y1="75" x2="75" y2="93" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="90" y1="75" x2="90" y2="93" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="105" y1="75" x2="105" y2="93" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Headlights */}
    <ellipse cx="30" cy="75" rx="10" ry="12" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="130" cy="75" rx="10" ry="12" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Fog lights */}
    <ellipse cx="35" cy="100" rx="6" ry="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="125" cy="100" rx="6" ry="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <path
      d="M 25 105 Q 80 112, 135 105 L 135 118 Q 80 125, 25 118 Z"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Side mirrors */}
    <ellipse cx="15" cy="55" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="145" cy="55" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels (partial) */}
    <ellipse cx="22" cy="115" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="138" cy="115" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const CarBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="carBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Car body back */}
    <path
      d="M 25 55 
         Q 25 40, 45 30 L 55 22 Q 80 15, 105 22 L 115 30 Q 135 40, 135 55
         L 140 75 Q 145 90, 140 100 L 140 115 Q 140 120, 135 120
         L 25 120 Q 20 120, 20 115 L 20 100 Q 15 90, 20 75 Z"
      fill="url(#carBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Rear windshield */}
    <path
      d="M 42 32 Q 80 22, 118 32 L 128 52 Q 128 60, 80 60 Q 32 60, 32 52 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Trunk line */}
    <line x1="30" y1="65" x2="130" y2="65" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillights */}
    <path
      d="M 25 70 L 40 70 L 40 95 L 25 95 Z"
      fill="hsl(var(--destructive) / 0.6)"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    <path
      d="M 120 70 L 135 70 L 135 95 L 120 95 Z"
      fill="hsl(var(--destructive) / 0.6)"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* License plate area */}
    <rect x="55" y="95" width="50" height="15" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <path
      d="M 25 105 Q 80 112, 135 105 L 135 118 Q 80 125, 25 118 Z"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Exhaust */}
    <ellipse cx="50" cy="118" rx="8" ry="4" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Wheels (partial) */}
    <ellipse cx="22" cy="115" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="138" cy="115" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const CarTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 120 280" className={className}>
    <defs>
      <linearGradient id="carTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Car body top */}
    <path
      d="M 30 25 
         Q 60 10, 90 25
         L 95 50 Q 100 80, 100 140 Q 100 200, 95 230 L 90 255
         Q 60 270, 30 255
         L 25 230 Q 20 200, 20 140 Q 20 80, 25 50 Z"
      fill="url(#carTopGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 32 40 Q 60 30, 88 40 L 92 70 Q 60 75, 28 70 Z"
      fill="hsl(var(--primary) / 0.2)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Roof */}
    <path
      d="M 28 75 Q 60 70, 92 75 L 92 160 Q 60 165, 28 160 Z"
      fill="hsl(var(--secondary))"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Rear windshield */}
    <path
      d="M 28 165 Q 60 160, 92 165 L 88 200 Q 60 210, 32 200 Z"
      fill="hsl(var(--primary) / 0.2)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Hood lines */}
    <line x1="45" y1="25" x2="45" y2="38" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="75" y1="25" x2="75" y2="38" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Trunk lines */}
    <line x1="45" y1="205" x2="45" y2="250" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="75" y1="205" x2="75" y2="250" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirrors */}
    <ellipse cx="12" cy="65" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="108" cy="65" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="15" cy="55" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="105" cy="55" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels */}
    <ellipse cx="15" cy="210" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="105" cy="210" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Headlights */}
    <ellipse cx="40" cy="18" rx="8" ry="4" fill="hsl(var(--warning) / 0.5)" />
    <ellipse cx="80" cy="18" rx="8" ry="4" fill="hsl(var(--warning) / 0.5)" />
    
    {/* Taillights */}
    <ellipse cx="40" cy="260" rx="8" ry="4" fill="hsl(var(--destructive) / 0.5)" />
    <ellipse cx="80" cy="260" rx="8" ry="4" fill="hsl(var(--destructive) / 0.5)" />
  </svg>
);
