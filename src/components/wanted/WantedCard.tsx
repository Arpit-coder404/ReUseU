import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WantedPost } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { findMatchesForWanted } from '@/services/matchingService';
import { WantedMatchDrawer } from './WantedMatchDrawer';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/formatters';
import {
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface WantedCardProps {
  post: WantedPost;
}

export const WantedCard: React.FC<WantedCardProps> = ({ post }) => {
  const { currentUser } = useAuthStore();
  const { listings, fulfillWantedPost, getOrCreateConversation } = useStore();
  const navigate = useNavigate();

  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const matches = findMatchesForWanted(post, listings);
  const isOwner = currentUser.id === post.userId;

  const handleContactUser = () => {
    // If owner has active listings, we can connect
    const firstListing = listings[0];
    const convId = getOrCreateConversation(
      firstListing ? firstListing.id : 'wanted-inquiry',
      currentUser.id,
      post.userId
    );
    navigate('/messages');
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-ivory-border shadow-card hover:shadow-lifted transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Header Row: Category, Urgency, Status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-forest capitalize bg-ivory-soft px-2.5 py-0.5 rounded-full border border-ivory-border">
                {post.category}
              </span>
              {post.urgency === 'high' && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Urgent (48h)</span>
                </span>
              )}
            </div>

            {post.status === 'fulfilled' ? (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Fulfilled</span>
              </span>
            ) : (
              <span className="text-[11px] text-charcoal-muted">
                {formatRelativeTime(post.createdAt)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-forest-dark mb-2 leading-snug">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed mb-4">
            {post.description}
          </p>

          {/* Meta specs: Budget & Condition */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
            <div className="p-2 rounded-xl bg-ivory-soft border border-ivory-border flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-forest" />
              <span className="font-bold text-forest">
                {post.maxBudget ? `Budget: Up to $${post.maxBudget}` : 'Budget: Flexible'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-ivory-soft border border-ivory-border text-charcoal-muted">
              Condition: <strong className="capitalize text-charcoal">{post.preferredCondition}</strong>
            </div>
          </div>
        </div>

        {/* Footer Area: User details + Match Algorithm CTA */}
        <div className="pt-4 border-t border-ivory-border space-y-3">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${post.user.id}`}
              className="flex items-center gap-2 group hover:text-forest"
            >
              <img
                src={post.user.avatarUrl}
                alt={post.user.name}
                className="w-7 h-7 rounded-full object-cover border border-ivory-border"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-forest-dark group-hover:underline block truncate">
                  {post.user.name}
                </span>
                <span className="text-[10px] text-charcoal-muted truncate block">
                  {post.user.major}
                </span>
              </div>
            </Link>

            {/* Algorithmic Match Pill */}
            {matches.length > 0 && post.status === 'open' && (
              <button
                type="button"
                onClick={() => setMatchDrawerOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-lime text-forest-dark text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-lime-hover transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{matches.length} matches</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isOwner && post.status === 'open' ? (
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => fulfillWantedPost(post.id)}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Mark as Fulfilled
              </Button>
            ) : post.status === 'open' ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={handleContactUser}
                leftIcon={<MessageSquare className="w-3.5 h-3.5 text-lime" />}
              >
                I have this item
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <WantedMatchDrawer
        wanted={post}
        isOpen={matchDrawerOpen}
        onClose={() => setMatchDrawerOpen(false)}
      />
    </>
  );
};

