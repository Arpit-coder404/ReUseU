import { create } from 'zustand';
import {
  Listing,
  WantedPost,
  Conversation,
  Message,
  Offer,
  Transaction,
  Review,
  Report,
  ListingStatus,
} from '@/types';
import { StorageService } from '@/services/storageService';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppStoreState {
  listings: Listing[];
  favorites: string[];
  wantedPosts: WantedPost[];
  conversations: Conversation[];
  messages: Message[];
  offers: Offer[];
  transactions: Transaction[];
  reviews: Review[];
  reports: Report[];
  toasts: ToastItem[];

  // Actions
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Listings
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;

  // Favorites
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;

  // Wanted Posts
  addWantedPost: (post: WantedPost) => void;
  fulfillWantedPost: (id: string) => void;

  // Offers
  createOffer: (offer: Offer) => void;
  respondToOffer: (offerId: string, status: 'accepted' | 'declined') => void;
  completeOfferTransaction: (offerId: string) => void;

  // Messages & Conversations
  getOrCreateConversation: (listingId: string, buyerId: string, sellerId: string) => string;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;

  // Reports
  createReport: (report: Report) => void;
  updateReportStatus: (id: string, status: 'resolved' | 'dismissed') => void;

  // Reviews
  addReview: (review: Review) => void;

  // Reset
  resetDemoData: () => void;
}

export const useStore = create<AppStoreState>((set, get) => {
  const listings = StorageService.getListings();
  const favorites = StorageService.getFavorites();
  const wantedPosts = StorageService.getWantedPosts();
  const conversations = StorageService.getConversations();
  const messages = StorageService.getMessages();
  const offers = StorageService.getOffers();
  const transactions = StorageService.getTransactions();
  const reviews = StorageService.getReviews();
  const reports = StorageService.getReports();

  return {
    listings,
    favorites,
    wantedPosts,
    conversations,
    messages,
    offers,
    transactions,
    reviews,
    reports,
    toasts: [],

    addToast: (toast) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      set((state) => ({ toasts: [...state.toasts, newToast] }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },

    removeToast: (id: string) => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    // Listings
    addListing: (listing: Listing) => {
      const updated = [listing, ...get().listings];
      StorageService.saveListings(updated);
      set({ listings: updated });
      get().addToast({
        type: 'success',
        title: 'Listing Published!',
        message: `"${listing.title}" is now visible to campus students.`,
      });
    },

    updateListing: (id: string, updates: Partial<Listing>) => {
      const updated = get().listings.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      );
      StorageService.saveListings(updated);
      set({ listings: updated });
      get().addToast({
        type: 'success',
        title: 'Listing Updated',
        message: 'Your changes have been saved.',
      });
    },

    updateListingStatus: (id: string, status: ListingStatus) => {
      const updated = get().listings.map((l) => (l.id === id ? { ...l, status } : l));
      StorageService.saveListings(updated);
      set({ listings: updated });
    },

    deleteListing: (id: string) => {
      const updated = get().listings.filter((l) => l.id !== id);
      StorageService.saveListings(updated);
      set({ listings: updated });
      get().addToast({
        type: 'info',
        title: 'Listing Removed',
        message: 'The item has been deleted from the marketplace.',
      });
    },

    // Favorites
    toggleFavorite: (listingId: string) => {
      const { favorites, listings } = get();
      const exists = favorites.includes(listingId);
      const newFavorites = exists
        ? favorites.filter((id) => id !== listingId)
        : [...favorites, listingId];

      // Update favorites count on listing
      const updatedListings = listings.map((l) => {
        if (l.id === listingId) {
          const delta = exists ? -1 : 1;
          return { ...l, favoritesCount: Math.max(0, (l.favoritesCount || 0) + delta) };
        }
        return l;
      });

      StorageService.saveFavorites(newFavorites);
      StorageService.saveListings(updatedListings);
      set({ favorites: newFavorites, listings: updatedListings });

      get().addToast({
        type: exists ? 'info' : 'success',
        title: exists ? 'Removed from Saved' : 'Saved to Favorites',
        message: exists ? 'Item removed from your saved list.' : 'You can find it anytime in your Saved items.',
      });
    },

    isFavorite: (listingId: string) => {
      return get().favorites.includes(listingId);
    },

    // Wanted Posts
    addWantedPost: (post: WantedPost) => {
      const updated = [post, ...get().wantedPosts];
      StorageService.saveWantedPosts(updated);
      set({ wantedPosts: updated });
      get().addToast({
        type: 'success',
        title: 'Wanted Request Posted!',
        message: 'Students across campus will see your request.',
      });
    },

    fulfillWantedPost: (id: string) => {
      const updated = get().wantedPosts.map((p) =>
        p.id === id ? { ...p, status: 'fulfilled' as const } : p
      );
      StorageService.saveWantedPosts(updated);
      set({ wantedPosts: updated });
      get().addToast({
        type: 'success',
        title: 'Request Marked Fulfilled',
        message: 'Thank you for keeping the campus board updated!',
      });
    },

    // Offers
    createOffer: (offer: Offer) => {
      const updated = [offer, ...get().offers];
      StorageService.saveOffers(updated);
      set({ offers: updated });

      // Automatically open or attach to a conversation
      const convId = get().getOrCreateConversation(
        offer.listingId,
        offer.senderId,
        offer.receiverId
      );

      const offerMsg =
        offer.offerType === 'sell'
          ? `Made an offer of $${offer.offeredPrice}. ${offer.message || ''}`
          : offer.offerType === 'swap'
          ? `Proposed a swap: ${offer.offeredItemDescription}. ${offer.message || ''}`
          : offer.offerType === 'lend'
          ? `Requested to borrow this item. ${offer.message || ''}`
          : `Requested donation: ${offer.message || ''}`;

      get().sendMessage(convId, offer.senderId, `[OFFER SUBMITTED] ${offerMsg}`);

      get().addToast({
        type: 'success',
        title: 'Offer Sent to Seller',
        message: 'The seller has received your request and chat has opened.',
      });
    },

    respondToOffer: (offerId: string, status: 'accepted' | 'declined') => {
      const { offers, listings } = get();
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return;

      const updatedOffers = offers.map((o) => (o.id === offerId ? { ...o, status } : o));
      StorageService.saveOffers(updatedOffers);

      // If accepted, mark listing as reserved and create a pending transaction
      if (status === 'accepted') {
        const listing = listings.find((l) => l.id === offer.listingId);
        if (listing) {
          const updatedListings = listings.map((l) =>
            l.id === listing.id ? { ...l, status: 'reserved' as const } : l
          );
          StorageService.saveListings(updatedListings);
          set({ listings: updatedListings });

          // Record new transaction
          const newTx: Transaction = {
            id: 'tx-' + Math.random().toString(36).substring(2, 9),
            listingId: listing.id,
            listingTitle: listing.title,
            listingImage: listing.images[0] || '',
            category: listing.category,
            buyerId: offer.senderId,
            sellerId: offer.receiverId,
            buyerName: offer.senderName,
            sellerName: listing.seller.name,
            amount: offer.offeredPrice || listing.price || 0,
            exchangeType: offer.offerType,
            pickupLocation: listing.pickupLocation,
            status: 'pending_pickup',
            completedAt: new Date().toISOString(),
          };

          const updatedTx = [newTx, ...get().transactions];
          StorageService.saveTransactions(updatedTx);
          set({ transactions: updatedTx });
        }
      }

      set({ offers: updatedOffers });
      get().addToast({
        type: status === 'accepted' ? 'success' : 'info',
        title: status === 'accepted' ? 'Offer Accepted!' : 'Offer Declined',
        message:
          status === 'accepted'
            ? 'Item marked as reserved. Arrange safe pickup in chat!'
            : 'You have declined this offer.',
      });
    },

    completeOfferTransaction: (offerId: string) => {
      const { offers, listings, transactions } = get();
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return;

      const updatedOffers = offers.map((o) =>
        o.id === offerId ? { ...o, status: 'completed' as const } : o
      );
      const updatedListings = listings.map((l) =>
        l.id === offer.listingId ? { ...l, status: 'completed' as const } : l
      );

      const updatedTx = transactions.map((t) =>
        t.listingId === offer.listingId ? { ...t, status: 'completed' as const } : t
      );

      StorageService.saveOffers(updatedOffers);
      StorageService.saveListings(updatedListings);
      StorageService.saveTransactions(updatedTx);

      set({
        offers: updatedOffers,
        listings: updatedListings,
        transactions: updatedTx,
      });

      get().addToast({
        type: 'success',
        title: 'Exchange Completed!',
        message: 'Thank you for giving this item a second life on campus!',
      });
    },

    // Conversations & Messages
    getOrCreateConversation: (listingId: string, buyerId: string, sellerId: string) => {
      const { conversations, listings } = get();
      const existing = conversations.find(
        (c) =>
          c.listingId === listingId &&
          c.participantIds.includes(buyerId) &&
          c.participantIds.includes(sellerId)
      );

      if (existing) return existing.id;

      const listing = listings.find((l) => l.id === listingId);
      const newConvId = 'conv-' + Math.random().toString(36).substring(2, 9);
      const newConv: Conversation = {
        id: newConvId,
        listingId,
        listing,
        buyerId,
        sellerId,
        participantIds: [buyerId, sellerId],
        lastMessage: 'Conversation started',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      };

      const updated = [newConv, ...conversations];
      StorageService.saveConversations(updated);
      set({ conversations: updated });
      return newConvId;
    },

    sendMessage: (conversationId: string, senderId: string, content: string) => {
      const { messages, conversations } = get();
      const newMsg: Message = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        conversationId,
        senderId,
        content,
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...messages, newMsg];
      const updatedConvs = conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: content,
              lastMessageAt: new Date().toISOString(),
            }
          : c
      );

      StorageService.saveMessages(updatedMessages);
      StorageService.saveConversations(updatedConvs);
      set({ messages: updatedMessages, conversations: updatedConvs });
    },

    // Reports
    createReport: (report: Report) => {
      const updated = [report, ...get().reports];
      StorageService.saveReports(updated);
      set({ reports: updated });
      get().addToast({
        type: 'info',
        title: 'Report Submitted',
        message: 'Campus moderators have been notified to review this content.',
      });
    },

    updateReportStatus: (id: string, status: 'resolved' | 'dismissed') => {
      const updated = get().reports.map((r) => (r.id === id ? { ...r, status } : r));
      StorageService.saveReports(updated);
      set({ reports: updated });
      get().addToast({
        type: 'success',
        title: `Report ${status === 'resolved' ? 'Resolved' : 'Dismissed'}`,
        message: 'Moderation queue updated.',
      });
    },

    // Reviews
    addReview: (review: Review) => {
      const updated = [review, ...get().reviews];
      const updatedTx = get().transactions.map((t) =>
        t.id === review.transactionId ? { ...t, reviewedByBuyer: true } : t
      );
      StorageService.saveReviews(updated);
      StorageService.saveTransactions(updatedTx);
      set({ reviews: updated, transactions: updatedTx });
      get().addToast({
        type: 'success',
        title: 'Review Posted',
        message: 'Thank you for strengthening campus trust!',
      });
    },

    resetDemoData: () => {
      StorageService.resetToDemo();
      set({
        listings: StorageService.getListings(),
        favorites: StorageService.getFavorites(),
        wantedPosts: StorageService.getWantedPosts(),
        conversations: StorageService.getConversations(),
        messages: StorageService.getMessages(),
        offers: StorageService.getOffers(),
        transactions: StorageService.getTransactions(),
        reviews: StorageService.getReviews(),
        reports: StorageService.getReports(),
      });
      get().addToast({
        type: 'info',
        title: 'Reset to Demo Seed Data',
        message: 'Marketplace listings, orders and chats restored.',
      });
    },
  };
});

