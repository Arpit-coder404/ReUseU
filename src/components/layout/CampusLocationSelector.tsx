import React from 'react';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { CampusLocation } from '@/types';
import { MapPin, Shield, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CampusLocationSelectorProps {
  selectedLocation: string;
  onSelectLocation: (locationName: string) => void;
  className?: string;
  compact?: boolean;
}

export const CampusLocationSelector: React.FC<CampusLocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
  className,
  compact = false,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-forest-dark uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-forest" />
          <span>Designated Safe Campus Pickup Spot</span>
        </label>
        <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span>Monitored & Well-Lit</span>
        </span>
      </div>

      {/* Campus Illustrated Interactive Grid */}
      <div className={cn('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
        {CAMPUS_LOCATIONS.map((loc: CampusLocation) => {
          const isSelected =
            selectedLocation.toLowerCase() === loc.name.toLowerCase() ||
            selectedLocation.toLowerCase() === loc.id.toLowerCase();

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelectLocation(loc.name)}
              className={cn(
                'text-left p-3 rounded-2xl border transition-all duration-200 relative group flex items-start gap-3',
                isSelected
                  ? 'bg-forest text-ivory border-forest shadow-md'
                  : 'bg-white/80 hover:bg-white text-charcoal border-ivory-border hover:border-forest/30 shadow-xs'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  isSelected
                    ? 'bg-lime text-forest-dark'
                    : 'bg-ivory-soft text-forest group-hover:bg-lime/30'
                )}
              >
                {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <MapPin className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={cn(
                      'text-xs font-bold truncate',
                      isSelected ? 'text-white' : 'text-forest-dark'
                    )}
                  >
                    {loc.name}
                  </h4>
                  {loc.isPopular && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0',
                        isSelected ? 'bg-forest-light text-lime' : 'bg-lime/30 text-forest-dark'
                      )}
                    >
                      Top Pick
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    'text-[11px] truncate mt-0.5',
                    isSelected ? 'text-lime' : 'text-forest font-medium'
                  )}
                >
                  Zone: {loc.zone}
                </p>
                <p
                  className={cn(
                    'text-[10px] leading-tight line-clamp-2 mt-1',
                    isSelected ? 'text-ivory-soft' : 'text-charcoal-muted'
                  )}
                >
                  {loc.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
