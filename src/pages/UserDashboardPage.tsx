import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ListingTable } from '@/components/dashboard/ListingTable';
import { OffersList } from '@/components/dashboard/OffersList';
import { Button } from '@/components/ui/Button';
import {
  PlusCircle,
  ShieldCheck,
  ShoppingBag,
  ArrowLeftRight,
  Heart,
  Leaf,
  User,
  ExternalLink,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { listings, favorites, transactions } = useStore();

  const [activeTab, setActiveTab] = useState<'listings' | 'offers' | 'impact'>('listings');

  const myListings = listings.filter((l) => l.sellerId === currentUser.id);
  const activeListings = myListings.filter((l) => l.status === 'active');
  const soldOrCompleted = myListings.filter((l) => l.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-ivory-border">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-16 h-16 rounded-3xl object-cover border-2 border-forest/20 shadow-subtle"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark">
                Welcome back, {currentUser.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
              {currentUser.major} • {currentUser.year} • {currentUser.dormBlock}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to={`/profile/${currentUser.id}`}>
            <Button variant="secondary" size="sm" leftIcon={<User className="w-4 h-4" />}>
              Public Profile
            </Button>
          </Link>
          <Link to="/sell">
            <Button
              variant="lime"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4 text-forest-dark" />}
              className="font-bold shadow-subtle"
            >
              List New Item
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StatsOverview />

      {/* Navigation Tabs */}
      <div className="flex border-b border-ivory-border">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Offers & Negotiations</span>
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'impact'
              ? 'border-forest text-forest'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Personal Circular Impact</span>
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-forest-dark">
              Items You Listed
            </h3>
            <span className="text-xs text-charcoal-muted">
              {activeListings.length} active • {soldOrCompleted.length} completed
            </span>
          </div>

          <ListingTable listings={myListings} />
        </div>
      )}

      {/* Tab 2: Offers & Negotiations */}
      {activeTab === 'offers' && <OffersList />}

      {/* Tab 3: Personal Circular Impact */}
      {activeTab === 'impact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-border shadow-card space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="font-editorial text-2xl font-bold text-forest-dark">
              Your Campus Sustainability Contribution
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              By reusing, donating, lending, and passing forward essentials, you help avoid
              manufacturing waste, reduce hostel move-out landfill dumps, and save money for your peers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-3xl font-bold text-forest-dark">
                {currentUser.itemsReusedCount}
              </span>
              <p className="text-xs font-bold text-forest">Items Circulated</p>
              <p className="text-[11px] text-charcoal-muted">Kept out of waste stream</p>
            </div>

            <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-3xl font-bold text-forest-dark">
                ~{(currentUser.itemsReusedCount * 2.8).toFixed(1)} kg
              </span>
              <p className="text-xs font-bold text-forest">Material Weight Diverted</p>
              <p className="text-[11px] text-charcoal-muted">Estimated diversion coefficient</p>
            </div>

            <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
              <span className="font-editorial text-3xl font-bold text-forest-dark">
                ~{(currentUser.itemsReusedCount * 7.5).toFixed(0)} kg CO2e
              </span>
              <p className="text-xs font-bold text-forest">Carbon Avoidance</p>
              <p className="text-[11px] text-charcoal-muted">Embodied manufacturing emission</p>
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-border flex justify-end">
            <Link to="/impact">
              <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Campus-Wide Sustainability Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
