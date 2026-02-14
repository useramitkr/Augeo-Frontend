export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'client' | 'client_staff' | 'client_editor' | 'client_manager' | 'admin' | 'superadmin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  addresses: Address[];
  savedPaymentMethods: PaymentMethod[];
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string;
  clientApproved?: boolean;
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  _id?: string;
  stripePaymentMethodId: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: string;
  isActive: boolean;
  displayOrder: number;
  subcategories?: Category[];
}

export interface Auction {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  client: User | string;
  category?: Category | string;
  tags: string[];
  coverImage?: string;
  bannerImage?: string;
  images: string[];
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled' | 'paused' | 'suspended';
  isPublished: boolean;
  isFeatured: boolean;
  auctionType: 'timed' | 'live';
  buyersPremium: number;
  currency: string;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  totalLots: number;
  totalBids: number;
  totalRevenue: number;
  viewCount: number;
  watchCount: number;
  lots?: Lot[];
  createdAt: string;
  updatedAt: string;
}

export interface LotImage {
  url: string;
  caption?: string;
  order: number;
}

export interface ShippingOption {
  method: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

export interface LotQuestion {
  _id: string;
  user: User | string;
  question: string;
  answer?: string;
  askedAt: string;
  answeredAt?: string;
  isPublic: boolean;
}

export interface Lot {
  _id: string;
  auction: Auction | string;
  client: User | string;
  lotNumber: number;
  title: string;
  description: string;
  images: LotImage[];
  videos: { url: string; caption?: string }[];
  conditionReport?: string;
  conditionRating?: string;
  provenance?: string;
  authenticity?: string;
  startingBid: number;
  reservePrice: number;
  estimateLow?: number;
  estimateHigh?: number;
  bidIncrement: number;
  currentBid: number;
  currentBidder?: User | string;
  totalBids: number;
  status: 'pending' | 'active' | 'sold' | 'unsold' | 'withdrawn' | 'passed';
  isReserveMet: boolean;
  autoBidEnabled: boolean;
  category?: Category | string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  yearCreated?: string;
  artist?: string;
  origin?: string;
  shippingOptions: ShippingOption[];
  isShippingAvailable: boolean;
  winner?: User | string;
  winningBid?: number;
  hammerPrice?: number;
  questions: LotQuestion[];
  viewCount: number;
  watchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  lot: Lot | string;
  auction: Auction | string;
  bidder: User | string;
  amount: number;
  maxAutoBid?: number;
  bidType: 'manual' | 'auto' | 'proxy';
  status: 'active' | 'outbid' | 'winning' | 'won' | 'lost' | 'cancelled' | 'rejected';
  isWinning: boolean;
  timestamp: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: User | string;
  client: User | string;
  auction: Auction | string;
  lot: Lot | string;
  bid: Bid | string;
  hammerPrice: number;
  buyersPremium: number;
  buyersPremiumRate: number;
  tax: number;
  taxRate: number;
  shippingCost: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paidAt?: string;
  shippingMethod?: string;
  shippingAddress?: Address;
  shippingStatus: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed' | 'refunded';
  invoiceNumber?: string;
  invoiceUrl?: string;
  commissionRate?: number;
  commissionAmount?: number;
  clientPayoutAmount?: number;
  payoutStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  auction?: string;
  lot?: string;
  order?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: string;
  isPublished: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
