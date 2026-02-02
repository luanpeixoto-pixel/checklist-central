import type { VehicleViewProps } from "./types";

export const MotorcycleLeftView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 280 140" className={className}>
    <defs>
      <linearGradient id="motoBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Rear wheel */}
    <circle cx="60" cy="100" r="32" fill="none" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="10" />
    <circle cx="60" cy="100" r="16" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="60" cy="100" r="6" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Front wheel */}
    <circle cx="220" cy="100" r="32" fill="none" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="10" />
    <circle cx="220" cy="100" r="16" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />
    <circle cx="220" cy="100" r="6" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Swingarm */}
    <path
      d="M 60 100 L 120 85"
      stroke="hsl(var(--foreground) / 0.6)"
      strokeWidth="6"
      fill="none"
    />
    
    {/* Frame */}
    <path
      d="M 120 85 L 160 45 L 200 55 L 220 100"
      stroke="hsl(var(--foreground) / 0.6)"
      strokeWidth="5"
      fill="none"
    />
    
    {/* Tank */}
    <path
      d="M 105 55 Q 105 40, 130 35 L 160 35 Q 175 35, 175 50 L 175 65 Q 175 75, 160 75 L 130 75 Q 105 75, 105 55 Z"
      fill="url(#motoBodyGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Seat */}
    <path
      d="M 80 55 Q 80 45, 100 42 L 130 42 Q 145 42, 145 52 L 145 60 Q 145 68, 130 70 L 80 75 Q 75 75, 75 68 Z"
      fill="hsl(var(--foreground) / 0.3)"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Front fork */}
    <line x1="175" y1="50" x2="220" y2="72" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="5" />
    
    {/* Headlight */}
    <ellipse cx="232" cy="55" rx="12" ry="10" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Taillight */}
    <ellipse cx="52" cy="50" rx="8" ry="6" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Handlebar */}
    <line x1="160" y1="35" x2="190" y2="25" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="4" />
    
    {/* Mirrors */}
    <ellipse cx="195" cy="22" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Exhaust */}
    <path
      d="M 60 90 L 120 88 Q 130 88, 130 92 Q 130 98, 120 98 L 80 100"
      stroke="hsl(var(--foreground) / 0.5)"
      strokeWidth="4"
      fill="none"
    />
    
    {/* Rear fender */}
    <path
      d="M 35 85 Q 60 60, 85 85"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Front fender */}
    <path
      d="M 195 85 Q 220 60, 245 85"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const MotorcycleFrontView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 120 160" className={className}>
    <defs>
      <linearGradient id="motoFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Front wheel */}
    <ellipse cx="60" cy="135" rx="8" ry="20" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Fork */}
    <line x1="45" y1="45" x2="52" y2="115" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="4" />
    <line x1="75" y1="45" x2="68" y2="115" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="4" />
    
    {/* Front fender */}
    <path
      d="M 48 100 Q 60 85, 72 100"
      stroke="hsl(var(--border))"
      strokeWidth="2"
      fill="url(#motoFrontGradient)"
    />
    
    {/* Headlight */}
    <ellipse cx="60" cy="55" rx="20" ry="15" fill="hsl(var(--warning) / 0.6)" stroke="hsl(var(--border))" strokeWidth="2" />
    <ellipse cx="60" cy="55" rx="12" ry="9" fill="hsl(var(--warning) / 0.3)" />
    
    {/* Windscreen */}
    <path
      d="M 40 40 Q 60 20, 80 40 L 75 55 Q 60 50, 45 55 Z"
      fill="hsl(var(--primary) / 0.15)"
      stroke="hsl(var(--primary) / 0.5)"
      strokeWidth="1"
    />
    
    {/* Handlebar */}
    <line x1="20" y1="35" x2="100" y2="35" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="5" />
    
    {/* Grips */}
    <rect x="12" y="30" width="12" height="10" rx="2" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="96" y="30" width="12" height="10" rx="2" fill="hsl(var(--foreground) / 0.4)" />
    
    {/* Mirrors */}
    <ellipse cx="15" cy="22" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="105" cy="22" rx="8" ry="5" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Turn signals */}
    <circle cx="35" cy="60" r="4" fill="hsl(var(--warning) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="85" cy="60" r="4" fill="hsl(var(--warning) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const MotorcycleBackView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 120 160" className={className}>
    <defs>
      <linearGradient id="motoBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Rear wheel */}
    <ellipse cx="60" cy="135" rx="10" ry="22" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Swingarm */}
    <path
      d="M 45 100 L 60 135 L 75 100"
      stroke="hsl(var(--foreground) / 0.6)"
      strokeWidth="4"
      fill="none"
    />
    
    {/* Rear fender */}
    <path
      d="M 42 95 Q 60 75, 78 95 L 78 115 L 42 115 Z"
      fill="url(#motoBackGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Seat */}
    <path
      d="M 35 55 Q 35 45, 60 42 Q 85 45, 85 55 L 85 70 Q 85 80, 60 85 Q 35 80, 35 70 Z"
      fill="hsl(var(--foreground) / 0.3)"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Taillight */}
    <rect x="45" y="82" width="30" height="10" rx="2" fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* License plate */}
    <rect x="40" y="95" width="40" height="12" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Turn signals */}
    <circle cx="35" cy="85" r="4" fill="hsl(var(--warning) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="85" cy="85" r="4" fill="hsl(var(--warning) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Exhaust */}
    <ellipse cx="85" cy="110" rx="8" ry="5" fill="hsl(var(--foreground) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export const MotorcycleTopView = ({ className }: VehicleViewProps) => (
  <svg viewBox="0 0 80 220" className={className}>
    <defs>
      <linearGradient id="motoTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--muted))" />
        <stop offset="50%" stopColor="hsl(var(--secondary))" />
        <stop offset="100%" stopColor="hsl(var(--muted))" />
      </linearGradient>
    </defs>
    
    {/* Rear wheel */}
    <ellipse cx="40" cy="30" rx="15" ry="25" fill="hsl(var(--foreground) / 0.7)" stroke="hsl(var(--border))" strokeWidth="2" />
    <ellipse cx="40" cy="30" rx="8" ry="15" fill="hsl(var(--muted))" />
    
    {/* Front wheel */}
    <ellipse cx="40" cy="190" rx="12" ry="22" fill="hsl(var(--foreground) / 0.7)" stroke="hsl(var(--border))" strokeWidth="2" />
    <ellipse cx="40" cy="190" rx="6" ry="12" fill="hsl(var(--muted))" />
    
    {/* Seat */}
    <path
      d="M 28 45 Q 25 55, 25 80 Q 25 100, 32 110 L 48 110 Q 55 100, 55 80 Q 55 55, 52 45 Z"
      fill="hsl(var(--foreground) / 0.3)"
      stroke="hsl(var(--border))"
      strokeWidth="1"
    />
    
    {/* Tank */}
    <path
      d="M 30 110 Q 28 120, 28 135 Q 28 145, 40 148 Q 52 145, 52 135 Q 52 120, 50 110 Z"
      fill="url(#motoTopGradient)"
      stroke="hsl(var(--border))"
      strokeWidth="1.5"
    />
    
    {/* Handlebar */}
    <line x1="10" y1="160" x2="70" y2="160" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="4" />
    
    {/* Mirrors */}
    <ellipse cx="8" cy="155" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    <ellipse cx="72" cy="155" rx="6" ry="4" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Headlight */}
    <ellipse cx="40" cy="175" rx="10" ry="6" fill="hsl(var(--warning) / 0.5)" />
    
    {/* Taillight */}
    <ellipse cx="40" cy="42" rx="8" ry="4" fill="hsl(var(--destructive) / 0.5)" />
  </svg>
);
