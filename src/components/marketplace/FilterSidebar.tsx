import React from 'react';
import { CategoryId, ExchangeType, ItemCondition } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { formatCondition } from '@/utils/formatters';
import { Filter, Gift, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
  selectedExchangeType: ExchangeType | 'all';
  onSelectExchangeType: (type: ExchangeType | 'all') => void;
  selectedCondition: ItemCondition | 'all';
  onSelectCondition: (condition: ItemCondition | 'all') => void;
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  maxPrice: number;
  onChangeMaxPrice: (price: number) => void;
  onReset: () => void;
  totalResultsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedExchangeType,
  onSelectExchangeType,
  selectedCondition,
  onSelectCondition,
  selectedLocation,
  onSelectLocation,
  maxPrice,
  onChangeMaxPrice,
  onReset,
  totalResultsCount,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-ivory-border shadow-subtle space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-ivory-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest" />
          <h3 className="font-editorial text-lg font-bold text-forest-dark">Filters</h3>
          <span className="text-xs bg-ivory-soft text-charcoal px-2 py-0.5 rounded-full font-medium">
            {totalResultsCount} items
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-charcoal-muted hover:text-forest flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Free Items Quick Filter Banner */}
      <div>
        <button
          onClick={() =>
            onSelectExchangeType(selectedExchangeType === 'donate' ? 'all' : 'donate')
          }
          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
            selectedExchangeType === 'donate'
              ? 'bg-lime text-forest-dark border-lime-hover shadow-xs font-semibold'
              : 'bg-lime/20 hover:bg-lime/30 text-forest-dark border-lime/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-forest-dark" />
            <span className="text-xs font-bold">Free Donations Only</span>
          </div>
          <span className="text-[11px] bg-white/70 px-2 py-0.5 rounded-full font-bold">
            $0
          </span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-forest text-ivory font-bold'
                : 'text-charcoal hover:bg-ivory-soft'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-forest text-ivory font-bold'
                  : 'text-charcoal hover:bg-ivory-soft'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Mode */}
      <div className="space-y-3 pt-3 border-t border-ivory-border">
        <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
          Exchange Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['all', 'sell', 'donate', 'lend', 'swap'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onSelectExchangeType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize text-center transition-colors border ${
                selectedExchangeType === type
                  ? 'bg-forest text-ivory border-forest font-bold'
                  : 'bg-white hover:bg-ivory-soft text-charcoal border-ivory-border'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-3 pt-3 border-t border-ivory-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-bold text-forest">
            {maxPrice >= 300 ? 'Any Price' : `$${maxPrice}`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          step="5"
          value={maxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="w-full accent-forest cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-charcoal-muted">
          <span>$0 (Free)</span>
          <span>$150</span>
          <span>$300+</span>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3 pt-3 border-t border-ivory-border">
        <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
          Condition
        </label>
        <div className="space-y-1">
          {(['all', 'like_new', 'good', 'fair'] as const).map((cond) => (
            <button
              key={cond}
              onClick={() => onSelectCondition(cond)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                selectedCondition === cond
                  ? 'bg-ivory-soft text-forest font-bold border border-ivory-border'
                  : 'text-charcoal hover:bg-ivory'
              }`}
            >
              <span>{cond === 'all' ? 'Any Condition' : formatCondition(cond)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Campus Location */}
      <div className="space-y-3 pt-3 border-t border-ivory-border">
        <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
          Campus Pickup Spot
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => onSelectLocation(e.target.value)}
          className="w-full px-3 py-2 bg-white rounded-xl border border-ivory-border text-xs text-charcoal focus:border-forest outline-none"
        >
          <option value="">All Campus Locations</option>
          {CAMPUS_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

