import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { CategoryId, ExchangeType, ItemCondition } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { formatCondition, formatExchangeType } from '@/utils/formatters';

interface ActiveFiltersProps {
  selectedCategory: CategoryId | 'all';
  selectedExchangeType: ExchangeType | 'all';
  selectedCondition: ItemCondition | 'all';
  selectedLocation: string;
  maxPrice: number;
  onClearCategory: () => void;
  onClearExchangeType: () => void;
  onClearCondition: () => void;
  onClearLocation: () => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategory,
  selectedExchangeType,
  selectedCondition,
  selectedLocation,
  maxPrice,
  onClearCategory,
  onClearExchangeType,
  onClearCondition,
  onClearLocation,
  onClearPrice,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedExchangeType !== 'all' ||
    selectedCondition !== 'all' ||
    Boolean(selectedLocation) ||
    maxPrice < 300;

  if (!hasActiveFilters) return null;

  const categoryName =
    selectedCategory !== 'all'
      ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory
      : null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="text-xs font-semibold text-charcoal-muted mr-1">Filtered by:</span>

      {categoryName && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-forest text-ivory">
          Category: {categoryName}
          <button onClick={onClearCategory} className="hover:text-lime">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {selectedExchangeType !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory-soft text-forest border border-ivory-border">
          Mode: {formatExchangeType(selectedExchangeType)}
          <button onClick={onClearExchangeType} className="hover:text-forest-dark">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {selectedCondition !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory-soft text-charcoal border border-ivory-border">
          Condition: {formatCondition(selectedCondition)}
          <button onClick={onClearCondition} className="hover:text-forest-dark">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {selectedLocation && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory-soft text-charcoal border border-ivory-border">
          Location: {selectedLocation}
          <button onClick={onClearLocation} className="hover:text-forest-dark">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {maxPrice < 300 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory-soft text-charcoal border border-ivory-border">
          Under ${maxPrice}
          <button onClick={onClearPrice} className="hover:text-forest-dark">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-forest font-medium ml-2 underline underline-offset-2"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset all</span>
      </button>
    </div>
  );
};

