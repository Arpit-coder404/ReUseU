import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '@/types';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatCondition } from '@/utils/formatters';
import { ExchangeBadge, StatusBadge } from '@/components/ui/Badge';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  listing: Listing;
}

export const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const { toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(listing.id);

  const calculateDiscount = () => {
    if (!listing.originalPrice || listing.originalPrice <= listing.price) return null;
    const discount = Math.round(
      ((listing.originalPrice - listing.price) / listing.originalPrice) * 100
    );
    return discount > 0 ? `${discount}% off` : null;
  };

  const discount = calculateDiscount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-ivory-border overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <Link to={`/listing/${listing.id}`} className="relative block aspect-[4/3] overflow-hidden bg-ivory-soft">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status / Feature Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <ExchangeBadge type={listing.exchangeType} />
          {listing.status !== 'active' && <StatusBadge status={listing.status} />}
          {listing.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-forest text-lime font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Trending</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-xs ${
            favorited
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/80 hover:bg-white text-charcoal hover:text-rose-500'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 stroke-rose-500' : ''}`} />
        </button>

        {/* Price / Savings Tag */}
        {discount && (
          <div className="absolute bottom-3 left-3 bg-forest-dark/90 backdrop-blur-xs text-lime text-[11px] font-bold px-2.5 py-1 rounded-lg">
            Save {discount}
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted mb-1.5">
            <span className="font-medium capitalize text-forest">{listing.category}</span>
            <span className="text-[11px] bg-ivory-soft px-2 py-0.5 rounded-md border border-ivory-border">
              {formatCondition(listing.condition)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/listing/${listing.id}`} className="block group-hover:text-forest transition-colors">
            <h3 className="font-editorial text-base sm:text-lg font-bold text-forest-dark leading-snug line-clamp-2">
              {listing.title}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="mt-3 flex items-baseline gap-2">
            {listing.exchangeType === 'donate' ? (
              <span className="text-lg font-bold text-forest bg-lime/40 px-2.5 py-0.5 rounded-lg">
                Free Donation
              </span>
            ) : listing.exchangeType === 'swap' ? (
              <span className="text-sm font-bold text-forest bg-sage/30 px-2.5 py-0.5 rounded-lg truncate max-w-full">
                Swap Proposal
              </span>
            ) : listing.exchangeType === 'lend' ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-editorial text-xl font-bold text-forest-dark">
                  {formatCurrency(listing.price)}
                </span>
                <span className="text-xs text-charcoal-muted">
                  / {listing.lendDurationDays || 7} days
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-xl font-bold text-forest-dark">
                  {formatCurrency(listing.price)}
                </span>
                {listing.originalPrice && listing.originalPrice > listing.price && (
                  <span className="text-xs text-charcoal-muted line-through">
                    {formatCurrency(listing.originalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Seller & Pickup spot */}
        <div className="mt-4 pt-3 border-t border-ivory-border flex items-center justify-between text-xs text-charcoal-muted">
          <Link
            to={`/profile/${listing.seller.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 hover:text-forest transition-colors"
          >
            <img
              src={listing.seller.avatarUrl}
              alt={listing.seller.name}
              className="w-5 h-5 rounded-full object-cover border border-ivory-border"
            />
            <span className="truncate max-w-[90px] font-medium">{listing.seller.name}</span>
          </Link>

          <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px] text-forest/80">
            <MapPin className="w-3 h-3 shrink-0 text-forest" />
            <span className="truncate">{listing.pickupLocation}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
