import {
  Listing,
  WantedPost,
  Conversation,
  Message,
  Offer,
  Transaction,
  Review,
  Report,
  UserProfile,
} from '@/types';
import { INITIAL_LISTINGS } from '@/data/initialListings';
import { INITIAL_WANTED_POSTS } from '@/data/initialWantedPosts';
import { INITIAL_USERS, CURRENT_USER_ID } from '@/data/initialUsers';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_OFFERS,
  INITIAL_TRANSACTIONS,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
} from '@/data/initialDemoData';

const KEYS = {
  LISTINGS: 'reuseu_listings_v1',
  WANTED: 'reuseu_wanted_v1',
  FAVORITES: 'reuseu_favorites_v1',
  CONVERSATIONS: 'reuseu_conversations_v1',
  MESSAGES: 'reuseu_messages_v1',
  OFFERS: 'reuseu_offers_v1',
  TRANSACTIONS: 'reuseu_transactions_v1',
  REVIEWS: 'reuseu_reviews_v1',
  REPORTS: 'reuseu_reports_v1',
  USERS: 'reuseu_users_v1',
  CURRENT_USER_ID: 'reuseu_current_user_id_v1',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Listings
  getListings(): Listing[] {
    return getStoredItem<Listing[]>(KEYS.LISTINGS, INITIAL_LISTINGS);
  },
  saveListings(listings: Listing[]): void {
    setStoredItem(KEYS.LISTINGS, listings);
  },
  getListingById(id: string): Listing | undefined {
    return this.getListings().find((l) => l.id === id);
  },

  // Favorites
  getFavorites(): string[] {
    return getStoredItem<string[]>(KEYS.FAVORITES, ['item-1', 'item-3']);
  },
  saveFavorites(favorites: string[]): void {
    setStoredItem(KEYS.FAVORITES, favorites);
  },

  // Wanted Posts
  getWantedPosts(): WantedPost[] {
    return getStoredItem<WantedPost[]>(KEYS.WANTED, INITIAL_WANTED_POSTS);
  },
  saveWantedPosts(posts: WantedPost[]): void {
    setStoredItem(KEYS.WANTED, posts);
  },

  // Conversations & Messages
  getConversations(): Conversation[] {
    return getStoredItem<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },
  saveConversations(conversations: Conversation[]): void {
    setStoredItem(KEYS.CONVERSATIONS, conversations);
  },
  getMessages(): Message[] {
    return getStoredItem<Message[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  },
  saveMessages(messages: Message[]): void {
    setStoredItem(KEYS.MESSAGES, messages);
  },

  // Offers
  getOffers(): Offer[] {
    return getStoredItem<Offer[]>(KEYS.OFFERS, INITIAL_OFFERS);
  },
  saveOffers(offers: Offer[]): void {
    setStoredItem(KEYS.OFFERS, offers);
  },

  // Transactions
  getTransactions(): Transaction[] {
    return getStoredItem<Transaction[]>(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },
  saveTransactions(transactions: Transaction[]): void {
    setStoredItem(KEYS.TRANSACTIONS, transactions);
  },

  // Reviews
  getReviews(): Review[] {
    return getStoredItem<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  saveReviews(reviews: Review[]): void {
    setStoredItem(KEYS.REVIEWS, reviews);
  },

  // Reports
  getReports(): Report[] {
    return getStoredItem<Report[]>(KEYS.REPORTS, INITIAL_REPORTS);
  },
  saveReports(reports: Report[]): void {
    setStoredItem(KEYS.REPORTS, reports);
  },

  // Users
  getUsers(): Record<string, UserProfile> {
    return getStoredItem<Record<string, UserProfile>>(KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users: Record<string, UserProfile>): void {
    setStoredItem(KEYS.USERS, users);
  },
  getCurrentUserId(): string {
    return getStoredItem<string>(KEYS.CURRENT_USER_ID, CURRENT_USER_ID);
  },
  setCurrentUserId(id: string): void {
    setStoredItem(KEYS.CURRENT_USER_ID, id);
  },

  // Reset to initial demo state
  resetToDemo(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
