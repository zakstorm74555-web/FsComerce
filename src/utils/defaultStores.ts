/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreConfig } from '../types';

export const DEFAULT_STORES: Record<string, StoreConfig> = {
  mystore: {
    id: 'mystore',
    subdomain: 'mystore',
    name: "My NextGen Store",
    tagline: "Premium products for your lifestyle",
    currency: 'USD',
    gatewayType: 'credit_simulator',
    gatewayValue: '+14159821374',
    theme: {
      typography: 'inter',
      primaryColor: '#ffffff',
      secondaryColor: '#f9fafb',
      accentColor: '#16a34a', // E-commerce Green
      navStyle: 'classic',
      layoutStructure: 'grid',
      customCSS: `/* Clean E-commerce styles */
.store-card {
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  background-color: white;
}
.store-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}`,
      customJS: `console.log('Store initialized');`
    },
    products: [
      {
        id: 'mystore-1',
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        description: 'Ultra-soft, breathable cotton t-shirt for everyday wear.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
        sku: 'TSHIRT-01',
        stock: 50,
        variants: [
          { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
          { name: 'Color', options: ['White', 'Black', 'Navy'] }
        ]
      },
      {
        id: 'mystore-2',
        name: 'Minimalist Wrist Watch',
        price: 129.50,
        description: 'Elegant timepiece with a leather strap and durable casing.',
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60',
        sku: 'WATCH-01',
        stock: 15,
        variants: [
          { name: 'Strap', options: ['Brown Leather', 'Black Leather'] }
        ]
      },
      {
        id: 'mystore-3',
        name: 'Wireless Noise-Canceling Headphones',
        price: 199.00,
        description: 'Immersive sound quality with active noise cancellation and 30-hour battery life.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        sku: 'AUDIO-01',
        stock: 20,
        variants: []
      }
    ],
    layoutBlocks: [
      {
        id: 'block-header',
        type: 'header',
        settings: {
          heading: "My NextGen Store",
          links: [
            { label: 'Catalog', href: '#products' },
            { label: 'About Us', href: '#about' },
            { label: 'Contact', href: '#contact' }
          ]
        }
      },
      {
        id: 'block-hero',
        type: 'hero',
        settings: {
          heading: 'ELEVATE YOUR STYLE',
          subheading: 'Discover our new collection of premium goods tailored for you.',
          ctaText: 'Shop All New Arrivals',
          bannerUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80',
          showImage: true
        }
      },
      {
        id: 'block-grid',
        type: 'product_grid',
        settings: {
          heading: 'Featured Products',
          gridCols: 3
        }
      },
      {
        id: 'block-footer',
        type: 'footer',
        settings: {
          footerText: '© 2026 My NextGen Store. All rights reserved.'
        }
      }
    ],
    orders: [
      {
        id: 'ORD-1001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerAddress: '123 Main St, New York, NY',
        totalAmount: 29.99,
        status: 'Pending',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [
          {
            productId: 'mystore-1',
            name: 'Premium Cotton T-Shirt',
            price: 29.99,
            quantity: 1,
            selectedVariants: { 'Size': 'L', 'Color': 'White' }
          }
        ]
      },
      {
        id: 'ORD-1002',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@example.com',
        customerAddress: '456 Oak Ave, San Francisco, CA',
        totalAmount: 129.50,
        status: 'Shipped',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        items: [
          {
            productId: 'mystore-2',
            name: 'Minimalist Wrist Watch',
            price: 129.50,
            quantity: 1,
            selectedVariants: { 'Strap': 'Brown Leather' }
          }
        ]
      },
      {
        id: 'ORD-1003',
        customerName: 'Michael Chang',
        customerEmail: 'mchang@example.com',
        customerAddress: '789 Pine St, Seattle, WA',
        totalAmount: 199.00,
        status: 'Shipped',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [
          {
            productId: 'mystore-3',
            name: 'Wireless Noise-Canceling Headphones',
            price: 199.00,
            quantity: 1
          }
        ]
      },
      {
        id: 'ORD-1004',
        customerName: 'Emily Rodriguez',
        customerEmail: 'emily.r@example.com',
        customerAddress: '321 Maple Dr, Austin, TX',
        totalAmount: 59.98,
        status: 'Sourced',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        items: [
          {
            productId: 'mystore-1',
            name: 'Premium Cotton T-Shirt',
            price: 29.99,
            quantity: 2,
            selectedVariants: { 'Size': 'M', 'Color': 'Black' }
          }
        ]
      },
      {
        id: 'ORD-1005',
        customerName: 'David Kim',
        customerEmail: 'dkim@example.com',
        customerAddress: '555 Cedar Rd, Chicago, IL',
        totalAmount: 328.50,
        status: 'Shipped',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        items: [
          {
            productId: 'mystore-2',
            name: 'Minimalist Wrist Watch',
            price: 129.50,
            quantity: 1,
            selectedVariants: { 'Strap': 'Black Leather' }
          },
          {
            productId: 'mystore-3',
            name: 'Wireless Noise-Canceling Headphones',
            price: 199.00,
            quantity: 1
          }
        ]
      }
    ],
    updatedAt: new Date().toISOString()
  }
};
