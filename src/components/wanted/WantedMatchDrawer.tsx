import React from 'react';
import { Link } from 'react-router-dom';
import { WantedPost } from '@/types';
import { useStore } from '@/store/useStore';
import { findMatchesForWanted } from '@/services/matchingService';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatCondition } from '@/utils/formatters';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ExchangeBadge } from '@/components/ui/Badge';

interface WantedMatchDrawerProps {
  wanted: WantedPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WantedMatchDrawer: React.FC<WantedMatchDrawerProps> = ({
  wanted,
  isOpen,
  onClose,
}) => {
  const { listings } = useStore();

  if (!wanted) return null;

  const matches = findMatchesForWanted(wanted, listings);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-lime-text" />
          <span>Marketplace Matches for Request</span>
        </div>
      }
      description={`Algorithm matched ${matches.length} active items based on category, keywords & budget.`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Request Details banner */}
        <div className="p-3.5 rounded-2xl bg-ivory-soft border border-ivory-border">
          <h4 className="text-xs font-bold text-forest-dark">{wanted.title}</h4>
          <p className="text-[11px] text-charcoal-muted mt-0.5">
            Category: {wanted.category} • Budget:{' '}
            {wanted.maxBudget ? `Up to $${wanted.maxBudget}` : 'Flexible'}
          </p>
        </div>

        {/* Results */}
        {matches.length === 0 ? (
          <div className="text-center py-8 text-xs text-charcoal-muted">
            No exact matches in the marketplace yet. We will notify you when a peer posts one!
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {matches.map(({ listing, score, reasons }) => (
              <div
                key={listing.id}
                className="p-4 rounded-2xl bg-white border border-ivory-border hover:border-forest/40 transition-colors shadow-xs flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={listing.images[0]}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] bg-lime text-forest-dark font-bold px-2 py-0.5 rounded-full">
                        {score}% Match
                      </span>
                      <ExchangeBadge type={listing.exchangeType} size="sm" />
                    </div>
                    <h5 className="text-xs font-bold text-forest-dark truncate">
                      {listing.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-charcoal-muted mt-0.5">
                      <span className="font-bold text-forest">
                        {formatCurrency(listing.price)}
                      </span>
                      <span>•</span>
                      <span>{listing.pickupLocation}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {reasons.map((r, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-ivory-soft text-charcoal-muted px-2 py-0.2 rounded-md"
                        >
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/listing/${listing.id}`}
                  onClick={onClose}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>View Item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

