export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  duration: string;
  rating: number;
  description: string;
  suitableFor: string;
  benefits: string[];
  productsUsed: string[];
  beforeAfterGallery: string[];
  reviews: { author: string; text: string; rating: number; date: string }[];
  addOns: { name: string; price: number }[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience: string;
  specialization: string;
  bio: string;
  image: string;
  instagram: string;
  awards: string[];
  availability: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
  reviewsCount: number;
  inStock: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "confirmed" | "rescheduled" | "cancelled";
  addOns: { name: string; price: number }[];
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  membership: string;
  rewardPoints: number;
  balance: number;
  favoriteStaffId: string;
  favoriteStaffName: string;
  savedServices: string[];
  achievements: { id: string; name: string; desc: string; unlocked: boolean; date?: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  snippet: string;
  author: string;
  date: string;
  content: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: "percent" | "fixed";
  desc: string;
}
