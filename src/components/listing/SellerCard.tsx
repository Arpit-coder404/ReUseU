import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types';
import { ShieldCheck, Star, Award, ChevronRight } from 'lucide-react';

interface SellerCardProps {
  seller: UserProfile;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-ivory-border shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
          Listed by Student
        </span>
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Campus Verified</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <Link to={`/profile/${seller.id}`}>
          <img
            src={seller.avatarUrl}
            alt={seller.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-forest/20 shadow-xs hover:opacity-90 transition-opacity"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${seller.id}`}
            className="font-editorial text-lg font-bold text-forest-dark hover:underline block truncate"
          >
            {seller.name}
          </Link>
          <p className="text-xs text-charcoal-muted truncate">
            {seller.major} • {seller.year}
          </p>
          {seller.dormBlock && (
            <p className="text-[11px] text-forest font-medium truncate mt-0.5">
              📍 {seller.dormBlock}
            </p>
          )}
        </div>
      </div>

      {/* Trust & Reused Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ivory-border text-center">
        <div className="p-2.5 rounded-xl bg-ivory-soft">
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-forest-dark">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{seller.rating.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-charcoal-muted">
            {seller.reviewCount} peer reviews
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-ivory-soft">
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-forest">
            <Award className="w-4 h-4 text-forest" />
            <span>{seller.itemsReusedCount}</span>
          </div>
          <p className="text-[10px] text-charcoal-muted">items reused</p>
        </div>
      </div>

      {seller.bio && (
        <p className="text-xs text-charcoal-muted italic line-clamp-2">
          "{seller.bio}"
        </p>
      )}

      <Link
        to={`/profile/${seller.id}`}
        className="w-full py-2 px-3 rounded-xl bg-ivory hover:bg-ivory-soft text-forest text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
      >
        <span>View Full Student Profile</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
