import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#21262D] text-[#8B949E] border-[#30363D]',
    success: 'bg-green-500/15 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/30'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface LevelBadgeProps {
  level: 'A' | 'B' | 'C' | 'D';
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const labels = {
    A: 'A级',
    B: 'B级',
    C: 'C级',
    D: 'D级'
  };

  const colors = {
    A: 'level-a',
    B: 'level-b',
    C: 'level-c',
    D: 'level-d'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}
