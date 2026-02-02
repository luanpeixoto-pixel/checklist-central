import type { VehicleViewProps } from "./types";

// Furgão uses similar views to Van but with cargo focus
export const FurgaoLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 300 130" className={className}>
    <defs>
      <linearGradient id="furgaoBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Furgão body */}
    <path
      d="M 25 100 L 25 30 Q 25 20, 35 20 L 240 20 Q 255 20, 260 30 L 278 55 Q 283 68, 283 85 L 283 100
         Q 283 108, 273 108 L 243 108 Q 233 108, 233 98 Q 233 88, 223 88 L 213 88 Q 203 88, 203 98 Q 203 108, 193 108
         L 113 108 Q 103 108, 103 98 Q 103 88, 93 88 L 83 88 Q 73 88, 73 98 Q 73 108, 63 108
         L 35 108 Q 25 108, 25 100 Z"
      fill="url(#furgaoBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 250 23 L 273 52 Q 275 58, 275 68 L 245 68 L 245 23 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Cabin separator */}
    <line x1="235" y1="20" x2="235" y2="100" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Cargo door */}
    <line x1="130" y1="20" x2="130" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Door handles */}
    <rect x="122" y="55" width="6" height="15" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="132" y="55" width="6" height="15" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="250" y="72" width="10" height="4" rx="1" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Wheels */}
    <circle cx="88" cy="98" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="88" cy="98" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="88" cy="98" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    <circle cx="218" cy="98" r="18" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="218" cy="98" r="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="218" cy="98" r="4" fill="hsl(var(--foreground) / 0.6)" />
    
    {/* Headlight */}
    <ellipse cx="280" cy="75" rx="4" ry="10" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <rect x="25" y="40" width="5" height="15" rx="1" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Side mirror */}
    <ellipse cx="281" cy="45" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const FurgaoFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="furgaoFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Furgão body front */}
    <path
      d="M 20 22 L 140 22 Q 150 22, 155 38 L 155 115 Q 155 125, 145 125 L 15 125 Q 5 125, 5 115 L 5 38 Q 10 22, 20 22 Z"
      fill="url(#furgaoFrontGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Windshield */}
    <path
      d="M 25 28 L 135 28 Q 145 28, 148 42 L 148 68 L 12 68 L 12 42 Q 15 28, 25 28 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Grille */}
    <rect x="30" y="82" width="100" height="22" rx="4" fill="hsl(var(--foreground) / 0.2)" stroke="hsl(var(--border))" strokeWidth="1" />
    <line x1="50" y1="82" x2="50" y2="104" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="70" y1="82" x2="70" y2="104" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="90" y1="82" x2="90" y2="104" stroke="hsl(var(--border))" strokeWidth="0.5" />
    <line x1="110" y1="82" x2="110" y2="104" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Headlights */}
    <rect x="10" y="75" width="18" height="28" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="132" y="75" width="18" height="28" rx="4" fill="hsl(var(--warning) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="108" width="144" height="14" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Side mirrors */}
    <ellipse cx="2" cy="48" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="158" cy="48" rx="6" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const FurgaoBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 160 140" className={className}>
    <defs>
      <linearGradient id="furgaoBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Furgão body back */}
    <path
      d="M 15 18 L 145 18 Q 155 18, 155 28 L 155 115 Q 155 125, 145 125 L 15 125 Q 5 125, 5 115 L 5 28 Q 5 18, 15 18 Z"
      fill="url(#furgaoBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Rear doors split */}
    <line x1="80" y1="18" x2="80" y2="108" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Door handles */}
    <rect x="70" y="55" width="8" height="20" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="82" y="55" width="8" height="20" rx="2" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillights */}
    <rect x="10" y="35" width="12" height="40" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="138" y="35" width="12" height="40" rx="3" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="55" y="95" width="50" height="12" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Bumper */}
    <rect x="8" y="112" width="144" height="10" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Wheels */}
    <ellipse cx="15" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
    <ellipse cx="145" cy="122" rx="8" ry="12" fill="hsl(var(--foreground) / 0.7)" />
  </svg>
);

export const FurgaoTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 100 280" className={className}>
    <defs>
      <linearGradient id="furgaoTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Furgão body top */}
    <rect x="15" y="15" width="70" height="250" rx="8" fill="url(#furgaoTopGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Windshield */}
    <path
      d="M 20 228 L 80 228 Q 82 228, 82 233 L 82 258 Q 50 265, 18 258 L 18 233 Q 18 228, 20 228 Z"
      fill="hsl(var(--primary) / 0.2)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Cabin separator */}
    <line x1="18" y1="220" x2="82" y2="220" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Cargo door lines */}
    <line x1="50" y1="20" x2="50" y2="215" stroke="hsl(var(--border))" strokeWidth="1" />
    
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
