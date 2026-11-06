import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, Offer } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';
import { Tag, RefreshCw, Clock, Gift, ShieldAlert, Send } from 'lucide-react';

interface ExchangeActionModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export const ExchangeActionModal: React.FC<ExchangeActionModalProps> = ({
  listing,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuthStore();
  const { createOffer } = useStore();
  const navigate = useNavigate();

  const [offeredPrice, setOfferedPrice] = useState<number>(listing.price);
  const [offeredDescription, setOfferedDescription] = useState('');
  const [message, setMessage] = useState('');
  const [borrowDuration, setBorrowDuration] = useState(listing.lendDurationDays || 7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const offer: Offer = {
      id: 'offer-' + Math.random().toString(36).substring(2, 9),
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || '',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      receiverId: listing.sellerId,
      offerType: listing.exchangeType,
      offeredPrice: listing.exchangeType === 'sell' ? Number(offeredPrice) : 0,
      offeredItemDescription:
        listing.exchangeType === 'swap'
          ? offeredDescription
          : listing.exchangeType === 'lend'
          ? `Borrow request for ${borrowDuration} days`
          : undefined,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      createOffer(offer);
      setIsSubmitting(false);
      onClose();
      navigate('/messages');
    }, 400);
  };

  const getModalTitle = () => {
    switch (listing.exchangeType) {
      case 'sell':
        return 'Make an Offer';
      case 'swap':
        return 'Propose a Campus Swap';
      case 'lend':
        return 'Request to Borrow';
      case 'donate':
        return 'Request Donation';
    }
  };

  const getModalDescription = () => {
    switch (listing.exchangeType) {
      case 'sell':
        return `Listing asking price: ${formatCurrency(listing.price)}. Propose your student-friendly price.`;
      case 'swap':
        return `Owner is seeking: "${listing.swapPreference || 'Open to interesting campus items'}".`;
      case 'lend':
        return `Borrow for your semester project or exam period without purchasing new.`;
      case 'donate':
        return `Free donation by ${listing.seller.name}. Send a friendly note to arrange pickup.`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      description={getModalDescription()}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Summary Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-ivory-soft border border-ivory-border">
          <img
            src={listing.images[0]}
            alt=""
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-forest-dark truncate">{listing.title}</h4>
            <p className="text-[11px] text-charcoal-muted truncate">
              Seller: {listing.seller.name} • Location: {listing.pickupLocation}
            </p>
          </div>
        </div>

        {/* Sell Mode: Price Input */}
        {listing.exchangeType === 'sell' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Your Offered Price ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-bold text-forest">$</span>
              <input
                type="number"
                min="1"
                max="5000"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-ivory-border bg-white text-forest-dark font-bold text-base focus:border-forest outline-none"
              />
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Asking price: {formatCurrency(listing.price)}. You can offer asking or negotiate reasonably.
            </p>
          </div>
        )}

        {/* Swap Mode: Item Offered */}
        {listing.exchangeType === 'swap' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              What item are you offering to swap?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Patagonia campus backpack, or Logitech wireless mouse"
              value={offeredDescription}
              onChange={(e) => setOfferedDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none"
            />
          </div>
        )}

        {/* Lend Mode: Duration */}
        {listing.exchangeType === 'lend' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
              Borrow Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              required
              value={borrowDuration}
              onChange={(e) => setBorrowDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-sm font-semibold text-charcoal focus:border-forest outline-none"
            />
          </div>
        )}

        {/* Note / Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            Message to {listing.seller.name}
          </label>
          <textarea
            rows={3}
            required
            placeholder="Introduce yourself and suggest a convenient time/pickup spot (e.g. Main Library foyer today around 4pm)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-white text-xs text-charcoal focus:border-forest outline-none resize-none"
          />
        </div>

        {/* Campus Trust Note */}
        <div className="p-3 rounded-xl bg-forest/5 border border-forest/15 text-[11px] text-charcoal-muted flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <span>
            Campus Handover: Always meet during daylight hours at designated campus pickup spots like
            the Library, SAC, or Student Canteen.
          </span>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4 text-lime" />}
          >
            Submit & Open Chat
          </Button>
        </div>
      </form>
    </Modal>
  );
};

