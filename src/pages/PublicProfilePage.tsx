import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { formatRelativeTime } from '@/utils/formatters';
import {
  ShieldCheck,
  Star,
  Award,
  Calendar,
  MapPin,
  BookOpen,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, currentUser } = useAuthStore();
  const { listings, reviews, getOrCreateConversation } = useStore();

  const user = (id && users[id]) || currentUser;
  const userListings = listings.filter((l) => l.sellerId === user.id && l.status === 'active');
  const userReviews = reviews.filter((r) => r.revieweeId === user.id);

  const isCurrentUser = currentUser.id === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Breadcrumb */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-forest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </Link>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 border border-ivory-border shadow-lifted">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-forest/15 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-forest-dark">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{user.verifiedLabel}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-muted">
                {user.major} • {user.year}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted pt-1">
                {user.dormBlock && (
                  <span className="flex items-center gap-1 text-forest font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.dormBlock}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {user.joinedDate.substring(0, 4)}</span>
                </span>
              </div>
            </div>
          </div>

          {!isCurrentUser && (
            <Button
              variant="lime"
              size="md"
              onClick={() => {
                const convId = getOrCreateConversation(
                  userListings[0]?.id || 'direct-inquiry',
                  currentUser.id,
                  user.id
                );
                window.location.href = '/messages';
              }}
              leftIcon={<MessageSquare className="w-4 h-4 text-forest-dark" />}
              className="font-bold shrink-0"
            >
              Contact Student
            </Button>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-6 pt-6 border-t border-ivory-border max-w-3xl">
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
              "{user.bio}"
            </p>
          </div>
        )}

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-ivory-border">
          <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-forest-dark">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{user.rating.toFixed(1)}</span>
            </div>
            <p className="text-[11px] text-charcoal-muted mt-0.5">Trust Rating (5.0)</p>
          </div>

          <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border text-center">
            <span className="font-editorial text-xl font-bold text-forest-dark">
              {user.reviewCount}
            </span>
            <p className="text-[11px] text-charcoal-muted mt-0.5">Peer Reviews</p>
          </div>

          <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border text-center">
            <span className="font-editorial text-xl font-bold text-forest">
              {user.itemsReusedCount}
            </span>
            <p className="text-[11px] text-charcoal-muted mt-0.5">Items Reused</p>
          </div>

          <div className="p-4 rounded-2xl bg-ivory-soft border border-ivory-border text-center">
            <span className="font-editorial text-xl font-bold text-emerald-700">
              100%
            </span>
            <p className="text-[11px] text-charcoal-muted mt-0.5">Campus Pickup Rate</p>
          </div>
        </div>
      </div>

      {/* Active Listings by User */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-forest-dark">
            Active Listings by {user.name} ({userListings.length})
          </h2>
        </div>

        {userListings.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-ivory-border text-center text-xs text-charcoal-muted">
            {user.name} has no active marketplace listings right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userListings.map((item) => (
              <ProductCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

      {/* Peer Reviews Section */}
      <section className="space-y-6">
        <h2 className="font-editorial text-2xl font-bold text-forest-dark">
          Peer Reviews & Endorsements ({userReviews.length})
        </h2>

        {userReviews.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-ivory-border text-center text-xs text-charcoal-muted">
            No reviews submitted yet for this student.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white border border-ivory-border shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-forest-dark">
                        {rev.reviewerName}
                      </h4>
                      <span className="text-[10px] text-charcoal-muted">
                        {formatRelativeTime(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-charcoal-muted italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
