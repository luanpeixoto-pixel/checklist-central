import { cn } from "@/lib/utils";
import { Check, Minus, X } from "lucide-react";

type StatusType = 'condition' | 'yesno';

interface StatusButtonProps {
  type: StatusType;
  value: 'good' | 'medium' | 'bad' | 'yes' | 'no' | 'na' | null;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

const statusConfig = {
  good: {
    label: 'Bom',
    icon: Check,
    className: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
    selectedClassName: 'bg-success text-success-foreground border-success',
  },
  medium: {
    label: 'Médio',
    icon: Minus,
    className: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
    selectedClassName: 'bg-warning text-warning-foreground border-warning',
  },
  bad: {
    label: 'Ruim',
    icon: X,
    className: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20',
    selectedClassName: 'bg-destructive text-destructive-foreground border-destructive',
  },
  yes: {
    label: 'Sim',
    icon: Check,
    className: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
    selectedClassName: 'bg-success text-success-foreground border-success',
  },
  no: {
    label: 'Não',
    icon: X,
    className: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20',
    selectedClassName: 'bg-destructive text-destructive-foreground border-destructive',
  },
  na: {
    label: 'N/A',
    icon: Minus,
    className: 'bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80',
    selectedClassName: 'bg-muted-foreground text-muted border-muted-foreground',
  },
};

export const StatusButton = ({ value, selected, onClick, size = 'md' }: StatusButtonProps) => {
  if (!value) return null;
  
  const config = statusConfig[value];
  const Icon = config.icon;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border-2 font-medium transition-all duration-200",
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        selected ? config.selectedClassName : config.className,
        "focus:outline-none focus:ring-2 focus:ring-primary/20"
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {config.label}
    </button>
  );
};

interface StatusGroupProps {
  type: StatusType;
  value: string | null;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

export const StatusGroup = ({ type, value, onChange, size = 'md' }: StatusGroupProps) => {
  const options = type === 'condition' 
    ? ['good', 'medium', 'bad'] as const
    : ['yes', 'no', 'na'] as const;

  return (
    <div className="flex items-center gap-2">
      {options.map((option) => (
        <StatusButton
          key={option}
          type={type}
          value={option}
          selected={value === option}
          onClick={() => onChange(option)}
          size={size}
        />
      ))}
    </div>
  );
};
