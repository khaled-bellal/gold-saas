export type Karat = "14K" | "18K" | "22K" | "24K";

export interface GoldPrice {
  karat: Karat;
  pricePerGram: number;
}

export interface Product {
  id: string;
  name: string;
  image?: string;
  weight: number; // in grams
  karat: Karat;
  makingCost: number;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  finalPrice: number;
  discount: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "BINANCE";
  customerName?: string;
  customerPhone?: string;
  timestamp: number;
  staffId: string;
}

export interface StoreConfig {
  ownerEmail: string;
  currency: string;
  prices: Record<Karat, number>;
}