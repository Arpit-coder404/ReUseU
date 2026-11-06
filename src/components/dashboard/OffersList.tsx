import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { ExchangeBadge } from '@/components/ui/Badge';
import { Check, X, MessageSquare, ArrowRight } from 'lucide-react';

export const OffersList: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { offers, respondToOffer, completeOfferTransaction, getOrCreateConversation } = useStore();

  const incomingOffers = offers.filter((o) => o.receiverId === currentUser.id);
  const sentOffers = offers.filter((o) => o.senderId === currentUser.id);

  return (
    <div className="space-y-8">
      {/* Incoming Offers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-lg font-bold text-forest-dark">
            Incoming Peer Offers ({incomingOffers.length})
          </h3>
          <span className="text-xs text-charcoal-muted">
            Offers sent to you by students
          </span>
        </div>

        {incomingOffers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-ivory-border text-center text-xs text-charcoal-muted">
            No incoming offers at the moment. As peers browse your items, their offers will appear here!
          </div>
        ) : (
          <div className="space-y-3">
            {incomingOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-ivory-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={offer.listingImage}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ExchangeBadge type={offer.offerType} size="sm" />
                      <span className="text-[11px] text-charcoal-muted">
                        {formatRelativeTime(offer.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-forest-dark truncate">
                      {offer.listingTitle}
                    </h4>

                    <p className="text-xs text-charcoal-muted mt-0.5">
                      From:{' '}
                      <strong className="text-forest-dark">{offer.senderName}</strong>
                      {offer.offeredPrice !== undefined && (
                        <span>
                          {' '}
                          • Offered:{' '}
                          <strong className="text-forest font-bold">
                            {formatCurrency(offer.offeredPrice)}
                          </strong>
                        </span>
                      )}
                    </p>

                    {offer.offeredItemDescription && (
                      <p className="text-xs text-charcoal-muted italic mt-0.5">
                        Swap proposal: "{offer.offeredItemDescription}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {offer.status === 'pending' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => respondToOffer(offer.id, 'declined')}
                        leftIcon={<X className="w-3.5 h-3.5 text-red-600" />}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="lime"
                        size="sm"
                        onClick={() => respondToOffer(offer.id, 'accepted')}
                        leftIcon={<Check className="w-3.5 h-3.5 text-forest-dark" />}
                      >
                        Accept Offer
                      </Button>
                    </>
                  ) : offer.status === 'accepted' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Accepted (Reserved)
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => completeOfferTransaction(offer.id)}
                      >
                        Mark Completed
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-charcoal-muted bg-ivory-soft px-3 py-1 rounded-full capitalize">
                      {offer.status}
                    </span>
                  )}

                  <Link
                    to="/messages"
                    className="p-2 rounded-xl text-forest hover:bg-ivory-soft border border-ivory-border"
                    title="Open chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Offers */}
      <div className="space-y-4 pt-4 border-t border-ivory-border">
        <h3 className="font-editorial text-lg font-bold text-forest-dark">
          Offers You Sent ({sentOffers.length})
        </h3>

        {sentOffers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-ivory-border text-center text-xs text-charcoal-muted">
            You haven't made any offers yet. Explore the marketplace and make an offer on items you like!
          </div>
        ) : (
          <div className="space-y-3">
            {sentOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-2xl bg-white border border-ivory-border flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={offer.listingImage}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-forest-dark truncate">
                      {offer.listingTitle}
                    </h5>
                    <p className="text-charcoal-muted truncate">
                      Offered: {formatCurrency(offer.offeredPrice || 0)} • Status:{' '}
                      <strong className="capitalize text-forest">{offer.status}</strong>
                    </p>
                  </div>
                </div>

                <Link
                  to="/messages"
                  className="px-3 py-1.5 rounded-xl bg-ivory-soft hover:bg-white text-forest border border-ivory-border font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

