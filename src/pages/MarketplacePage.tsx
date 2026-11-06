import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useDebounce } from '@/hooks/useDebounce';
import { CategoryId, ExchangeType, ItemCondition, Listing } from '@/types';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { ActiveFilters } from '@/components/marketplace/ActiveFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { SlidersHorizontal, ArrowUpDown, PackageSearch } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings } = useStore();

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filters from URL or state
  const initialCategory = (searchParams.get('category') as CategoryId) || 'all';
  const initialExchange = (searchParams.get('exchangeType') as ExchangeType) || 'all';

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [selectedExchangeType, setSelectedExchangeType] = useState<ExchangeType | 'all'>(initialExchange);
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular'>('recent');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filtering & Sorting
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Search
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
        }

        // Category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Exchange type
        if (selectedExchangeType !== 'all' && item.exchangeType !== selectedExchangeType) {
          return false;
        }

        // Condition
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
          return false;
        }

        // Pickup Location
        if (
          selectedLocation &&
          item.pickupLocation.toLowerCase() !== selectedLocation.toLowerCase()
        ) {
          return false;
        }

        // Max price (donations always 0 so they pass)
        if (item.exchangeType !== 'donate' && item.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'popular':
            return (b.views || 0) + (b.favoritesCount || 0) * 2 - ((a.views || 0) + (a.favoritesCount || 0) * 2);
          case 'recent':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [
    listings,
    debouncedSearch,
    selectedCategory,
    selectedExchangeType,
    selectedCondition,
    selectedLocation,
    maxPrice,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedExchangeType('all');
    setSelectedCondition('all');
    setSelectedLocation('');
    setMaxPrice(300);
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-lime-text bg-lime/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Campus Exchange Catalog
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-forest-dark">
          Explore Campus Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Affordable textbooks, graphing calculators, lab coats, and hostel essentials from verified
          peers across campus quads.
        </p>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex-1 sm:flex-initial px-4 py-3 bg-white rounded-2xl border border-ivory-border text-xs font-semibold text-forest flex items-center justify-center gap-2 shadow-subtle"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center bg-white rounded-2xl border border-ivory-border px-3 py-2.5 shadow-subtle text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-forest mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-forest-dark outline-none cursor-pointer pr-2"
            >
              <option value="recent">Recently Listed</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilters
        selectedCategory={selectedCategory}
        selectedExchangeType={selectedExchangeType}
        selectedCondition={selectedCondition}
        selectedLocation={selectedLocation}
        maxPrice={maxPrice}
        onClearCategory={() => setSelectedCategory('all')}
        onClearExchangeType={() => setSelectedExchangeType('all')}
        onClearCondition={() => setSelectedCondition('all')}
        onClearLocation={() => setSelectedLocation('')}
        onClearPrice={() => setMaxPrice(300)}
        onClearAll={handleResetFilters}
      />

      {/* Main Grid Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedExchangeType={selectedExchangeType}
            onSelectExchangeType={setSelectedExchangeType}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            maxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onReset={handleResetFilters}
            totalResultsCount={filteredListings.length}
          />
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-forest-dark/50 backdrop-blur-xs flex justify-end p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 h-full overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-border">
                <h3 className="font-editorial text-lg font-bold text-forest-dark">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs font-bold text-forest bg-ivory-soft px-3 py-1.5 rounded-xl"
                >
                  Done
                </button>
              </div>
              <FilterSidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedExchangeType={selectedExchangeType}
                onSelectExchangeType={setSelectedExchangeType}
                selectedCondition={selectedCondition}
                onSelectCondition={setSelectedCondition}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                maxPrice={maxPrice}
                onChangeMaxPrice={setMaxPrice}
                onReset={handleResetFilters}
                totalResultsCount={filteredListings.length}
              />
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredListings.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No items matched your filters"
              description="Try broadening your category, increasing the price range, or searching for other course keywords."
              actionLabel="Reset all filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <ProductCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
