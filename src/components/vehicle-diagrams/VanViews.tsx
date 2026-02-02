import type { VehicleViewProps } from "./types";

export const VanLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 300 130" className={className}>
    <defs>
      <linearGradient id="vanBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Van body */}
    <path
      d="M 25 100 L 25 35 Q 25 25, 35 25 L 240 25 Q 250 25, 255 30 L 275 55 Q 280 65, 280 80 L 280 100
         Q 280 108, 270 108 L 240 108 Q 230 108, 230 98 Q 230 88, 220 88 L 210 88 Q 200 88, 200 98 Q 200 108, 190 108
         L 110 108 Q 100 108, 100 98 Q 100 88, 90 88 L 80 88 Q 70 88, 70 98 Q 70 108, 60 108
         L 35 108 Q 25 108, 25 100 Z"
      fill="url(#vanBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 247 28 L 270 55 Q 272 60, 272 70 L 242 70 L 242 28 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Side windows */}
    <rect x="185" y="32" width="52" height="35" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="125" y="32" width="55" height="35" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="65" y="32" width="55" height="35" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Door lines */}
    <line x1="120" y1="32" x2="120" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="180" y1="32" x2="180" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="240" y1="32" x2="240" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Door handles */}
    <rect x="130" y="72" width="10" height="4" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="190" y="72" width="10" height="4" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="250" y="72" width="10" height="4" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Wheels */}
    <circle cx="85" cy="98" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="85" cy="98" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="85" cy="98" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    <circle cx="215" cy="98" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="215" cy="98" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="215" cy="98" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="277" cy="75" rx="4" ry="10" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <rect x="25" y="45" width="5" height="15" rx="1" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirror */}
    <ellipse cx="278" cy="48" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const VanFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="vanFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Van body front */}
    <path
      d="M 20 25 L 140 25 Q 150 25, 155 40 L 155 115 Q 155 125, 145 125 L 15 125 Q 5 125, 5 115 L 5 40 Q 10 25, 20 25 Z"
      fill="url(#vanFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 25 30 L 135 30 Q 145 30, 148 45 L 148 70 L 12 70 L 12 45 Q 15 30, 25 30 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Grille */}
    <rect x="30" y="85" width="100" height="20" rx="4" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="85" x2="50" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="70" y1="85" x2="70" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="90" y1="85" x2="90" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="110" y1="85" x2="110" y2="105" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Headlights */}
    <rect x="10" y="75" width="18" height="28" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="132" y="75" width="18" height="28" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="110" width="144" height="12" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="2" cy="50" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="158" cy="50" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const VanBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="vanBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Van body back */}
    <path
      d="M 15 20 L 145 20 Q 155 20, 155 30 L 155 115 Q 155 125, 145 125 L 15 125 Q 5 125, 5 115 L 5 30 Q 5 20, 15 20 Z"
      fill="url(#vanBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Rear windows */}
    <rect x="25" y="28" width="48" height="40" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    <rect x="87" y="28" width="48" height="40" rx="3" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
    
    {/* Rear doors split */}
    <line x1="80" y1="20" x2="80" y2="110" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Door handles */}
    <rect x="70" y="75" width="8" height="15" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="82" y="75" width="8" height="15" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillights */}
    <rect x="10" y="40" width="12" height="35" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="138" y="40" width="12" height="35" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="55" y="95" width="50" height="12" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="112" width="144" height="10" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const VanTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 100 280" className={className}>
    <defs>
      <linearGradient id="vanTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Van body top */}
    <rect x="15" y="15" width="70" height="250" rx="8" fill="url(#vanTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Windshield */}
    <path
      d="M 20 230 L 80 230 Q 82 230, 82 235 L 82 258 Q 50 265, 18 258 L 18 235 Q 18 230, 20 230 Z"
      fill="hsl(var(--primary) / 0.2)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Roof lines */}
    <line x1="20" y1="60" x2="80" y2="60" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="20" y1="110" x2="80" y2="110" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="20" y1="160" x2="80" y2="160" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="20" y1="210" x2="80" y2="210" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirrors */}
    <ellipse cx="8" cy="240" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="92" cy="240" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Front wheels */}
    <ellipse cx="10" cy="220" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="90" cy="220" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Rear wheels */}
    <ellipse cx="10" cy="60" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="90" cy="60" rx="8" ry="20" fill="hsl(var(--foreground) / 0.7)" />
    
    {/* Taillights */}
    <ellipse cx="30" cy="12" rx="8" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    <ellipse cx="70" cy="12" rx="8" ry="3" fill="hsl(var(--destructive) / 0.5)" />
    
    {/* Headlights */}
    <ellipse cx="30" cy="268" rx="8" ry="3" fill="hsl(var(--warning) / 0.5)" />
    <ellipse cx="70" cy="268" rx="8" ry="3" fill="hsl(var(--warning) / 0.5)" />
  </svg>
);
