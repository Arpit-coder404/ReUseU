export type ExchangeType = 'sell' | 'donate' | 'lend' | 'swap';

export type ItemCondition = 'like_new' | 'good' | 'fair' | 'refurbished';

export type CategoryId = 
  | 'textbooks' 
  | 'electronics' 
  | 'lab' 
  | 'hostel' 
  | 'fashion' 
  | 'sports' 
  | 'cycles' 
  | 'free';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  badgeCount?: number;
}

export type ListingStatus = 'active' | 'reserved' | 'completed' | 'removed';

export interface CampusLocation {
  id: string;
  name: string;
  zone: string;
  description: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  campus: string;
  dormBlock?: string;
  major?: string;
  year?: string;
  role: 'student' | 'admin';
  isVerified: boolean;
  verifiedLabel: string;
  rating: number;
  reviewCount: number;
  itemsReusedCount: number;
  joinedDate: string;
  bio: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  seller: UserProfile;
  title: string;
  description: string;
  category: CategoryId;
  exchangeType: ExchangeType;
  price: number; // 0 for donate
  originalPrice?: number;
  condition: ItemCondition;
  pickupLocation: string; // CampusLocation id or name
  status: ListingStatus;
  images: string[];
  tags: string[];
  swapPreference?: string;
  lendDurationDays?: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  favoritesCount: number;
  isFeatured?: boolean;
}

export interface WantedPost {
  id: string;
  userId: string;
  user: UserProfile;
  title: string;
  description: string;
  category: CategoryId;
  minBudget?: number;
  maxBudget?: number;
  preferredCondition: ItemCondition | 'any';
  status: 'open' | 'fulfilled';
  urgency: 'high' | 'normal';
  createdAt: string;
  responsesCount: number;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing?: Listing;
  buyerId: string;
  sellerId: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
  isOfferMessage?: boolean;
}

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  offerType: ExchangeType;
  offeredPrice?: number;
  offeredItemDescription?: string;
  message?: string;
  status: OfferStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  category: CategoryId;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  exchangeType: ExchangeType;
  pickupLocation: string;
  status: 'pending_pickup' | 'completed' | 'cancelled';
  completedAt: string;
  reviewedByBuyer?: boolean;
  reviewedBySeller?: boolean;
}

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ImpactMetrics {
  totalItemsReused: number;
  estimatedStudentSavings: number;
  itemsDonated: number;
  completedSwaps: number;
  wasteAvoidedKg: number;
  co2SavedKg: number;
}
