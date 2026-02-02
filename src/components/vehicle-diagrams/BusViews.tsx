import type { VehicleViewProps } from "./types";

export const BusLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 380 120" className={className}>
    <defs>
      <linearGradient id="busBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Bus body */}
    <path
      d="M 20 95 L 20 25 Q 20 15, 30 15 L 350 15 Q 360 15, 365 25 L 365 95
         Q 365 102, 355 102 L 335 102 Q 325 102, 325 92 Q 325 82, 315 82 L 305 82 Q 295 82, 295 92 Q 295 102, 285 102
         L 115 102 Q 105 102, 105 92 Q 105 82, 95 82 L 85 82 Q 75 82, 75 92 Q 75 102, 65 102
         L 30 102 Q 20 102, 20 95 Z"
      fill="url(#busBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windows row */}
    <rect x="30" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="65" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="100" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="135" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="170" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="205" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="240" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="275" y="22" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="310" y="22" width="45" height="30" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Door */}
    <rect x="145" y="55" width="25" height="40" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="157.5" y1="55" x2="157.5" y2="95" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <circle cx="90" cy="92" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="90" cy="92" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="90" cy="92" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    <circle cx="310" cy="92" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="310" cy="92" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="310" cy="92" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="362" cy="60" rx="4" ry="12" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <rect x="20" y="30" width="5" height="18" rx="1" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirror */}
    <ellipse cx="368" cy="30" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const BusFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="busFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Bus body front */}
    <path
      d="M 15 15 L 145 15 Q 155 15, 155 25 L 155 120 Q 155 130, 145 130 L 15 130 Q 5 130, 5 120 L 5 25 Q 5 15, 15 15 Z"
      fill="url(#busFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <rect x="15" y="22" width="130" height="50" rx="4" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Destination sign */}
    <rect x="25" y="8" width="110" height="12" rx="2" fill="hsl(var(--foreground) / 0.1)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Headlights */}
    <rect x="10" y="78" width="18" height="25" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="132" y="78" width="18" height="25" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Grille */}
    <rect x="35" y="80" width="90" height="25" rx="3" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="55" y1="80" x2="55" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="80" y1="80" x2="80" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="105" y1="80" x2="105" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Bumper */}
    <rect x="8" y="112" width="144" height="15" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="0" cy="42" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="160" cy="42" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="127" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="127" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const BusBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="busBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Bus body back */}
    <path
      d="M 15 15 L 145 15 Q 155 15, 155 25 L 155 120 Q 155 130, 145 130 L 15 130 Q 5 130, 5 120 L 5 25 Q 5 15, 15 15 Z"
      fill="url(#busBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Rear window */}
    <rect x="25" y="22" width="110" height="40" rx="4" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Emergency exit */}
    <rect x="60" y="68" width="40" height="45" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
    <text x="80" y="95" textAnchor="middle" className="fill-muted-foreground text-[6px]">SAÍDA</text>
    
    {/* Taillights */}
    <rect x="10" y="70" width="15" height="30" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="135" y="70" width="15" height="30" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="55" y="115" width="50" height="10" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="118" width="144" height="10" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="127" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="127" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const BusTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 80 320" className={className}>
    <defs>
      <linearGradient id="busTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Bus body top */}
    <rect x="10" y="12" width="60" height="296" rx="8" fill="url(#busTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Windshield */}
    <rect x="15" y="275" width="50" height="28" rx="4" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Rear window */}
    <rect x="15" y="17" width="50" height="20" rx="4" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Roof AC units */}
    <rect x="20" y="60" width="40" height="15" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="20" y="100" width="40" height="15" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="20" y="140" width="40" height="15" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="20" y="180" width="40" height="15" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="20" y="220" width="40" height="15" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="5" cy="280" rx="5" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="75" cy="280" rx="5" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="5" cy="260" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="75" cy="260" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels */}
    <ellipse cx="5" cy="50" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="75" cy="50" rx="6" ry="18" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Taillights */}
    <ellipse cx="25" cy="10" rx="6" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    <ellipse cx="55" cy="10" rx="6" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    
    {/* Headlights */}
    <ellipse cx="25" cy="310" rx="6" ry="3" fill="hsl(var(--warning) / 0.5)" />
    <ellipse cx="55" cy="310" rx="6" ry="3" fill="hsl(var(--warning) / 0.5)" />
  </svg>
);
