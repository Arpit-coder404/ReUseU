import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Listing, ListingStatus } from '@/types';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatCondition } from '@/utils/formatters';
import { StatusBadge, ExchangeBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Trash2, CheckCircle2, PauseCircle, PlayCircle, Eye } from 'lucide-react';

interface ListingTableProps {
  listings: Listing[];
}

export const ListingTable: React.FC<ListingTableProps> = ({ listings }) => {
  const { updateListingStatus, deleteListing } = useStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (listings.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-ivory-border text-center space-y-3">
        <p className="text-xs sm:text-sm text-charcoal-muted">
          You haven't posted any items for sale, lend, swap, or donation yet.
        </p>
        <Link to="/sell">
          <Button variant="primary" size="sm">
            List your first item
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-ivory-border overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-soft text-charcoal-muted font-semibold uppercase tracking-wider border-b border-ivory-border">
            <tr>
              <th className="p-4 sm:p-5">Item</th>
              <th className="p-4 sm:p-5">Mode & Price</th>
              <th className="p-4 sm:p-5">Status</th>
              <th className="p-4 sm:p-5">Pickup Spot</th>
              <th className="p-4 sm:p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-border text-charcoal">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-ivory/50 transition-colors">
                {/* Item */}
                <td className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/listing/${item.id}`}
                        className="font-bold text-forest-dark hover:underline block truncate max-w-xs"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] text-charcoal-muted capitalize">
                        {item.category} • {formatCondition(item.condition)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Mode & Price */}
                <td className="p-4 sm:p-5">
                  <div className="space-y-1">
                    <ExchangeBadge type={item.exchangeType} size="sm" />
                    <div className="font-bold text-forest-dark text-xs">
                      {item.exchangeType === 'donate'
                        ? 'Free Giveaway'
                        : item.exchangeType === 'swap'
                        ? 'Swap Proposal'
                        : formatCurrency(item.price)}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4 sm:p-5">
                  <StatusBadge status={item.status} />
                </td>

                {/* Pickup Location */}
                <td className="p-4 sm:p-5 text-charcoal-muted truncate max-w-[150px]">
                  {item.pickupLocation}
                </td>

                {/* Actions */}
                <td className="p-4 sm:p-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/listing/${item.id}`}
                      className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest hover:bg-ivory-soft transition-colors"
                      title="View public listing"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {item.status === 'active' ? (
                      <button
                        onClick={() => updateListingStatus(item.id, 'reserved')}
                        className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                        title="Mark as Reserved"
                      >
                        <PauseCircle className="w-4 h-4" />
                      </button>
                    ) : item.status === 'reserved' ? (
                      <button
                        onClick={() => updateListingStatus(item.id, 'active')}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Reactivate listing"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </button>
                    ) : null}

                    {item.status !== 'completed' && (
                      <button
                        onClick={() => updateListingStatus(item.id, 'completed')}
                        className="p-1.5 rounded-lg text-forest hover:bg-ivory-soft transition-colors"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteListing(item.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-ivory-soft text-charcoal rounded text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

