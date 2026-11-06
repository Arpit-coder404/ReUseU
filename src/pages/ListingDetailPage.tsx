import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency, formatCondition, formatDate } from '@/utils/formatters';
import { ListingGallery } from '@/components/listing/ListingGallery';
import { SellerCard } from '@/components/listing/SellerCard';
import { ExchangeActionModal } from '@/components/listing/ExchangeActionModal';
import { ReportModal } from '@/components/listing/ReportModal';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ExchangeBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Heart,
  Share2,
  Flag,
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Gift,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { listings, toggleFavorite, isFavorite, getOrCreateConversation } = useStore();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-forest-dark">
          Listing Not Found
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          This item may have been completed, reserved, or removed by its student owner.
        </p>
        <Link to="/marketplace">
          <Button variant="primary">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(listing.id);
  const isOwner = currentUser.id === listing.sellerId;

  const similarListings = listings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  const handleContactSeller = () => {
    const convId = getOrCreateConversation(listing.id, currentUser.id, listing.sellerId);
    navigate('/messages');
  };

  const getPrimaryActionLabel = () => {
    switch (listing.exchangeType) {
      case 'sell':
        return 'Make an Offer';
      case 'donate':
        return 'Request Donation (Free)';
      case 'lend':
        return 'Request to Borrow';
      case 'swap':
        return 'Propose a Campus Swap';
    }
  };

  const getActionIcon = () => {
    switch (listing.exchangeType) {
      case 'sell':
        return <Tag className="w-4 h-4 text-forest-dark" />;
      case 'donate':
        return <Gift className="w-4 h-4 text-forest-dark" />;
      case 'lend':
        return <Clock className="w-4 h-4 text-forest-dark" />;
      case 'swap':
        return <RefreshCw className="w-4 h-4 text-forest-dark" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              favorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-charcoal border-ivory-border hover:bg-ivory-soft'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save item'}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-2.5 rounded-2xl border border-ivory-border bg-white text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Report this listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery on left, Specs & Actions on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          <ListingGallery images={listing.images} title={listing.title} />

          {/* Description Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-subtle space-y-6">
            <h3 className="font-editorial text-xl font-bold text-forest-dark">
              About this item
            </h3>
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {/* Swap preference or lend info if applicable */}
            {listing.exchangeType === 'swap' && listing.swapPreference && (
              <div className="p-4 rounded-2xl bg-sage/20 border border-sage/40 space-y-1">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">
                  Owner's Swap Preference
                </span>
                <p className="text-xs text-forest-dark font-medium">
                  "{listing.swapPreference}"
                </p>
              </div>
            )}

            {listing.exchangeType === 'lend' && listing.lendDurationDays && (
              <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border space-y-1">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">
                  Lending Period
                </span>
                <p className="text-xs text-charcoal font-medium">
                  Standard loan duration is {listing.lendDurationDays} days. Dates and return
                  location can be arranged via chat.
                </p>
              </div>
            )}

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-ivory-border">
                <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                  Tags & Course Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-ivory-soft text-forest font-medium border border-ivory-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safe campus exchange guarantee */}
            <div className="p-4 rounded-2xl bg-forest/5 border border-forest/15 flex items-start gap-3 text-xs text-charcoal-muted">
              <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-forest-dark">Campus Safe Pickup Guarantee</p>
                <p className="mt-0.5 leading-relaxed text-[11px]">
                  All ReUseU exchanges are conducted inside designated campus quads. Inspect the
                  item in person before handing over money or swap items.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Primary CTA, Pickup Spot & Seller Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-border shadow-card space-y-6">
            {/* Category & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExchangeBadge type={listing.exchangeType} size="md" />
                <ConditionBadge condition={listing.condition} size="md" />
              </div>
              <StatusBadge status={listing.status} />
            </div>

            {/* Title */}
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-forest-dark leading-tight">
              {listing.title}
            </h1>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-ivory-soft border border-ivory-border">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold block">
                    {listing.exchangeType === 'donate'
                      ? 'Student Giveaway'
                      : listing.exchangeType === 'lend'
                      ? 'Lending Fee'
                      : 'Peer Price'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
                      {listing.exchangeType === 'donate'
                        ? 'Free ($0)'
                        : formatCurrency(listing.price)}
                    </span>
                    {listing.originalPrice && listing.originalPrice > listing.price && (
                      <span className="text-sm text-charcoal-muted line-through">
                        {formatCurrency(listing.originalPrice)} retail
                      </span>
                    )}
                  </div>
                </div>

                {listing.originalPrice && listing.originalPrice > listing.price && (
                  <div className="bg-forest text-lime text-xs font-bold px-2.5 py-1 rounded-lg">
                    Save $
                    {(listing.originalPrice - listing.price).toFixed(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Location Card */}
            <div className="p-4 rounded-2xl border border-ivory-border bg-white flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                  Pickup Location
                </span>
                <p className="text-xs font-bold text-forest-dark truncate">
                  {listing.pickupLocation}
                </p>
                <p className="text-[10px] text-charcoal-muted mt-0.5">
                  Monitored campus area with student foot traffic.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {isOwner ? (
                <div className="p-4 rounded-2xl bg-ivory-soft text-center text-xs text-charcoal-muted space-y-2">
                  <p className="font-semibold text-forest-dark">
                    You listed this item
                  </p>
                  <Link to="/dashboard">
                    <Button variant="primary" size="sm" className="w-full">
                      Manage in Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    variant="lime"
                    size="lg"
                    className="w-full text-base font-bold shadow-subtle hover:shadow-lime-glow"
                    onClick={() => setIsActionModalOpen(true)}
                    leftIcon={getActionIcon()}
                  >
                    {getPrimaryActionLabel()}
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full text-xs font-semibold"
                    onClick={handleContactSeller}
                    leftIcon={<MessageSquare className="w-4 h-4 text-forest" />}
                  >
                    Ask Seller a Question
                  </Button>
                </>
              )}
            </div>

            {/* Meta Row: Views & Posted Date */}
            <div className="pt-3 border-t border-ivory-border flex items-center justify-between text-[11px] text-charcoal-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Listed {formatDate(listing.createdAt)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{listing.views} views</span>
              </span>
            </div>
          </div>

          {/* Seller Card */}
          <SellerCard seller={listing.seller} />
        </div>
      </div>

      {/* Similar Listings Carousel/Grid */}
      {similarListings.length > 0 && (
        <section className="pt-12 border-t border-ivory-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-forest-dark">
              Similar items in {listing.category}
            </h3>
            <Link
              to={`/marketplace?category=${listing.category}`}
              className="text-xs font-semibold text-forest hover:underline"
            >
              View category
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <ProductCard key={sim.id} listing={sim} />
            ))}
          </div>
        </section>
      )}

      {/* Action Modal */}
      <ExchangeActionModal
        listing={listing}
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        listing={listing}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

