import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { listings, favorites } = useStore();

  const savedListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-ivory-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Saved for Later</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
            Your Saved Items ({savedListings.length})
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Track textbooks, gadgets, and campus finds you are interested in.
          </p>
        </div>

        {savedListings.length > 0 && (
          <Link to="/marketplace">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Browse more items
            </Button>
          </Link>
        )}
      </div>

      {savedListings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved items yet"
          description="Click the heart icon on any product card in the marketplace to bookmark it here for quick access."
          actionLabel="Explore the marketplace"
          onAction={() => (window.location.href = '/marketplace')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedListings.map((item) => (
            <ProductCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
};

