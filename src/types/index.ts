// Product related types
export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stockCount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount?: number;
  variations?: ProductVariation[];
}

// Cart related types
export interface CartItem extends Product {
  quantity: number;
  originalPrice?: number; // Original price when item is made free
  freeQuantity?: number;  // Number of items that are free
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// API related types
export interface InventoryUpdatePayload {
  products: Array<{
    id: string;
    quantity: number;
    name?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
  }>;
  orderId: string;
  timestamp: string;
  isFreeOrder?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Order history related types
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'completed' | 'canceled' | 'processing';
}

// Log related types
export interface LogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  userId?: string;
}
