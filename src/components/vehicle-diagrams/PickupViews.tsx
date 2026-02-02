import type { VehicleViewProps } from "./types";

export const PickupLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 320 120" className={className}>
    <defs>
      <linearGradient id="pickupBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Cabin */}
    <path
      d="M 180 75 L 190 75 L 200 40 L 225 25 L 280 25 L 295 40 L 300 75 L 300 90
         Q 300 95, 295 95 L 265 95 Q 255 95, 255 85 Q 255 75, 245 75 L 235 75 
         Q 225 75, 225 85 Q 225 95, 215 95 L 180 95 L 180 75 Z"
      fill="url(#pickupBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Cabin windows */}
    <path
      d="M 205 43 L 227 28 L 278 28 L 290 43 L 290 55 L 205 55 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    <line x1="255" y1="28" x2="255" y2="55" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Truck bed */}
    <path
      d="M 30 55 L 175 55 L 175 95 L 120 95 Q 110 95, 110 85 Q 110 75, 100 75 
         L 90 75 Q 80 75, 80 85 Q 80 95, 70 95 L 30 95 L 30 55 Z"
      fill="url(#pickupBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Bed interior */}
    <rect x="35" y="58" width="135" height="32" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bed lines */}
    <line x1="35" y1="68" x2="170" y2="68" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="35" y1="78" x2="170" y2="78" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Wheels */}
    <circle cx="95" cy="85" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="95" cy="85" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="95" cy="85" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    <circle cx="240" cy="85" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="240" cy="85" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="240" cy="85" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="298" cy="65" rx="5" ry="8" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <rect x="28" y="60" width="5" height="12" rx="1" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirror */}
    <ellipse cx="195" cy="42" rx="5" ry="3" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Door handle */}
    <rect x="220" y="58" width="10" height="3" rx="1" fill="hsl(var(--foreground) / 0.5)" />
  </svg>
);

export const PickupFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 180 140" className={className}>
    <defs>
      <linearGradient id="pickupFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Body front */}
    <path
      d="M 20 60 
         Q 20 40, 40 30 L 55 18 Q 90 8, 125 18 L 140 30 Q 160 40, 160 60
         L 168 80 Q 175 100, 168 108 L 168 120 Q 168 125, 160 125
         L 20 125 Q 12 125, 12 120 L 12 108 Q 5 100, 12 80 Z"
      fill="url(#pickupFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 38 32 Q 90 15, 142 32 L 152 55 Q 152 62, 90 62 Q 28 62, 28 55 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Grille */}
    <rect x="40" y="75" width="100" height="22" rx="4" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="55" y1="75" x2="55" y2="97" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="70" y1="75" x2="70" y2="97" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="90" y1="75" x2="90" y2="97" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="110" y1="75" x2="110" y2="97" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="125" y1="75" x2="125" y2="97" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Headlights */}
    <rect x="18" y="70" width="20" height="25" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="142" y="70" width="20" height="25" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <path
      d="M 15 105 Q 90 115, 165 105 L 168 122 Q 90 132, 12 122 Z"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Side mirrors */}
    <ellipse cx="8" cy="50" rx="7" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="172" cy="50" rx="7" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="18" cy="120" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="162" cy="120" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const PickupBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 180 140" className={className}>
    <defs>
      <linearGradient id="pickupBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Tailgate */}
    <path
      d="M 25 30 L 155 30 L 160 105 Q 160 115, 150 115 L 30 115 Q 20 115, 20 105 Z"
      fill="url(#pickupBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Bed interior visible */}
    <rect x="30" y="35" width="120" height="45" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Tailgate handle */}
    <rect x="75" y="90" width="30" height="8" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillights */}
    <rect x="22" y="50" width="15" height="35" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="143" y="50" width="15" height="35" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="65" y="100" width="50" height="12" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <path
      d="M 20 115 Q 90 122, 160 115 L 160 125 Q 90 132, 20 125 Z"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Wheels */}
    <ellipse cx="18" cy="120" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="162" cy="120" rx="10" ry="15" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const PickupTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 120 300" className={className}>
    <defs>
      <linearGradient id="pickupTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Truck bed */}
    <rect x="20" y="15" width="80" height="150" rx="5" fill="url(#pickupTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Bed interior */}
    <rect x="25" y="20" width="70" height="140" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bed lines */}
    <line x1="25" y1="50" x2="95" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="25" y1="80" x2="95" y2="80" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="25" y1="110" x2="95" y2="110" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="25" y1="140" x2="95" y2="140" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Cabin */}
    <path
      d="M 20 170 L 100 170 L 100 265 Q 100 275, 90 275 Q 60 285, 30 275 Q 20 275, 20 265 Z"
      fill="url(#pickupTopGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Cabin windshield */}
    <path
      d="M 28 180 Q 60 175, 92 180 L 95 210 Q 60 215, 25 210 Z"
      fill="hsl(var(--primary) / 0.2)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Cabin roof */}
    <rect x="28" y="215" width="64" height="35" rx="3" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="10" cy="200" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="110" cy="200" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="13" cy="210" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="107" cy="210" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels */}
    <ellipse cx="13" cy="80" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="107" cy="80" rx="10" ry="22" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Taillights */}
    <ellipse cx="35" cy="12" rx="8" ry="4" fill="hsl(var(--destructive) / 0.5)" />
    <ellipse cx="85" cy="12" rx="8" ry="4" fill="hsl(var(--destructive) / 0.5)" />
    
    {/* Headlights */}
    <ellipse cx="40" cy="278" rx="8" ry="4" fill="hsl(var(--warning) / 0.5)" />
    <ellipse cx="80" cy="278" rx="8" ry="4" fill="hsl(var(--warning) / 0.5)" />
  </svg>
);
