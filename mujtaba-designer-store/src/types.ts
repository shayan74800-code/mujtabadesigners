export interface User {
  id: string;
  gmail: string;
  firstName: string;
  lastName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  collection?: string;
  images: string[];
  sizes: string[];
  inStock: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'card';
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  confirmedAt?: string;
  emailSent?: boolean;
}

export interface AdminUser {
  email: string;
  role: 'admin';
}

export interface VideoSettings {
  heroVideoUrl: string;
  heroPosterUrl: string;
  showcaseVideoUrl: string;
  showcasePosterUrl: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  updatedAt?: string;
}

export interface AppState {
  user: User | null;
  admin: AdminUser | null;
  token: string | null;
}
