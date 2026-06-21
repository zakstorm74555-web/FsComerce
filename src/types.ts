/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sku?: string;
  stock?: number;
  variants?: Array<{ name: string; options: string[] }>;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface StoreOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Sourced' | 'Shipped' | 'Cancelled';
  timestamp: string;
}

export interface ThemeConfig {
  typography: 'inter' | 'space-grotesk' | 'orbitron' | 'fira-code' | 'playfair';
  primaryColor: string; // Hex or tailwind colors
  secondaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  bannerImage?: string;
  layoutId?: string;
  navStyle: 'sticky' | 'glassmorphism' | 'classic' | 'minimal';
  layoutStructure: 'bento' | 'split' | 'grid' | 'minimalist';
  customCSS: string;
  customJS: string;
}

export interface LayoutBlock {
  id: string;
  type: 'header' | 'hero' | 'product_grid' | 'footer';
  settings: {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    showImage?: boolean;
    bannerUrl?: string;
    gridCols?: number;
    footerText?: string;
    links?: Array<{ label: string; href: string }>;
  };
}

export interface StoreConfig {
  id: string;
  subdomain: string;
  name: string;
  tagline: string;
  currency: 'USD' | 'EUR' | 'PKR' | 'GBP' | 'JPY';
  gatewayType: 'whatsapp' | 'p2p_wallet' | 'email_sys' | 'credit_simulator';
  gatewayValue: string; // E.g., phone number, crypto address, or email
  theme: ThemeConfig;
  products: Product[];
  layoutBlocks: LayoutBlock[];
  orders?: StoreOrder[];
  updatedAt: string;
}

export interface SaaSState {
  stores: Record<string, StoreConfig>;
  activeStoreId: string;
}
