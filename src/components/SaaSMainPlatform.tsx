/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StoreConfig, Product, LayoutBlock, ThemeConfig, StoreOrder, OrderItem } from '../types';
import { DEFAULT_STORES } from '../utils/defaultStores';
import { 
  Sliders, Code2, Cpu, Edit, Plus, Trash2, FolderSync, 
  Upload, AlertCircle, Eye, Settings, ShoppingBag, 
  Sparkles, Check, Database, Play, Code, CheckSquare, Save, Image, RefreshCw,
  Lock, Unlock, Users, TrendingUp, Coins, BarChart2, FileText, QrCode, ClipboardList,
  LogOut, Monitor, Package, Inbox, LayoutGrid, DownloadCloud, ArrowRight
} from 'lucide-react';
import LivePreviewFrame from './LivePreviewFrame';
import StandaloneExporter from './StandaloneExporter';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface SaaSMainPlatformProps {
  initialStores: Record<string, StoreConfig>;
  activeStoreId: string;
  onStoreUpdate: (id: string, config: StoreConfig) => void;
  onActiveStoreChange: (id: string) => void;
}

// Preset visual images for fast store uploads
const PRESET_IMAGE_SUGGESTIONS = [
  { name: 'Neural Chipset', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60' },
  { name: 'Modern Layout', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60' },
  { name: 'Tactical Lens', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60' },
  { name: 'Carbon Fiber Plating', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60' },
  { name: 'Modern Skyline', url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Modern Gadget', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60' }
];

export default function SaaSMainPlatform({
  initialStores,
  activeStoreId,
  onStoreUpdate,
  onActiveStoreChange
}: SaaSMainPlatformProps) {
  // 1. Enterprise Session / Auth State Simulation
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; storeId: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form Input States
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authSubdomain, setAuthSubdomain] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active platform states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visual' | 'code' | 'products' | 'orders' | 'templates' | 'deploy'>('dashboard');
  const store = initialStores[activeStoreId] || Object.values(initialStores)[0];

  // Form states for adding/editing products with enhanced inventory properties
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 350,
    description: '',
    imageUrl: PRESET_IMAGE_SUGGESTIONS[0].url,
    sku: '',
    stock: 20,
    variants: [] as Array<{ name: string; options: string[] }>
  });
  
  // Local Variant Creation States
  const [tempVariantName, setTempVariantName] = useState('');
  const [tempVariantOptions, setTempVariantOptions] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // File API Theme Uploader states
  const [themeUploadError, setThemeUploadError] = useState<string | null>(null);
  const [themeUploadSuccess, setThemeUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  // Code editor lines calculator helper
  const [cssCode, setCssCode] = useState(store.theme.customCSS);
  const [jsCode, setJsCode] = useState(store.theme.customJS);

  // Clear or load pre-existing merchant session from localStorage
  useEffect(() => {
    const cachedSession = localStorage.getItem('fscom_merchant_session');
    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);
        setCurrentUser(parsed);
        // Automatically swap active store to merchant's registered workspace
        if (initialStores[parsed.storeId]) {
          onActiveStoreChange(parsed.storeId);
        }
      } catch (err) {
        console.warn('Stale auth session pruned.');
      }
    }
  }, []);

  // Update dynamic editor settings on store swap
  useEffect(() => {
    setCssCode(store.theme.customCSS);
    setJsCode(store.theme.customJS);
  }, [store.id, store.theme.customCSS, store.theme.customJS]);

  // Auto-sku compiler on product name typing
  useEffect(() => {
    if (!editingProductId && newProduct.name) {
      const slug = newProduct.name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '-')
        .slice(0, 10);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setNewProduct(prev => ({
        ...prev,
        sku: `FS-${store.id.toUpperCase()}-${slug}-${randomSuffix}`
      }));
    }
  }, [newProduct.name, store.id, editingProductId]);

  // 1. Enterprise Mock Auth Screen Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authEmail)) {
      setAuthError('Please input a valid admin email address.');
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Authentication tokens must contain at least 6 characters.');
      return;
    }

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth, db } = await import('../lib/firebase');
      const { doc, getDoc, setDoc } = await import('firebase/firestore');

      if (authMode === 'login') {
        const matchingStoreId = authSubdomain.toLowerCase().trim();
        
        // Attempt login
        const userCredential = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        
        // Verify User's store metadata
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const username = userDoc.exists() ? userDoc.data()?.username : 'AUTHORIZED_OPERATOR';
        const storeId = userDoc.exists() ? userDoc.data()?.storeId : matchingStoreId;

        if (initialStores[storeId] || matchingStoreId) {
          const activeId = initialStores[storeId] ? storeId : matchingStoreId;
          const session = {
            username: username,
            email: authEmail,
            storeId: activeId
          };
          localStorage.setItem('fscom_merchant_session', JSON.stringify(session));
          setCurrentUser(session);
          onActiveStoreChange(activeId);
        } else {
          setAuthError(`No stores configured for subdomain /"${matchingStoreId}".`);
        }
      } else {
        // Register logic
        const cleanSub = authSubdomain.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase().trim();
        if (!cleanSub) {
          setAuthError('Please define a virtual subdomain index.');
          return;
        }

        if (initialStores[cleanSub]) {
          setAuthError('Virtual subdomain routing keyword is already claimed on the active cluster!');
          return;
        }

        // Setup Firebase User Auth
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        
        // Setup User map doc
        await setDoc(doc(db, 'users', userCredential.user.uid), {
           email: authEmail,
           username: authUsername.trim(),
           storeId: cleanSub
        });

        // Provision new compliant store config
        const newProvisionedStore: StoreConfig = {
          id: cleanSub,
          subdomain: cleanSub,
          name: `${authUsername.trim().toUpperCase()}'S COMPONENT PORTAL`,
          tagline: "Modern E-commerce store compiled on FSCommerce.",
          currency: 'USD',
          gatewayType: 'whatsapp',
          gatewayValue: '+14159821374',
          theme: {
            typography: 'orbitron',
            primaryColor: '#0a0d16',
            secondaryColor: '#121824',
            accentColor: '#00f0ff', // Standard Cyan
            navStyle: 'glassmorphism',
            layoutStructure: 'bento',
            customCSS: `/* Custom branding overrides */`,
            customJS: `console.log('Merchant workspace compiled custom run sequencers.');`
          },
          products: [
            {
              id: cleanSub + '-seed',
              name: 'Premium Store Template',
              price: 550,
              description: 'Modern template offering integrated EasyPaisa/WhatsApp router capabilities.',
              imageUrl: PRESET_IMAGE_SUGGESTIONS[0].url,
              sku: `FS-${cleanSub.toUpperCase()}-SEED-101`,
              stock: 45,
              variants: [
                { name: 'Enclosure', options: ['Billet Aluminum', 'Raw Steel', 'Stealth Carbon'] }
              ]
            }
          ],
          layoutBlocks: [
            {
              id: 'block-header',
              type: 'header',
              settings: { heading: `${authUsername.toUpperCase()} LABS`, links: [{ label: "DEVICES", href: "#products" }] }
            },
            {
              id: 'block-hero',
              type: 'hero',
              settings: { heading: `STOREFRONT://${cleanSub.toUpperCase()}`, subheading: "Dynamic storefront checkouts assembled fully P2P, no-fees.", ctaText: "DEPLOY ACCESS", showImage: true, bannerUrl: PRESET_IMAGE_SUGGESTIONS[4].url }
            },
            {
              id: 'block-grid',
              type: 'product_grid',
              settings: { heading: "Active Hardware Catalogs", gridCols: 3 }
            },
            {
              id: 'block-footer',
              type: 'footer',
              settings: { footerText: `© 2026. Modern E-commerce store. Powered by FSCommerce.` }
            }
          ],
          orders: [],
          updatedAt: new Date().toISOString()
        };

        // Push into state tree
        const updatedStores = {
          ...initialStores,
          [cleanSub]: newProvisionedStore
        };

        // Save to persistence
        onStoreUpdate(cleanSub, newProvisionedStore);
        onActiveStoreChange(cleanSub);

        const session = {
          username: authUsername,
          email: authEmail,
          storeId: cleanSub
        };
        
        localStorage.setItem('fscom_merchant_session', JSON.stringify(session));
        setCurrentUser(session);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Fatal authentication error encountered during handshake.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fscom_merchant_session');
    setCurrentUser(null);
  };

  // Update specific fields of the sub-theme
  const updateThemeField = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    const updatedConfig: StoreConfig = {
      ...store,
      theme: {
        ...store.theme,
        [key]: value
      },
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  // Update general store fields
  const updateStoreField = <K extends keyof StoreConfig>(key: K, value: StoreConfig[K]) => {
    const updatedConfig: StoreConfig = {
      ...store,
      [key]: value,
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  // Handle Standard theme schema parsing file API
  const handleThemeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setThemeUploadError(null);
    setThemeUploadSuccess(false);

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const schema = JSON.parse(text);

        if (!schema.blocks || !Array.isArray(schema.blocks)) {
          throw new Error("Invalid theme schema: File missing required 'blocks' component registry array.");
        }

        const compiledBlocks: LayoutBlock[] = schema.blocks.map((b: any) => ({
          id: b.id || 'block-' + Math.random().toString(36).substr(2, 9),
          type: b.type,
          settings: b.settings || {}
        }));

        const newTheme: ThemeConfig = {
          ...store.theme,
          typography: schema.theme?.typography || store.theme.typography,
          primaryColor: schema.theme?.primaryColor || store.theme.primaryColor,
          secondaryColor: schema.theme?.secondaryColor || store.theme.secondaryColor,
          accentColor: schema.theme?.accentColor || store.theme.accentColor,
          navStyle: schema.theme?.navStyle || store.theme.navStyle,
          layoutStructure: schema.theme?.layoutStructure || store.theme.layoutStructure,
        };

        const updatedConfig: StoreConfig = {
          ...store,
          theme: newTheme,
          layoutBlocks: compiledBlocks,
          updatedAt: new Date().toISOString()
        };

        onStoreUpdate(store.id, updatedConfig);
        setThemeUploadSuccess(true);
        setTimeout(() => setThemeUploadSuccess(false), 3000);
      } catch (err: any) {
        setThemeUploadError(err.message || 'Error processing layout payload.');
      }
    };

    reader.readAsText(file);
  };

  // Preset templates injection engine
  const applyPresetTemplate = (type: 'modern' | 'industrial' | 'stealth') => {
    let colors: Partial<ThemeConfig> = {};

    if (type === 'modern') {
      colors = {
        typography: 'orbitron',
        primaryColor: '#090d16',
        secondaryColor: '#121824',
        accentColor: '#00f0ff', // Modern Blue
        navStyle: 'glassmorphism',
        layoutStructure: 'bento',
        customCSS: `/* Cyber punk glowing cards override */\n.store-card { border-image: linear-gradient(to right, #00f0ff, #ff007f) 1; }\n.pulse-glow { animation: neonGlow 2s infinite alternate; }`
      };
    } else if (type === 'industrial') {
      colors = {
        typography: 'fira-code',
        primaryColor: '#0c0d10',
        secondaryColor: '#1f2833',
        accentColor: '#66fcf1', // Industrial Turquoise
        navStyle: 'sticky',
        layoutStructure: 'split',
        customCSS: `/* Modern minimalist borders */\n.store-card { border: 2px solid #66fcf1 !important; border-radius: 0px !important; }`
      };
    } else {
      colors = {
        typography: 'space-grotesk',
        primaryColor: '#050505',
        secondaryColor: '#111111',
        accentColor: '#39ff14', // Forest Green
        navStyle: 'minimal',
        layoutStructure: 'grid',
        customCSS: `/* Direct Green Text Glow */\n@keyframes fade-in { from { opacity: 0.9; } to { opacity: 0.5; } }\n.text-glow { text-shadow: 0 0 8px #39ff14; }`
      };
    }

    const updatedConfig: StoreConfig = {
      ...store,
      theme: {
        ...store.theme,
        ...colors
      } as ThemeConfig,
      updatedAt: new Date().toISOString()
    };

    onStoreUpdate(store.id, updatedConfig);
    setCssCode(colors.customCSS || '');
  };

  // Code editor updates bind
  const saveCustomCode = () => {
    const updatedConfig: StoreConfig = {
      ...store,
      theme: {
        ...store.theme,
        customCSS: cssCode,
        customJS: jsCode
      },
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  // Local File image blob uploader
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct(prev => ({
        ...prev,
        imageUrl: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  // Dynamic Product Variants addition
  const handleAddTempVariant = () => {
    if (!tempVariantName.trim() || !tempVariantOptions.trim()) return;
    const optionsArray = tempVariantOptions
      .split(',')
      .map(o => o.trim())
      .filter(o => o.length > 0);
    
    if (optionsArray.length === 0) return;

    setNewProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { name: tempVariantName.trim(), options: optionsArray }]
    }));

    setTempVariantName('');
    setTempVariantOptions('');
  };

  const handleRemoveVariantSpec = (idx: number) => {
    setNewProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
  };

  // Assemble/Update Product data inside state
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingProductId || 'prod-' + Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      imageUrl: newProduct.imageUrl,
      sku: newProduct.sku,
      stock: newProduct.stock,
      variants: newProduct.variants
    };

    let updatedProducts = [...store.products];
    if (editingProductId) {
      updatedProducts = updatedProducts.map(p => p.id === editingProductId ? productData : p);
      setEditingProductId(null);
    } else {
      updatedProducts.push(productData);
    }

    const updatedConfig: StoreConfig = {
      ...store,
      products: updatedProducts,
      updatedAt: new Date().toISOString()
    };

    onStoreUpdate(store.id, updatedConfig);

    // Reset clean product inputs
    setNewProduct({
      name: '',
      price: 250,
      description: '',
      imageUrl: PRESET_IMAGE_SUGGESTIONS[0].url,
      sku: '',
      stock: 20,
      variants: []
    });
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      sku: product.sku || '',
      stock: product.stock || 10,
      variants: product.variants || []
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm("Confirm component extraction from memory registry?")) return;
    const updatedProducts = store.products.filter(p => p.id !== id);
    const updatedConfig: StoreConfig = {
      ...store,
      products: updatedProducts,
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  // Orders and status alterations
  const handleUpdateOrderStatus = (orderId: string, newStatus: StoreOrder['status']) => {
    const currentOrders = store.orders || [];
    const updatedOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    const updatedConfig: StoreConfig = {
      ...store,
      orders: updatedOrders,
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  const handleClearOrdersLog = () => {
    if (!window.confirm("Verify hardware checkout queue flush?")) return;
    const updatedConfig: StoreConfig = {
      ...store,
      orders: [],
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  // Generate downloadable JSON theme file
  const downloadSchemaJson = () => {
    const schemaFile = {
      name: `${store.name} Standard theme schema`,
      theme: {
        typography: store.theme.typography,
        primaryColor: store.theme.primaryColor,
        secondaryColor: store.theme.secondaryColor,
        accentColor: store.theme.accentColor,
        navStyle: store.theme.navStyle,
        layoutStructure: store.theme.layoutStructure
      },
      blocks: store.layoutBlocks
    };

    const link = document.createElement("a");
    const jsonBlob = new Blob([JSON.stringify(schemaFile, null, 2)], { type: 'application/json' });
    link.href = URL.createObjectURL(jsonBlob);
    link.download = `${store.id}-shopify-theme.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics Math Engine
  const getOrdersCount = () => store.orders?.length || 0;
  
  const getUniqueVisits = () => {
    return 640 + getOrdersCount() * 14 + (store.id === 'ali' ? 245 : 82);
  };

  const getStoreReach = () => {
    return 1120 + getOrdersCount() * 32 + (store.id === 'ali' ? 490 : 152);
  };

  const getTotalRevenue = () => {
    const list = store.orders || [];
    return list
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  // Sales Trend Data for Recharts AreaChart (last 7 days)
  const getSalesTrendData = () => {
    const list = store.orders || [];
    const trendDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    }).reverse();

    return trendDays.map(dateStr => {
      const dayOrders = list.filter(o => {
        const oDate = o.timestamp?.split('T')[0];
        return oDate === dateStr && o.status !== 'Cancelled';
      });

      const totalRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalCount = dayOrders.length;

      // label formatting
      const parsedDate = new Date(dateStr + 'T00:00:00');
      const label = parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      return {
        date: dateStr,
        label,
        Revenue: totalRevenue,
        Orders: totalCount
      };
    });
  };

  // Product Bestseller Data for Recharts BarChart
  const getProductSalesData = () => {
    const list = store.orders || [];
    const productMap: Record<string, { name: string; sales: number; revenue: number }> = {};

    list.filter(o => o.status !== 'Cancelled').forEach(order => {
      order.items?.forEach(item => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            name: item.name || 'Unknown Product',
            sales: 0,
            revenue: 0
          };
        }
        productMap[item.productId].sales += item.quantity;
        productMap[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // top 5
  };

  // Order Status Distribution for PieChart
  const getOrderStatusData = () => {
    const list = store.orders || [];
    const statusCounts = {
      Pending: 0,
      Sourced: 0,
      Shipped: 0,
      Cancelled: 0
    };

    list.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      } else {
        statusCounts['Pending']++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    })).filter(item => item.value > 0);
  };

  // Generator of simulated store orders for deep analytical visualization
  const handleGenerateMockOrders = () => {
    const products = store.products;
    if (products.length === 0) {
      alert("Please add at least one product first so we can generate matching sales analytics!");
      return;
    }

    const firstNames = ['John', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'James', 'Mia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'];
    const statuses: StoreOrder['status'][] = ['Shipped', 'Sourced', 'Pending', 'Cancelled'];

    const generated: StoreOrder[] = Array.from({ length: 12 }).map((_, i) => {
      const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const p = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      
      const item: OrderItem = {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: qty
      };

      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 7));
      d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

      const status = statuses[Math.floor(Math.random() * (i === 0 ? 3 : statuses.length))];

      return {
        id: orderId,
        customerName: `${fName} ${lName}`,
        customerEmail: `${fName.toLowerCase()}@example.com`,
        customerAddress: `${Math.floor(Math.random() * 900) + 100} Broadway, New York, NY`,
        items: [item],
        totalAmount: p.price * qty,
        status,
        timestamp: d.toISOString()
      };
    });

    const updatedConfig: StoreConfig = {
      ...store,
      orders: [...generated, ...(store.orders || [])],
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(store.id, updatedConfig);
  };

  const getCurrencySymbol = () => {
    switch (store.currency) {
      case 'EUR': return '€';
      case 'PKR': return '₨';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return '$';
    }
  };

  const getLineCount = (str: string) => {
    return (str.match(/\n/g) || []).length + 2;
  };

  // 1. RENDER AUTH SCREEN WINDOW IF NOT LOGGED IN
  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div id="saas-corporate-login-system" className="w-full max-w-md bg-white border border-gray-200 rounded-xl overflow-hidden p-6 relative">
          
          {/* Store accents design */}
          <div className="absolute top-0 right-0 p-1.5 px-3 bg-green-50 border-b border-l border-cyan-800 text-3xs font-sans text-green-600 font-bold tracking-widest uppercase">
            ADMIN LOGIN
          </div>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-900 border border-cyan-400 rounded mx-auto flex items-center justify-center shadow-sm mb-4">
              <Lock className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-lg font-black font-sans tracking-wider text-gray-900 uppercase">
              {authMode === 'login' ? 'ADMIN LOGIN' : 'CREATE STORE'}
            </h2>
            <p className="text-3xs font-sans text-gray-500 mt-1 uppercase leading-normal">
              NextGen Commerce Admin Portal
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {authMode === 'register' && (
              <div>
                <label className="block text-xxs font-sans text-gray-500 uppercase mb-1">Merchant Username / Company Name</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="e.g. CORE SECURE"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs focus:border-green-600 font-sans text-gray-900 placeholder-slate-650"
                />
              </div>
            )}

            <div>
              <label className="block text-xxs font-sans text-gray-500 uppercase mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="e.g. operator@store.com"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs focus:border-green-600 font-sans text-gray-900 placeholder-slate-650"
              />
            </div>

            <div>
              <label className="block text-xxs font-sans text-gray-500 uppercase mb-1">
                {authMode === 'login' ? 'Store Name' : 'Store URL Slug'}
              </label>
              <div className="flex bg-white border border-gray-200 rounded overflow-hidden">
                <input
                  type="text"
                  required
                  value={authSubdomain}
                  onChange={(e) => setAuthSubdomain(e.target.value.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, ""))}
                  placeholder="e.g. ali or ghost"
                  className="flex-1 px-3 py-2 bg-transparent text-xs focus:outline-none font-sans text-gray-900 placeholder-slate-650"
                />
                <span className="p-2 py-2 bg-white border-l border-gray-200 font-sans text-3xs text-gray-500 flex items-center">
                  .fscom.eu.org
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xxs font-sans text-gray-500 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs focus:border-green-600 font-sans text-gray-900 placeholder-slate-650"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/20 border border-red-800/45 text-red-400 font-sans text-3xs rounded-md leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-green-600 hover:bg-cyan-400 text-black text-xs font-sans font-black uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              {authMode === 'login' ? 'LOG IN' : 'CREATE STORE'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-200 text-center font-sans text-3xs text-gray-500">
            {authMode === 'login' ? (
              <span className="uppercase">
                New to NextGen?{' '}
                <button 
                  onClick={() => { setAuthMode('register'); setAuthError(null); }}
                  className="text-green-600 hover:underline font-bold"
                >
                  Create a Store
                </button>
              </span>
            ) : (
              <span className="uppercase">
                Already have a store?{' '}
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className="text-green-600 hover:underline font-bold"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex w-full h-[calc(100vh-64px)] max-h-[1200px] bg-[#f4f6f8] text-[#202223] font-sans antialiased border border-t-0 border-[#e1e3e5] shadow-inner overflow-hidden">
      
      {/* SHOPIFY-STYLE SIDEBAR */}
      <div className="w-16 md:w-[240px] bg-[#ebebeb] flex flex-col shrink-0 border-r border-[#e1e3e5] h-full overflow-hidden transition-all">
        
        {/* Store Navigator Header */}
        <div className="p-4 border-b border-[#e1e3e5] flex items-center justify-between bg-[#e1e3e5]/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 bg-[#202223] rounded flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:flex flex-col truncate">
              <span className="text-sm font-semibold truncate leading-tight">{store.name || 'Store'}</span>
              <span className="text-xs text-[#6d7175] truncate">/ {activeStoreId}.fscom</span>
            </div>
          </div>
          <button onClick={handleLogout} className="hidden md:flex text-xs text-[#6d7175] hover:text-[#202223] transition" title="Log Out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin">
          <div className="hidden md:block px-2 text-[11px] font-semibold text-[#6d7175] uppercase tracking-wider mb-2 mt-2">Sales Channels</div>
          
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
            { id: 'visual', label: 'Online Store', icon: Monitor },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: Inbox },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isSelected ? 'bg-white text-[#202223] shadow-sm' : 'text-[#6d7175] hover:bg-[#e1e3e5]/50 hover:text-[#202223]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#008060]' : 'text-[#6d7175]'}`} />
                <span className="hidden md:inline-block">{tab.label}</span>
              </button>
            )
          })}

           <div className="hidden md:block px-2 text-[11px] font-semibold text-[#6d7175] uppercase tracking-wider mb-2 mt-6">Settings & Scale</div>
           {[
            { id: 'templates', label: 'Theme Market', icon: LayoutGrid },
            { id: 'code', label: 'Code Edit', icon: Code2 },
            { id: 'deploy', label: 'Export', icon: DownloadCloud }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isSelected ? 'bg-white text-[#202223] shadow-sm' : 'text-[#6d7175] hover:bg-[#e1e3e5]/50 hover:text-[#202223]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#008060]' : 'text-[#6d7175]'}`} />
                <span className="hidden md:inline-block">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Small Bottom Profile */}
        <div className="p-4 border-t border-[#e1e3e5] flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser?.username.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col truncate">
             <span className="text-xs font-semibold">{currentUser?.username}</span>
             <span className="text-[10px] text-[#6d7175]">Admin</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f8] relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#e1e3e5] px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
           <h1 className="text-lg font-semibold tracking-tight text-[#202223] capitalize">
             {activeTab === 'visual' ? 'Store Editor' : activeTab === 'templates' ? 'Theme Marketplace' : activeTab === 'dashboard' ? 'Analytics Dashboard' : activeTab}
           </h1>
           {activeTab === 'visual' && (
             <div className="flex items-center gap-2 text-xs">
               <span className="flex items-center gap-1.5 px-2 py-1 bg-[#e4f8ec] text-[#008060] border border-[#aae4c7] rounded-md font-medium">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-pulse"></div>
                 Live View
               </span>
             </div>
           )}
        </header>

        {/* Dynamic Context Render */}
        <div className="flex-1 overflow-hidden relative">

           {/* IF ONLINE STORE (VISUAL EDITOR), RENDER SPLIT MODE */}
           {activeTab === 'visual' ? (
             <div className="flex w-full h-full">
               
               {/* Configurator Left Panel */}
               <div className="w-[320px] bg-white border-r border-[#e1e3e5] flex flex-col h-full shrink-0 z-0">
                  <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                    
                    {/* Basic Meta */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Identity</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Company Workspace Name</label>
                          <input
                            type="text"
                            value={store.name}
                            onChange={(e) => updateStoreField('name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Tagline</label>
                          <input
                            type="text"
                            value={store.tagline}
                            onChange={(e) => updateStoreField('tagline', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                    {/* Layouts */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Layout Preset</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['modern', 'classic', 'stealth', 'industrial'].map(preset => (
                          <button
                            key={preset}
                            onClick={() => applyPresetTemplate(preset as any)}
                            className={`py-2 px-3 text-xs font-medium rounded-lg border capitalize transition shadow-sm ${
                              store.theme.layoutId === preset 
                              ? 'bg-[#f4f6f8] border-[#202223] text-[#202223]' 
                              : 'bg-white border-[#c9cccf] text-[#6d7175] hover:border-[#8c9196]'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                    {/* Aesthetics */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Color Engine</h3>
                      <div className="space-y-3">
                        {['primaryColor', 'accentColor', 'textColor', 'backgroundColor'].map(colorKey => (
                          <div key={colorKey} className="flex items-center justify-between bg-white border border-[#c9cccf] p-2 rounded-lg shadow-sm">
                            <span className="text-xs font-medium text-[#6d7175] capitalize">{colorKey.replace('Color', '')}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={(store.theme as any)[colorKey]}
                                onChange={(e) => updateThemeField(colorKey as keyof ThemeConfig, e.target.value)}
                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                     {/* Checkout Strategy */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Checkout Engine</h3>
                      <div className="space-y-3">
                        <select
                          value={store.gatewayType}
                          onChange={(e) => {
                            const newStore = { ...store };
                            newStore.gatewayType = e.target.value as any;
                            onStoreUpdate(store.id, newStore);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                        >
                          <option value="credit_simulator">💳 Direct Credit Card (Simulator)</option>
                          <option value="p2p_wallet">🔗 Direct Bank Transfer</option>
                        </select>
                      </div>
                    </div>

                  </div>
               </div>

               {/* Live Storefront Right Panel */}
               <div className="flex-1 bg-[#f4f6f8] h-full overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
                  <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-[#e1e3e5] bg-white">
                    <LivePreviewFrame config={store} onStoreUpdate={(updatedConfig) => onStoreUpdate(store.id, updatedConfig)} />
                  </div>
               </div>

             </div>
           ) : (
             
             /* OTHER TABS SCROLLABLE CONTENT (SHOPIFY STYLE) */
             <div className="w-full h-full overflow-y-auto p-6 lg:p-10 scrollbar-thin">
               <div className="max-w-[1000px] mx-auto animate-fade-in space-y-6">
                 
                 {/* TAB: DASHBOARD */}
                 {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      {/* Dashboard Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Store Overview</h2>
                          <p className="text-sm text-[#6d7175]">Real-time statistics, performance metrics, and growth trajectories.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleGenerateMockOrders}
                            className="px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Generate Sandbox Orders
                          </button>
                          {store.orders && store.orders.length > 0 && (
                            <button
                              onClick={handleClearOrdersLog}
                              className="px-3.5 py-1.5 bg-white border border-[#c9cccf] text-red-650 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Clear Log
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Total Revenue */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total Sales</span>
                            <div className="p-1.5 bg-green-50 text-[#008060] rounded-lg">
                              <Coins className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#202223] mt-1">
                              {getCurrencySymbol()}{getTotalRevenue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-[11px] text-[#6d7175] mt-0.5">Excludes cancelled orders</p>
                          </div>
                        </div>

                        {/* Card 2: Total Orders */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Orders</span>
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                              <Inbox className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#202223] mt-1">
                              {getOrdersCount()}
                            </h3>
                            <p className="text-[11px] text-[#6d7175] mt-0.5">Total lifetime checkouts</p>
                          </div>
                        </div>

                        {/* Card 3: Average Order Value */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Average Order Value</span>
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#202223] mt-1">
                              {getCurrencySymbol()}{(getOrdersCount() > 0 ? (getTotalRevenue() / getOrdersCount()) : 0).toFixed(2)}
                            </h3>
                            <p className="text-[11px] text-[#6d7175] mt-0.5">AOV per processed sale</p>
                          </div>
                        </div>

                        {/* Card 4: Catalog Size */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Products</span>
                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                              <Package className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#202223] mt-1">
                              {store.products.length}
                            </h3>
                            <p className="text-[11px] text-[#6d7175] mt-0.5">Active items in catalog</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Graphics Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart 1: Revenue & Growth Trend */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-sm lg:col-span-2 flex flex-col h-[340px]">
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-[#202223]">Sales Performance Trend</h4>
                            <p className="text-xs text-[#6d7175]">Gross daily revenue over the last 7 days</p>
                          </div>
                          <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getSalesTrendData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={store.theme.accentColor || "#008060"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={store.theme.accentColor || "#008060"} stopOpacity={0.0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${getCurrencySymbol()}${v}`} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e1e3e5', borderRadius: '8px', fontSize: '12px' }}
                                  formatter={(value: any) => [`${getCurrencySymbol()}${Number(value).toFixed(2)}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="Revenue" stroke={store.theme.accentColor || "#008060"} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Chart 2: Order Status Distribution */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-sm flex flex-col h-[340px]">
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-[#202223]">Status Distribution</h4>
                            <p className="text-xs text-[#6d7175]">Ratio of current order states</p>
                          </div>
                          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                            {getOrderStatusData().length > 0 ? (
                              <div className="w-full h-full flex flex-col items-center">
                                <div className="flex-1 w-full min-h-0">
                                  <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                      <Pie
                                        data={getOrderStatusData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                      >
                                        {getOrderStatusData().map((entry) => {
                                          let color = '#d97706'; // pending
                                          if (entry.name === 'Shipped') color = '#16a34a'; // green
                                          if (entry.name === 'Sourced') color = '#2563eb'; // blue
                                          if (entry.name === 'Cancelled') color = '#dc2626'; // red
                                          return <Cell key={`cell-${entry.name}`} fill={color} />;
                                        })}
                                      </Pie>
                                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-2xs font-medium text-[#6d7175]">
                                  {getOrderStatusData().map((entry) => {
                                    let colorClass = 'bg-amber-500';
                                    if (entry.name === 'Shipped') colorClass = 'bg-green-600';
                                    if (entry.name === 'Sourced') colorClass = 'bg-blue-600';
                                    if (entry.name === 'Cancelled') colorClass = 'bg-red-600';
                                    return (
                                      <div key={entry.name} className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${colorClass}`} />
                                        <span>{entry.name} ({entry.value})</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-xs text-[#6d7175]">No order data available.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Secondary Graphics Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart 3: Top Selling Products */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-sm flex flex-col h-[320px]">
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-[#202223]">Bestselling Products</h4>
                            <p className="text-xs text-[#6d7175]">Top items driving store revenue</p>
                          </div>
                          <div className="flex-1 w-full min-h-0">
                            {getProductSalesData().length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getProductSalesData()} layout="vertical" margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                  <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} width={100} />
                                  <Tooltip
                                    contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                                    formatter={(value: any) => [`${getCurrencySymbol()}${Number(value).toFixed(2)}`, 'Revenue']}
                                  />
                                  <Bar dataKey="revenue" fill={store.theme.accentColor || "#008060"} radius={[0, 4, 4, 0]} barSize={14} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-[#6d7175]">
                                No transactions registered to generate product metrics yet.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Recent Transactions Summary Table */}
                        <div className="bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-sm flex flex-col h-[320px] overflow-hidden">
                          <div className="mb-4 flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-semibold text-[#202223]">Recent Purchases</h4>
                              <p className="text-xs text-[#6d7175]">Last actions registered on storefront</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="text-xs text-[#008060] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              Manage All <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-gray-150 text-[#6d7175]">
                                  <th className="pb-2 font-semibold uppercase">ID</th>
                                  <th className="pb-2 font-semibold uppercase">Customer</th>
                                  <th className="pb-2 font-semibold uppercase">Status</th>
                                  <th className="pb-2 font-semibold text-right">Invoice</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(store.orders || []).slice(0, 5).map(o => (
                                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                                    <td className="py-2.5 font-medium">#{o.id.slice(0, 8)}</td>
                                    <td className="py-2.5 truncate max-w-[120px]" title={o.customerName}>{o.customerName}</td>
                                    <td className="py-2.5">
                                      <span className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                        o.status === 'Sourced' ? 'bg-blue-100 text-blue-800' :
                                        o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {o.status}
                                      </span>
                                    </td>
                                    <td className="py-2.5 text-right font-medium">{getCurrencySymbol()}{o.totalAmount.toFixed(2)}</td>
                                  </tr>
                                ))}
                                {(!store.orders || store.orders.length === 0) && (
                                  <tr>
                                    <td colSpan={4} className="py-12 text-center text-[#6d7175]">
                                      No registered transactions found. Try generating sandbox orders above!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                 )}

                 {/* TAB: PRODUCTS */}
                 {activeTab === 'products' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Products</h2>
                          <p className="text-sm text-[#6d7175]">Manage inventory and create variants.</p>
                        </div>
                      </div>

                      {/* Add Product Widget */}
                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-[#e1e3e5] bg-[#f9fafb]">
                          <h3 className="text-sm font-semibold">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                              <input type="text" value={newProduct.name} onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" placeholder="e.g. Classic T-Shirt" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#202223] mb-1">Price ($)</label>
                              <input type="number" value={newProduct.price} onChange={(e) => setNewProduct(prev => ({...prev, price: Number(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-[#202223] mb-1">Image URL</label>
                              <input type="text" value={newProduct.imageUrl} onChange={(e) => setNewProduct(prev => ({...prev, imageUrl: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-[#202223] mb-1">Description</label>
                              <textarea value={newProduct.description} onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm h-20 resize-none"></textarea>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2">
                             <button onClick={handleProductSubmit} className="px-4 py-2 bg-[#008060] text-white text-sm font-semibold rounded-lg hover:bg-[#006e52] shadow-sm transition">
                               {editingProductId ? 'Save changes' : 'Save product'}
                             </button>
                             {editingProductId && (
                               <button onClick={() => { setEditingProductId(null); setNewProduct({name: '', price: 0, description: '', imageUrl: '', sku: '', stock: 0, variants: []}); }} className="ml-2 px-4 py-2 bg-white border border-[#c9cccf] text-[#202223] text-sm font-semibold rounded-lg hover:bg-[#f4f6f8] shadow-sm transition">
                                 Cancel
                               </button>
                             )}
                          </div>
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead className="bg-[#f9fafb] border-b border-[#e1e3e5]">
                            <tr>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Product</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Inventory</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Price</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.products.map(p => (
                              <tr key={p.id} className="border-b border-[#e1e3e5] hover:bg-[#f9fafb] transition">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded border border-[#e1e3e5]" />
                                    <span className="font-medium text-[#202223] text-sm">{p.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  <span className="inline-block px-2 py-0.5 bg-[#e4f8ec] text-[#008060] rounded-full text-xs font-semibold">Active</span>
                                </td>
                                <td className="px-5 py-3 text-sm text-[#202223] font-medium">{p.stock} in stock</td>
                                <td className="px-5 py-3 text-sm text-[#202223]">\${p.price.toFixed(2)}</td>
                                <td className="px-5 py-3 text-right">
                                  <button onClick={() => handleEditProductClick(p)} className="text-[#008060] hover:text-[#006e52] text-sm font-semibold mr-3">Edit</button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-700 text-sm font-semibold">Delete</button>
                                </td>
                              </tr>
                            ))}
                            {store.products.length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6d7175]">No products available. Add one above.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {/* TAB: ORDERS */}
                 {activeTab === 'orders' && (
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Orders</h2>
                          <p className="text-sm text-[#6d7175]">Manage incoming purchases and shipments.</p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead className="bg-[#f9fafb] border-b border-[#e1e3e5]">
                             <tr>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Order ID</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Total</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Date</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.orders.map(order => (
                              <tr key={order.id} className="border-b border-[#e1e3e5] hover:bg-[#f9fafb] transition">
                                <td className="px-5 py-4 text-sm font-medium text-[#202223]">
                                  #{order.id.slice(0, 8)}
                                  <div className="text-xs text-[#6d7175] font-normal">{order.customerName}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Sourced' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-[#202223]">\${order.totalAmount.toFixed(2)}</td>
                                <td className="px-5 py-4 text-xs text-[#6d7175]">{new Date(order.timestamp).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-right">
                                   <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                    className="px-2 py-1 bg-white border border-[#c9cccf] rounded text-xs focus:outline-none shadow-sm cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Sourced">Sourced</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {store.orders.length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-5 py-12 text-center">
                                  <Inbox className="w-8 h-8 text-[#c9cccf] mx-auto mb-2" />
                                  <div className="text-sm font-semibold text-[#202223]">No orders yet</div>
                                  <div className="text-xs text-[#6d7175]">When customers purchase, orders appear here.</div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {/* TAB: TEMPLATES */}
                 {activeTab === 'templates' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Theme Marketplace</h2>
                          <p className="text-sm text-[#6d7175]">Browse premium themes, install, or export yours.</p>
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-[#202223] border border-[#c9cccf] rounded-lg text-sm font-medium hover:bg-[#f9fafb] shadow-sm transition flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" /> Upload Custom Theme
                          <input type="file" accept=".json" ref={fileInputRef} onChange={handleThemeUpload} className="hidden" />
                        </button>
                      </div>

                      {themeUploadSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex gap-2">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Theme logic applied successfully!</span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Premium Theme Card */}
                         <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                           <div className="h-40 bg-gray-100 overflow-hidden relative">
                             <div className="absolute top-2 left-2 bg-[#202223] text-white text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM</div>
                             <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-4 flex flex-col items-start">
                             <div className="flex justify-between w-full items-center mb-1">
                               <h4 className="text-sm font-bold text-[#202223]">Bookly / MarketSupply</h4>
                               <span className="text-[#202223] font-bold text-sm">$49.00</span>
                             </div>
                             <p className="text-xs text-[#6d7175] mb-4">Clean, high-end e-commerce layouts.</p>
                             <button onClick={() => applyPresetTemplate('modern')} className="w-full py-2 bg-[#008060] text-white text-xs font-bold rounded-lg hover:bg-[#006e52] transition">
                               Install Active Theme
                             </button>
                           </div>
                         </div>

                         {/* Free Theme */}
                         <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                           <div className="h-40 bg-gray-100 overflow-hidden relative">
                             <div className="absolute top-2 left-2 bg-white border border-[#e1e3e5] text-[#202223] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">FREE</div>
                             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-4 flex flex-col items-start">
                             <div className="flex justify-between w-full items-center mb-1">
                               <h4 className="text-sm font-bold text-[#202223]">Minimalist Core</h4>
                               <span className="text-[#008060] font-bold text-sm">$0.00</span>
                             </div>
                             <p className="text-xs text-[#6d7175] mb-4">A fast, lightweight template framework.</p>
                             <button onClick={() => applyPresetTemplate('stealth')} className="w-full py-2 bg-white border border-[#c9cccf] text-[#202223] text-xs font-bold rounded-lg hover:bg-[#f9fafb] shadow-sm transition">
                               Install Theme
                             </button>
                           </div>
                         </div>

                         {/* Export Tool */}
                         <div className="bg-white border-2 border-dashed border-[#c9cccf] rounded-xl flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-10 h-10 bg-[#f4f6f8] rounded-full flex items-center justify-center mb-3">
                              <DownloadCloud className="w-5 h-5 text-[#6d7175]" />
                            </div>
                            <h4 className="text-sm font-bold text-[#202223] mb-1">Export Architecture</h4>
                            <p className="text-xs text-[#6d7175] mb-4">Download your current layout schema and configuration as JSON.</p>
                            <button onClick={downloadSchemaJson} className="px-4 py-2 bg-[#008060] text-white text-xs font-bold rounded-lg hover:bg-[#006e52] shadow-sm transition">
                              Export Schema
                            </button>
                         </div>
                      </div>
                    </div>
                 )}

                 {/* TAB: CODE */}
                 {activeTab === 'code' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Code Injection</h2>
                          <p className="text-sm text-[#6d7175]">Add custom scripts or override CSS directly.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                           <div className="p-3 bg-[#1e1e1e] flex items-center justify-between border-b border-[#333]">
                              <span className="text-xs font-mono text-gray-300">global.css</span>
                           </div>
                           <textarea value={cssCode} onChange={e => setCssCode(e.target.value)} onBlur={() => updateThemeField('customCSS', cssCode)} className="flex-1 w-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs focus:outline-none resize-none" spellCheck="false" />
                        </div>

                        <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                           <div className="p-3 bg-[#1e1e1e] flex items-center justify-between border-b border-[#333]">
                              <span className="text-xs font-mono text-yellow-300">app.js</span>
                           </div>
                           <textarea value={jsCode} onChange={e => setJsCode(e.target.value)} onBlur={() => updateThemeField('customJS', jsCode)} className="flex-1 w-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs focus:outline-none resize-none" spellCheck="false" />
                        </div>
                      </div>
                    </div>
                 )}

                 {/* TAB: DEPLOY */}
                 {activeTab === 'deploy' && (
                    <div className="space-y-6">
                      <StandaloneExporter />
                    </div>
                 )}

               </div>
             </div>

           )}
        </div>
      </div>
    </div>
  );
}
