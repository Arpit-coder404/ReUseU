import React from 'react';
import { cn } from '@/utils/cn';
import { ExchangeType, ItemCondition, ListingStatus } from '@/types';
import { formatCondition, formatExchangeType } from '@/utils/formatters';
import { Gift, RefreshCw, Clock, Tag } from 'lucide-react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'forest' | 'lime' | 'sage' | 'outline' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium select-none';

  const variants = {
    default: 'bg-ivory-soft text-charcoal-muted border border-ivory-border',
    forest: 'bg-forest text-ivory',
    lime: 'bg-lime text-forest-dark font-semibold border border-lime-hover',
    sage: 'bg-sage/20 text-forest border border-sage/40',
    outline: 'border border-forest/20 text-forest bg-white/70',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    error: 'bg-red-100 text-red-800 border border-red-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full gap-1',
    md: 'text-sm px-3 py-1 rounded-full gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

export const ExchangeBadge: React.FC<{ type: ExchangeType; size?: 'sm' | 'md' }> = ({
  type,
  size = 'sm',
}) => {
  switch (type) {
    case 'donate':
      return (
        <Badge variant="lime" size={size} className="shadow-xs">
          <Gift className="w-3 h-3 text-forest-dark" />
          <span>Donation</span>
        </Badge>
      );
    case 'swap':
      return (
        <Badge variant="sage" size={size}>
          <RefreshCw className="w-3 h-3 text-forest" />
          <span>Campus Swap</span>
        </Badge>
      );
    case 'lend':
      return (
        <Badge variant="outline" size={size}>
          <Clock className="w-3 h-3 text-forest" />
          <span>Lend / Borrow</span>
        </Badge>
      );
    case 'sell':
    default:
      return (
        <Badge variant="forest" size={size}>
          <Tag className="w-3 h-3 text-ivory" />
          <span>For Sale</span>
        </Badge>
      );
  }
};

export const ConditionBadge: React.FC<{ condition: ItemCondition | string; size?: 'sm' | 'md' }> = ({
  condition,
  size = 'sm',
}) => {
  return (
    <Badge variant="default" size={size} className="capitalize">
      {formatCondition(condition)}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available
        </span>
      );
    case 'reserved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Reserved
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-muted bg-ivory-soft px-2.5 py-0.5 rounded-full border border-ivory-border">
          Exchanged
        </span>
      );
    case 'removed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          Removed
        </span>
      );
  }
};
