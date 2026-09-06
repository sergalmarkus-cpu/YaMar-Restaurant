import type { Table } from './table';

// Language types
export type Language = "es" | "en" | "de" | "fr" | "it" | "pt";

export interface TranslatedText {
  es: string;
  en?: string;
  de?: string;
  fr?: string;
  it?: string;
  pt?: string;
}

// Menu and Product types
export interface Menu {
  id: number;
  name: TranslatedText;
  description?: TranslatedText;
  type: string;
  icon?: string;
  schedules: MenuSchedule[];
  categories: Category[];
  isOpen?: boolean;
  nextOpeningTime?: Date;
}

export interface MenuSchedule {
  id: number;
  menuId: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  active: boolean;
}

export interface Category {
  id: number;
  menuId: number;
  name: TranslatedText;
  description?: TranslatedText;
  displayOrder: number;
  products: Product[];
}

export interface Product {
  id: number;
  categoryId: number;
  name: TranslatedText;
  description?: TranslatedText;
  price: string;
  image?: string;
  allergens: string[];
  dietary: string[];
  available: boolean;
  stock?: number;
  preparationTime: number;
  featured: boolean;
  dailySpecial: boolean;
  modifiers?: Modifier[];
}

export interface Modifier {
  id: number;
  productId: number;
  name: TranslatedText;
  type: "add" | "remove" | "replace";
  price: string;
  active: boolean;
}

// Cart and Order types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedModifiers: Modifier[];
  notes?: string;
  subtotal: number;
}

export interface Order {
  id: number;
  sessionId: string;
  tableId: number;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  tip: string;
  total: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  estimatedTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  product: Product;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  modifiers: Modifier[];
  notes?: string;
  status: OrderStatus;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

// Session types
export interface Session {
  id: string;
  tableId: number;
  table?: Table;
  establishmentId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  roomNumber?: string;
  latitude?: string;
  longitude?: string;
  deviceId?: string;
  language: Language;
  active: boolean;
  orders?: Order[];
  totalSpent?: string;
  createdAt: Date;
}

// Payment types
export interface BillSplit {
  id?: number;
  sessionId: string;
  splitType: "equal" | "items" | "percentage" | "custom";
  splits: SplitDetail[];
}

export interface SplitDetail {
  name?: string;
  email?: string;
  amount: number;
  items?: number[]; // order item IDs
  percentage?: number;
  paid: boolean;
  paymentId?: number;
}

export interface Payment {
  id: number;
  sessionId: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export type PaymentMethod =
  | "card"
  | "cash"
  | "transfer"
  | "paypal"
  | "apple_pay"
  | "google_pay";

export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";

// Rating types
export interface Rating {
  id?: number;
  sessionId: string;
  establishmentId: number;
  foodRating: number;
  serviceRating: number;
  attentionRating: number;
  comment?: string;
  photos?: string[];
  approved: boolean;
  response?: string;
  createdAt?: Date;
}

// Waiter Call types
export interface WaiterCall {
  id?: number;
  sessionId: string;
  tableId: number;
  type: "waiter" | "water" | "cutlery" | "napkins" | "ice" | "help" | "bill";
  message?: string;
  latitude?: string;
  longitude?: string;
  status: "pending" | "acknowledged" | "resolved";
  createdAt?: Date;
}

// Establishment types
export interface Establishment {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  maxDeliveryDistance: number;
  geoFenceEnabled: boolean;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  timezone: string;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  features: EstablishmentFeatures;
  active: boolean;
}

export interface EstablishmentFeatures {
  geolocation: boolean;
  onlinePayment: boolean;
  splitBill: boolean;
  ratings: boolean;
  loyalty: boolean;
  reservations: boolean;
  callWaiter: boolean;
}

// Point of Sale types
export interface PointOfSale {
  id: number;
  establishmentId: number;
  name: TranslatedText;
  description?: TranslatedText;
  latitude: string;
  longitude: string;
  radius: number;
  menus: number[];
  distance?: number;
  active: boolean;
}

// Voucher types
export interface MealVoucher {
  id: number;
  establishmentId: number;
  name: TranslatedText;
  type: "full_board" | "half_board" | "all_inclusive" | "custom";
  creditsPerDay: string;
  validMenus: number[];
  validFrom: Date;
  validUntil: Date;
  active: boolean;
}

export interface CustomerVoucher {
  id: number;
  voucherId: number;
  voucher?: MealVoucher;
  customerEmail?: string;
  roomNumber?: string;
  creditsUsed: string;
  creditsRemaining: string;
  active: boolean;
}

// Notification types
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// Analytics types
export interface AnalyticsEvent {
  eventType: string;
  eventData?: any;
  sessionId?: string;
  userId?: number;
}
