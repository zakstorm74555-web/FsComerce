/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreConfig } from './types';
import { DEFAULT_STORES } from './utils/defaultStores';
import SaaSMainPlatform from './components/SaaSMainPlatform';
import StorefrontRenderer from './components/StorefrontRenderer';
import LandingPage from './components/LandingPage';
import { 
  Network, Globe, ChevronRight, Laptop, Server, AppWindow, 
  Terminal, Shield, Settings, HelpCircle, ArrowRight, LogOut, ShoppingBag
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stores, setStores] = useState<Record<string, StoreConfig>>({});
  const [activeStoreId, setActiveStoreId] = useState<string>('mystore');
  
  // Simulation router settings
  const [activeRouteMode, setActiveRouteMode] = useState<'saas' | 'store'>('saas');
  const [simulatedStoreId, setSimulatedStoreId] = useState<string>('mystore');
  const [customHostnameInput, setCustomHostnameInput] = useState<string>('');
  
  // Real DNS parsing indicator log
  const [dnsLog, setDnsLog] = useState<string>('Platform environment initialized successfully.');

  // Initialize and persist configs matching localStorage rules
  useEffect(() => {
    const cachedAuth = localStorage.getItem('fscom_auth');
    if (cachedAuth) {
      const authData = JSON.parse(cachedAuth);
      if (authData.isAuthenticated) {
        setIsAuthenticated(true);
        setUserEmail(authData.email);
      }
    }

    const unsubscribe = onSnapshot(collection(db, 'stores'), (snapshot) => {
      const loadedStores: Record<string, StoreConfig> = {};
      snapshot.forEach((doc) => {
        loadedStores[doc.id] = doc.data() as StoreConfig;
      });

      if (Object.keys(loadedStores).length > 0) {
        setStores(loadedStores);
        const keys = Object.keys(loadedStores);
        // Verify active store exists
        if (!keys.includes(activeStoreId)) {
          setActiveStoreId(keys[0]);
        }
      } else {
        // Setup default stores
        setStores(DEFAULT_STORES);
        Object.values(DEFAULT_STORES).forEach(storeConfig => {
          setDoc(doc(db, 'stores', storeConfig.id), storeConfig);
        });
      }
    });

    return () => unsubscribe();
  }, [activeStoreId]); // Pass dependencies

  useEffect(() => {
    // Parse true active window.location.hostname on load
    const host = window.location.hostname;
    const parts = host.split('.');
    
    if (parts.length >= 3 && !host.startsWith('fscomerce') && !host.startsWith('localhost') && !host.includes('run.app')) {
      const parsedSub = parts[0];
      setDnsLog(`[DNS] True Subdomain Resolved from URL: "${parsedSub}". Routing directly.`);
      setActiveRouteMode('store');
      setSimulatedStoreId(parsedSub);
    }
  }, []);

  const handleUpdateStore = (id: string, updatedConfig: StoreConfig) => {
    setDoc(doc(db, 'stores', id), updatedConfig);
    setStores((prev) => {
      const next = {
        ...prev,
        [id]: updatedConfig
      };
      return next;
    });
    setDnsLog(`[DB] Config node updated for "/${id}" at ${new Date().toLocaleTimeString()}`);
  };

  // Simulated host routing resolver
  const resolveSubdomainRouter = (hostnameString: string) => {
    const trimmed = hostnameString.trim().toLowerCase();
    
    if (!trimmed) {
      setDnsLog('[ERROR] Hostname input cannot be empty');
      return;
    }

    setDnsLog(`[DNS Lookup] Parsing virtual host path: "${trimmed}"`);

    // Pattern matching routing rules
    if (trimmed === 'fscomerce.eu.org' || trimmed === 'localhost' || trimmed === 'fscommerce') {
      setActiveRouteMode('saas');
      setDnsLog('[DNS Resolved] Direct route to Main SaaS Dashboard (fscomerce.eu.org)');
      return;
    }

    // Check wildcard match zara.fscom.eu.org or simple name zara
    let foundSub = trimmed;
    if (trimmed.endsWith('.fscom.eu.org')) {
      foundSub = trimmed.replace('.fscom.eu.org', '');
    }

    if (stores[foundSub]) {
      setSimulatedStoreId(foundSub);
      setActiveRouteMode('store');
      setDnsLog(`[DNS Resolved] Wildcard Map Subdomain "*": resolved "${foundSub}" storefront successfully.`);
    } else {
      setDnsLog(`[DNS ERROR] Resolved void target. Store "${foundSub}" does not exist in localized databases.`);
      // Spawn new basic store if requested or show visual error
    }
  };

  const handleCreateNewSubdomain = () => {
    const sub = prompt("Enter new store subdomain prefix (e.g. 'zara', 'cypher'):");
    if (!sub) return;
    const cleanSub = sub.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase();
    
    if (stores[cleanSub]) {
      alert("Subdomain prefix already registered in routing nodes!");
      return;
    }

    const newStore: StoreConfig = {
      id: cleanSub,
      subdomain: cleanSub,
      name: `${cleanSub.toUpperCase()} Tech Store`,
      tagline: "Custom-made client storefront node.",
      currency: 'USD',
      gatewayType: 'whatsapp',
      gatewayValue: '+14159821374',
      theme: {
        typography: 'space-grotesk',
        primaryColor: '#0a0d16',
        secondaryColor: '#121824',
        accentColor: '#39ff14', // Matrix green
        navStyle: 'glassmorphism',
        layoutStructure: 'grid',
        customCSS: `/* Custom overlays for ${cleanSub} */`,
        customJS: `console.log('Component initialized for ${cleanSub}');`
      },
      products: [
        {
          id: cleanSub + '-1',
          name: 'Core System Modulator v1',
          price: 150,
          description: 'Standard multi-node signal relay adapter designed for local grid controllers.',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60'
        }
      ],
      layoutBlocks: [
        {
          id: 'block-header',
          type: 'header',
          settings: { heading: `${cleanSub.toUpperCase()} Node`, links: [{ label: "HOME", href: "#products" }] }
        },
        {
          id: 'block-hero',
          type: 'hero',
          settings: { heading: `WELCOME TO SITE://${cleanSub.toUpperCase()}`, subheading: "Assembled dynamically based on SaaS layout blocks.", ctaText: "INSPECT DEV", showImage: false }
        },
        {
          id: 'block-grid',
          type: 'product_grid',
          settings: { heading: "Active Units Catalog", gridCols: 3 }
        },
        {
          id: 'block-footer',
          type: 'footer',
          settings: { footerText: `© 2026. Custom store node segment ${cleanSub}. Generated by FSCommerce.` }
        }
      ],
      orders: [],
      updatedAt: new Date().toISOString()
    };

    const nextStores = {
      ...stores,
      [cleanSub]: newStore
    };
    
    setDoc(doc(db, 'stores', cleanSub), newStore);
    setStores(nextStores);
    setActiveStoreId(cleanSub);
    setDnsLog(`Successfully created new store: "${cleanSub}"`);
  };

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('fscom_auth', JSON.stringify({ isAuthenticated: true, email }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('fscom_auth');
  };

  // If not authenticated and we are in SAAS mode, show the landing page.
  // We still let wildcard access view stores publicly.
  if (!isAuthenticated && activeRouteMode === 'saas') {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-slate-900 selection:bg-green-100 selection:text-green-900">
      
      {/* Platform Controller Bar */}
      <nav id="platform-router-emulator-bar" className="bg-white border-b border-gray-200 p-3 px-4 flex flex-col md:flex-row items-center justify-between gap-4 z-50 shadow-sm">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FSCommerce" className="w-8 h-8 rounded" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <ShoppingBag className="w-6 h-6 text-green-600" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-gray-900">FSCommerce</span>
            </div>
            
            <p className="text-3xs text-gray-500 mt-0.5 whitespace-nowrap">
              {userEmail ? <span className="font-medium text-gray-700">{userEmail}</span> : 'Not signed in'}
            </p>
          </div>
        </div>

        {/* Environment Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveRouteMode('saas');
              setDnsLog('Switched back to Admin Panel.');
            }}
            className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeRouteMode === 'saas'
                ? 'bg-green-600 text-white shadow shadow-green-600/20'
                : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Admin Panel
          </button>

          <div className="text-gray-300 hidden md:inline">/</div>

          <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200 gap-0.5">
            {Object.keys(stores).map((storeId) => (
              <button
                key={storeId}
                onClick={() => {
                  setSimulatedStoreId(storeId);
                  setActiveRouteMode('store');
                  setDnsLog(`Accessing virtual storefront: "${storeId}"`);
                }}
                className={`cursor-pointer px-3 py-1.5 text-xs rounded transition flex items-center gap-1.5 ${
                  activeRouteMode === 'store' && simulatedStoreId === storeId
                    ? 'bg-white text-gray-900 font-semibold shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <AppWindow className="w-3.5 h-3.5" /> {storeId}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateNewSubdomain}
            className="cursor-pointer px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-green-700 text-xs font-semibold transition"
            title="Create New Store"
          >
            + Add Store
          </button>
        </div>

        {/* User / Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-gray-700 text-xs font-semibold transition flex items-center gap-1.5"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>

      </nav>

      {/* DNS LIVE RESOLUTION RUNNER BAR */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 text-xs text-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400 select-none">Status Log:</span>
          <span className="text-gray-700 select-all truncate font-mono text-xs">{dnsLog}</span>
        </div>
      </div>

      {/* CORE FRAME CONTAINER ROUTER SHELL */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-start">
        {Object.keys(stores).length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Initializing Platform Workspace...</p>
          </div>
        ) : activeRouteMode === 'saas' ? (
          /* SaaS Platform: Visual Editor + CRUD Panels */
          <div className="flex flex-col gap-6 w-full h-full max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                  Store Management: {stores[activeStoreId]?.name || activeStoreId}
                </h1>
                <p className="text-sm text-gray-500 font-normal mt-1">
                  Manage your products, themes, and orders from your centralized merchant dashboard.
                </p>
              </div>
            </header>

            {/* Core Editors Dashboard */}
            <SaaSMainPlatform
              initialStores={stores}
              activeStoreId={activeStoreId}
              onStoreUpdate={handleUpdateStore}
              onActiveStoreChange={(id) => {
                setActiveStoreId(id);
                setDnsLog(`[DB Node Select] Focus shifted to database sector configs for: "/${id}"`);
              }}
            />
          </div>
        ) : (
          /* Subdomain Storefront branch Simulator: renders the custom store fully standalone as requested */
          <div className="flex flex-col gap-4 w-full h-full animate-fade-in">
            {/* Storefront simulation status alert banner */}
            <div className="p-3 bg-cyan-950/25 border border-cyan-800/40 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white font-mono uppercase">
                    Wildcard Subdomain Simulation Active
                  </div>
                  <p className="text-xxs text-gray-450 font-mono">
                    Currently surfing: <span className="text-cyan-400 font-bold select-all">https://{simulatedStoreId}.fscom.eu.org</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveRouteMode('saas');
                  setDnsLog('[Sim Router] Returned to main platform builder.');
                }}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xxs font-mono uppercase font-bold rounded transition active:scale-95 cursor-pointer"
              >
                Back to SaaS Dashboard Workspace
              </button>
            </div>

            {/* Standalone client storefront simulator layer */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xl bg-white">
              <StorefrontRenderer config={stores[simulatedStoreId]} onOrderPlaced={(order) => {
                const store = stores[simulatedStoreId];
                if(store) {
                  const updatedStore = {
                    ...store,
                    orders: [order, ...(store.orders || [])]
                  };
                  handleUpdateStore(simulatedStoreId, updatedStore);
                }
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
