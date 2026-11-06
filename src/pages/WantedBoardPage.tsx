import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useDebounce } from '@/hooks/useDebounce';
import { CategoryId } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { WantedCard } from '@/components/wanted/WantedCard';
import { CreateWantedModal } from '@/components/wanted/CreateWantedModal';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlusCircle, Sparkles, Filter, Inbox } from 'lucide-react';

export const WantedBoardPage: React.FC = () => {
  const { wantedPosts } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'fulfilled'>('open');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return wantedPosts.filter((post) => {
      // Status
      if (statusFilter !== 'all' && post.status !== statusFilter) return false;

      // Category
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;

      // Search
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchDesc = post.description.toLowerCase().includes(q);
        const matchUser = post.user.name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchUser) return false;
      }

      return true;
    });
  }, [wantedPosts, debouncedSearch, selectedCategory, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ivory-border">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-lime-text bg-lime/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Campus Request Exchange
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-forest-dark">
            The Wanted Board
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl leading-relaxed">
            Need a course textbook, lab coat, or bicycle? Post your request here. Our matching
            engine checks marketplace listings to connect you with peers who have it.
          </p>
        </div>

        <Button
          variant="lime"
          size="lg"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<PlusCircle className="w-5 h-5 text-forest-dark" />}
          className="shadow-subtle hover:shadow-lime-glow font-bold shrink-0"
        >
          Post a Wanted Request
        </Button>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search requested books, calculators, lab gear, bikes..."
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-2xl bg-white border border-ivory-border p-1 text-xs">
              {(['open', 'fulfilled', 'all'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? 'bg-forest text-ivory font-bold'
                      : 'text-charcoal hover:bg-ivory-soft'
                  }`}
                >
                  {status === 'all' ? 'All Requests' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-forest text-ivory border-forest font-bold shadow-xs'
                : 'bg-white hover:bg-ivory-soft text-charcoal border-ivory-border'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-forest text-ivory border-forest font-bold shadow-xs'
                  : 'bg-white hover:bg-ivory-soft text-charcoal border-ivory-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Algorithm Callout Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-forest-dark text-ivory flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-forest-surface shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime text-forest-dark flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Smart Demand-to-Supply Matching Engine
            </h3>
            <p className="text-xs text-sage leading-relaxed mt-0.5">
              Each wanted request is scored against available marketplace listings using natural
              language keyword overlap, category taxonomy, and budget compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Wanted Posts */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests match your search"
          description="Be the first to post what you are looking for this semester!"
          actionLabel="Create Wanted Post"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <WantedCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateWantedModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

