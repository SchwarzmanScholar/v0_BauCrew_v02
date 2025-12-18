export interface ServiceListing {
  id: string
  providerId: string
  providerName: string
  providerAvatar: string
  title: string
  description: string
  category: string
  priceFrom: number
  priceUnit: string
  rating: number
  reviewCount: number
  verified: boolean
  responseTime: string
  completedJobs: number
  imageUrl: string
}

export interface JobRequest {
  id: string
  customerId: string
  customerName: string
  title: string
  description: string
  category: string
  budget: number
  location: string
  plz?: string
  urgency: "urgent" | "normal" | "flexible"
  createdAt: Date
  offerCount: number
  status: "open" | "in_discussion" | "filled" | "closed" | "in_progress" | "completed" | "cancelled"
}

export interface JobRequestDetail extends JobRequest {
  photos: string[]
  timeframe: string
  accessNotes?: string
}

export interface Booking {
  id: string
  jobTitle: string
  providerId: string
  providerName: string
  customerId: string
  customerName: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed"
  scheduledDate: Date
  totalAmount: number
  category: string
}

export type BookingDetailStatus = "requested" | "accepted" | "needs_payment" | "scheduled" | "in_progress" | "completed"

export interface BookingDetail {
  id: string
  jobTitle: string
  description: string
  providerId: string
  providerName: string
  providerAvatar: string
  providerRating: number
  providerReviewCount: number
  verified: boolean
  customerId: string
  customerName: string
  status: BookingDetailStatus
  scheduledDate: Date
  scheduledTime: string
  totalAmount: number
  serviceFee: number
  category: string
  address: {
    street: string
    houseNumber: string
    plz: string
    city: string
  }
  accessNotes?: string
  photos: string[]
  hasReview: boolean
}

export interface Order {
  id: string
  jobTitle: string
  providerId: string
  providerName: string
  providerAvatar: string
  customerId: string
  status: "requested" | "payment_pending" | "scheduled" | "in_progress" | "completed"
  scheduledDate: Date
  scheduledTime: string
  totalAmount: number
  category: string
}

export type OrderStatus = Order["status"]

export interface ProviderBookingRequest {
  id: string
  jobTitle: string
  customerId: string
  customerName: string
  customerAvatar: string
  category: string
  scheduledDate: Date
  scheduledTime: string
  address: string
  amount: number
  createdAt: Date
}

export interface JobBoardListing {
  id: string
  title: string
  category: string
  location: string
  plz: string
  budget: number | null
  urgency: "urgent" | "normal" | "flexible"
  createdAt: Date
  offerCount: number
}

export interface JobBoardItem {
  id: string
  title: string
  category: string
  description: string
  location: string
  plz: string
  budget: number | null
  budgetMax?: number | null
  urgency: "urgent" | "normal" | "flexible"
  timeframe: "asap" | "7_days" | "custom"
  createdAt: Date
  offerCount: number
  status: "open" | "in_discussion" | "filled" | "closed"
  customerName: string
}

export interface ProviderStats {
  newRequests: number
  jobsThisWeek: number
  revenue30Days: number
  rating: number
  reviewCount: number
  newJobBoardListings: number
}

export interface OnboardingTask {
  id: string
  label: string
  completed: boolean
  href: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
}

export interface Offer {
  id: string
  jobRequestId: string
  providerId: string
  providerName: string
  providerAvatar: string
  providerRating: number
  providerReviewCount: number
  verified: boolean
  price: number
  estimatedDuration: string
  message: string
  createdAt: Date
}

export interface Review {
  id: string
  customerId: string
  customerName: string
  customerAvatar: string
  rating: number
  comment: string
  createdAt: Date
  jobCategory: string
}

export interface ListingDetail extends ServiceListing {
  photos: string[]
  fullDescription: string
  services: string[]
  serviceArea: {
    city: string
    radius: number
  }
  reviews: Review[]
}

export interface ActivityEvent {
  id: string
  type: "published" | "offer_received" | "message" | "accepted" | "closed"
  title: string
  description?: string
  timestamp: Date
}

export type UserRole = "customer" | "provider" | "admin"

export interface ProviderListing {
  id: string
  title: string
  description: string
  category: string
  price: number
  priceUnit: string
  imageUrl: string
  isActive: boolean
  bookingsCount: number
  createdAt: Date
}

export interface ProviderListingDetail extends ProviderListing {
  priceType: "fixed" | "hourly" | "quote"
  city: string
  plz: string
  radius: number
  photos: string[]
}

export type ProviderJobStatus = "requested" | "payment_pending" | "scheduled" | "in_progress" | "completed"

export interface ProviderJob {
  id: string
  jobTitle: string
  customerId: string
  customerName: string
  customerAvatar: string
  category: string
  status: ProviderJobStatus
  requestedDate: Date
  requestedTime: string
  amount: number
  city: string
  createdAt: Date
}

export interface ProviderJobDetail extends ProviderJob {
  description: string
  photos: string[]
  accessNotes?: string
  address: {
    street: string
    houseNumber: string
    plz: string
    city: string
  }
  customerRating?: number
  customerJobsCompleted?: number
  suggestedDate?: Date
  suggestedTime?: string
}

export interface ProviderWorkRequestDetail {
  id: string
  title: string
  category: string
  description: string
  location: string
  plz: string
  budget: number | null
  budgetMax?: number | null
  urgency: "urgent" | "normal" | "flexible"
  timeframe: string
  createdAt: Date
  offerCount: number
  status: "open" | "in_discussion" | "closed"
  photos: string[]
  accessNotes?: string
  customer: {
    id: string
    firstName: string
    area: string
    memberSince: Date
  }
  myOffer?: {
    id: string
    amount: number
    message: string
    availableDate?: Date
    sentAt: Date
    status: "pending" | "accepted" | "declined"
  }
}

export type VerificationStatus = "not_submitted" | "pending" | "approved" | "rejected"

export interface VerificationDocument {
  id: string
  type: "id" | "trade_license" | "insurance"
  fileName: string
  uploadedAt: Date
  status: VerificationStatus
}

export interface ProviderProfile {
  id: string
  avatar: string
  displayName: string
  headline: string
  bio: string
  website: string
  // Service area
  city: string
  plz: string
  radius: number
  // Business info
  companyName: string
  vatId: string
  // Verification
  verificationStatus: VerificationStatus
  verificationDocuments: VerificationDocument[]
  verificationNotes?: string
  verificationSubmittedAt?: Date
}

export type PayoutStatus = "pending" | "processing" | "paid" | "failed"

export interface EarningsSummary {
  grossRevenue30Days: number
  totalFees30Days: number
  netRevenue30Days: number
  pendingPayout: number
  lastPayoutDate?: Date
  lastPayoutAmount?: number
}

export interface Transaction {
  id: string
  bookingId: string
  jobTitle: string
  customerName: string
  date: Date
  grossAmount: number
  fee: number
  netAmount: number
  payoutStatus: PayoutStatus
  payoutDate?: Date
}

// Admin dashboard types
export interface AdminStats {
  totalUsers: number
  totalProviders: number
  totalListings: number
  totalJobRequests: number
  totalBookings: number
  paidGmv: number
  platformRevenue: number
}

export interface AdminBooking {
  id: string
  jobTitle: string
  customerName: string
  providerName: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed"
  amount: number
  createdAt: Date
}

export interface AdminVerification {
  id: string
  providerName: string
  providerAvatar: string
  companyName: string
  submittedAt: Date
  documentCount: number
  status: VerificationStatus
}

export interface AdminVerificationDetail {
  id: string
  providerName: string
  providerAvatar: string
  providerEmail: string
  companyName: string
  vatId?: string
  city: string
  submittedAt: Date
  status: VerificationStatus
  documents: {
    id: string
    type: "id" | "trade_license" | "insurance"
    fileName: string
    fileUrl: string
    uploadedAt: Date
  }[]
  adminNotes?: string
  reviewedAt?: Date
  reviewedBy?: string
}

export interface AdminJobRequest {
  id: string
  title: string
  customerName: string
  category: string
  status: "open" | "in_discussion" | "filled" | "closed"
  offerCount: number
  createdAt: Date
}

export type AdminJobRequestStatus = "open" | "in_discussion" | "filled" | "closed" | "flagged"
export type FlagReason = "spam" | "illegal" | "personal_data" | "other"

export interface AdminJobRequestDetail {
  id: string
  title: string
  description: string
  category: string
  location: string
  plz: string
  timeframe: string
  budget: number | null
  budgetMax?: number | null
  photos: string[]
  status: AdminJobRequestStatus
  offerCount: number
  createdAt: Date
  customer: {
    id: string
    name: string
    email: string
    avatar: string
  }
  // Flagging info
  isFlagged: boolean
  flagReason?: FlagReason
  flagNotes?: string
  flaggedAt?: Date
  flaggedBy?: string
}

export type DisputeStatus = "open" | "under_review" | "resolved" | "escalated"
export type DisputeReason = "quality" | "no_show" | "payment" | "damage" | "communication" | "other"
export type DisputeResolution = "refund_full" | "refund_partial" | "no_refund" | "cancelled"

export interface AdminDispute {
  id: string
  bookingId: string
  bookingTitle: string
  openedBy: "customer" | "provider"
  openerName: string
  reason: DisputeReason
  reasonDetails: string
  status: DisputeStatus
  createdAt: Date
  customerName: string
  providerName: string
  bookingAmount: number
}

export interface AdminDisputeDetail extends AdminDispute {
  booking: {
    id: string
    jobTitle: string
    category: string
    scheduledDate: Date
    completedDate?: Date
    amount: number
    customerName: string
    customerAvatar: string
    providerName: string
    providerAvatar: string
  }
  messages: {
    id: string
    senderName: string
    senderRole: "customer" | "provider" | "admin"
    content: string
    timestamp: Date
  }[]
  resolution?: {
    type: DisputeResolution
    notes: string
    resolvedAt: Date
    resolvedBy: string
    refundAmount?: number
  }
}

export type AdminBookingStatus =
  | "requested"
  | "needs_payment"
  | "paid"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed"

export interface AdminBookingDetail {
  id: string
  jobTitle: string
  description: string
  category: string
  status: AdminBookingStatus
  createdAt: Date
  scheduledDate?: Date
  scheduledTime?: string
  completedDate?: Date
  // Pricing
  subtotal: number
  platformFee: number
  total: number
  providerPayout: number
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  // Location
  address: {
    street: string
    houseNumber: string
    plz: string
    city: string
  }
  // Participants
  customer: {
    id: string
    name: string
    email: string
    avatar: string
    phone?: string
  }
  provider: {
    id: string
    name: string
    email: string
    avatar: string
    companyName: string
    verified: boolean
    phone?: string
  }
  // Messages preview
  recentMessages: {
    id: string
    senderName: string
    senderRole: "customer" | "provider"
    content: string
    timestamp: Date
  }[]
  // Notes
  accessNotes?: string
  adminNotes?: string
}

export type ConversationContext = "booking" | "request"

export interface Conversation {
  id: string
  counterpartyId: string
  counterpartyName: string
  counterpartyAvatar: string
  counterpartyVerified: boolean
  context: ConversationContext
  contextId: string
  contextTitle: string
  lastMessage: string
  lastMessageAt: Date
  unreadCount: number
  messages: Message[]
  link?: string // Optional navigation link (added dynamically in some views)
}
