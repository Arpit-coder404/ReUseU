import React, { useState } from 'react';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';
import { CampusLocation } from '@/types';
import { MapPin, ShieldCheck, Clock, Navigation, Info, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface IllustratedCampusMapProps {
  selectedLocationName: string;
  onSelectLocation: (locationName: string) => void;
}

export const IllustratedCampusMap: React.FC<IllustratedCampusMapProps> = ({
  selectedLocationName,
  onSelectLocation,
}) => {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Map coordinates and SVG anchor points for campus visualizer
  const MAP_NODES: Record<string, { x: number; y: number; label: string; zone: string }> = {
    'main-library': { x: 50, y: 38, label: 'Main Library', zone: 'Central Quad' },
    'student-centre': { x: 74, y: 46, label: 'Student Activity Centre (SAC)', zone: 'East Wing' },
    'academic-block-a': { x: 28, y: 34, label: 'Academic Block A', zone: 'Engineering Quad' },
    'central-canteen': { x: 62, y: 72, label: 'Central Canteen', zone: 'South Campus' },
    'hostel-block-4': { x: 82, y: 22, label: 'Hostel Block 4', zone: 'Residential Village' },
    'sports-complex': { x: 18, y: 68, label: 'Sports Arena', zone: 'West Fields' },
    'innovation-hub': { x: 38, y: 20, label: 'Innovation Hub', zone: 'Tech Cluster' },
  };

  const selectedLoc = CAMPUS_LOCATIONS.find(
    (l) => l.name.toLowerCase() === selectedLocationName.toLowerCase()
  ) || CAMPUS_LOCATIONS[0];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-ivory-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ivory-border">
        <div>
          <span className="text-xs font-semibold text-lime-text bg-lime/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Safe Handover Infrastructure
          </span>
          <h3 className="font-editorial text-xl font-bold text-forest-dark mt-1">
            Illustrated Campus Exchange Map
          </h3>
          <p className="text-xs text-charcoal-muted">
            Click any designated safe zone pin to set your exchange meeting point.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & Camera Monitored</span>
        </div>
      </div>

      {/* Interactive Campus SVG Visualizer */}
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-ivory-warm border border-ivory-border overflow-hidden p-4 shadow-inner">
        {/* Stylized Quad pathways */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full pointer-events-none select-none absolute inset-0 opacity-80"
          preserveAspectRatio="none"
        >
          {/* Green zones / Quad lawns */}
          <rect x="8" y="10" width="84" height="80" rx="16" fill="#ECE9DF" stroke="#E2DEC9" strokeWidth="1" />
          <circle cx="50" cy="40" r="22" fill="#dce6d9" opacity="0.6" />
          <circle cx="28" cy="65" r="14" fill="#dce6d9" opacity="0.5" />
          <circle cx="75" cy="65" r="14" fill="#dce6d9" opacity="0.5" />

          {/* Walkways and Paths connecting campus landmarks */}
          <line x1="28" y1="34" x2="50" y2="38" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="1.5,1.5" />
          <line x1="50" y1="38" x2="74" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="1.5,1.5" />
          <line x1="50" y1="38" x2="62" y2="72" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="1.5,1.5" />
          <line x1="28" y1="34" x2="18" y2="68" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" />
          <line x1="38" y1="20" x2="28" y2="34" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" />
          <line x1="74" y1="46" x2="82" y2="22" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" />
          <line x1="18" y1="68" x2="62" y2="72" stroke="#ffffff" strokeWidth="2" strokeDasharray="1.5,1.5" />

          {/* Central fountain / Clocktower marker */}
          <circle cx="50" cy="50" r="3.5" fill="#173F35" opacity="0.15" />
          <text x="50" y="58" textAnchor="middle" fontSize="3" fill="#6E7A6B" fontWeight="600">
            CAMPUS CENTRAL CLOCKTOWER
          </text>
        </svg>

        {/* Interactive Location Pin Buttons */}
        {CAMPUS_LOCATIONS.map((loc) => {
          const coords = MAP_NODES[loc.id] || { x: 50, y: 50 };
          const isSelected =
            selectedLocationName.toLowerCase() === loc.name.toLowerCase() ||
            selectedLocationName.toLowerCase() === loc.id.toLowerCase();

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelectLocation(loc.name)}
              onMouseEnter={() => setActiveHoverId(loc.id)}
              onMouseLeave={() => setActiveHoverId(null)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300 focus:outline-none',
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              )}
              aria-label={`Select ${loc.name}`}
            >
              <div
                className={cn(
                  'px-2.5 py-1 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border',
                  isSelected
                    ? 'bg-forest text-lime border-forest ring-4 ring-forest/20'
                    : 'bg-white text-forest-dark border-ivory-border hover:border-forest group-hover:bg-forest group-hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isSelected ? 'bg-lime animate-ping' : 'bg-forest'
                  )}
                />
                <span className="truncate max-w-[120px] sm:max-w-none">{loc.name}</span>
                {isSelected && <Check className="w-3 h-3 text-lime stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Location Card Display */}
      {selectedLoc && (
        <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-forest text-lime flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-editorial text-base font-bold text-forest-dark">
                  {selectedLoc.name}
                </h4>
                <span className="text-[10px] bg-lime text-forest-dark px-2 py-0.5 rounded-full font-bold">
                  {selectedLoc.zone}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
                {selectedLoc.description}
              </p>
            </div>
          </div>

          <div className="text-xs text-forest font-semibold flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-ivory-border shrink-0">
            <Clock className="w-4 h-4 text-forest" />
            <span>Optimal Hours: 9:00 AM – 8:00 PM</span>
          </div>
        </div>
      )}
    </div>
  );
};

