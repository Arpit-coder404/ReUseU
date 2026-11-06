import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Transaction, Review } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ExchangeBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ShoppingBag,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OrdersHistoryPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { transactions, addReview } = useStore();

  const [reviewTx, setReviewTx] = useState<Transaction | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const userTransactions = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTx) return;

    const revieweeId = reviewTx.buyerId === currentUser.id ? reviewTx.sellerId : reviewTx.buyerId;

    const newRev: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      transactionId: reviewTx.id,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatarUrl,
      revieweeId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    addReview(newRev);
    setReviewTx(null);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 pb-6 border-b border-ivory-border">
        <span className="text-xs font-semibold text-lime-text bg-lime/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Student Transactions
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark">
          Exchanges & Handover History
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          All your completed campus pickups, peer swaps, and student donations.
        </p>
      </div>

      {userTransactions.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No exchange history yet"
          description="When you buy, swap, borrow, or donate items on campus, your records and receipts will show here."
          actionLabel="Explore marketplace"
          onAction={() => (window.location.href = '/marketplace')}
        />
      ) : (
        <div className="space-y-4">
          {userTransactions.map((tx) => {
            const isBuyer = tx.buyerId === currentUser.id;
            const peerName = isBuyer ? tx.sellerName : tx.buyerName;

            return (
              <div
                key={tx.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-ivory-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={tx.listingImage}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ExchangeBadge type={tx.exchangeType} size="sm" />
                      <span className="text-[11px] text-charcoal-muted">
                        {formatDate(tx.completedAt)}
                      </span>
                    </div>

                    <h3 className="font-editorial text-base sm:text-lg font-bold text-forest-dark truncate">
                      {tx.listingTitle}
                    </h3>

                    <p className="text-xs text-charcoal-muted mt-0.5">
                      {isBuyer ? 'Purchased / Received from' : 'Passed on to'}:{' '}
                      <strong className="text-forest-dark">{peerName}</strong> •{' '}
                      <span>{isBuyer ? 'Buyer' : 'Seller'}</span>
                    </p>

                    <div className="flex items-center gap-2 text-xs text-forest font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Pickup Spot: {tx.pickupLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-ivory-border">
                  <div className="text-right">
                    <span className="font-editorial text-xl font-bold text-forest-dark">
                      {formatCurrency(tx.amount)}
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{tx.status === 'completed' ? 'Completed' : 'Pending Pickup'}</span>
                    </span>
                  </div>

                  {tx.status === 'completed' && !tx.reviewedByBuyer && isBuyer && (
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => setReviewTx(tx)}
                      leftIcon={<Star className="w-3.5 h-3.5 text-forest-dark" />}
                    >
                      Review Peer
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewTx && (
        <Modal
          isOpen={Boolean(reviewTx)}
          onClose={() => setReviewTx(null)}
          title="Review Your Campus Peer"
          description={`How was your exchange experience with ${reviewTx.sellerName}?`}
          maxWidth="md"
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Rating
              </label>
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-ivory-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
                Feedback Comment
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Was the item in good condition? Was pickup at the campus spot on time?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button type="button" variant="secondary" onClick={() => setReviewTx(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Post Review
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
