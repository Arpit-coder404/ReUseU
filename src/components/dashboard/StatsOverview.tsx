import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingBag, ArrowLeftRight, Heart, Star, Sparkles, Award } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { listings, transactions, favorites, offers } = useStore();

  const userListings = listings.filter((l) => l.sellerId === currentUser.id);
  const activeListings = userListings.filter((l) => l.status === 'active');
  const userTransactions = transactions.filter(
    (t) => t.sellerId === currentUser.id || t.buyerId === currentUser.id
  );
  const completedCount = userTransactions.filter((t) => t.status === 'completed').length;

  const totalEarned = userTransactions
    .filter((t) => t.sellerId === currentUser.id && t.status === 'completed')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const pendingIncomingOffers = offers.filter(
    (o) => o.receiverId === currentUser.id && o.status === 'pending'
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Listings */}
      <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Active Listings
          </span>
          <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-forest-dark">
            {activeListings.length}
          </span>
          <span className="text-xs text-charcoal-muted">
            of {userListings.length} items
          </span>
        </div>
      </div>

      {/* Completed Exchanges */}
      <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Exchanges Done
          </span>
          <div className="w-8 h-8 rounded-xl bg-lime/30 flex items-center justify-center text-forest-dark">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-forest-dark">
            {completedCount}
          </span>
          <span className="text-xs text-charcoal-muted">on campus</span>
        </div>
      </div>

      {/* Recovered Value */}
      <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Value Recovered
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-forest-dark">
            {formatCurrency(totalEarned)}
          </span>
          <span className="text-xs text-charcoal-muted">student earnings</span>
        </div>
      </div>

      {/* Pending Offers */}
      <div className="p-5 rounded-3xl bg-white border border-ivory-border shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Incoming Offers
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-forest-dark">
            {pendingIncomingOffers.length}
          </span>
          <span className="text-xs text-charcoal-muted">awaiting reply</span>
        </div>
      </div>
    </div>
  );
};
