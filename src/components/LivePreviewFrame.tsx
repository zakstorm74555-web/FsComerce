/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreConfig, StoreOrder } from '../types';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, HelpCircle, Lock } from 'lucide-react';
import StorefrontRenderer from './StorefrontRenderer';

interface LivePreviewFrameProps {
  config: StoreConfig;
  onStoreUpdate?: (updatedConfig: StoreConfig) => void;
}

type ViewportType = 'desktop' | 'tablet' | 'mobile';

export default function LivePreviewFrame({ config, onStoreUpdate }: LivePreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [reloadKey, setReloadKey] = useState(0);

  const handleOrderPlaced = (newOrder: StoreOrder) => {
    if (!onStoreUpdate) return;
    const currentOrders = config.orders || [];
    const updatedConfig: StoreConfig = {
      ...config,
      orders: [newOrder, ...currentOrders],
      updatedAt: new Date().toISOString()
    };
    onStoreUpdate(updatedConfig);
  };

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl rounded-2xl border-8 border-gray-900';
      case 'tablet':
        return 'w-[768px] h-[1024px] shadow-xl rounded-xl border-4 border-gray-900';
      default:
        return 'w-full h-full';
    }
  };

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Compile full raw HTML block for standard srcdoc fallback options or simulation logs
  const getSimulatedUrl = () => {
    return `https://${config.subdomain}.fscom.eu.org/`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
      {/* Viewport Control Bar */}
      <header className="bg-gray-900 p-3 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between text-gray-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black rounded border border-gray-800/80">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 select-all truncate max-w-44 md:max-w-xs">
              {getSimulatedUrl()}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1 px-2 border border-gray-800 hover:text-white rounded hover:bg-gray-800 transition"
            title="Refresh Sandbox Server"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Switches */}
        <div className="flex items-center gap-1 bg-black p-1 rounded border border-gray-850">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded text-xs px-2.5 font-mono flex items-center gap-1 transition ${
              viewport === 'desktop' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded text-xs px-2.5 font-mono flex items-center gap-1 transition ${
              viewport === 'tablet' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded text-xs px-2.5 font-mono flex items-center gap-1 transition ${
              viewport === 'mobile' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xxs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          SANDBOXED COMPILER ACTIVE
        </div>
      </header>

      {/* Render Canvas Frame Area */}
      <div className="flex-1 overflow-auto bg-gray-900/40 p-4 flex justify-center items-start">
        <div 
          key={reloadKey}
          className={`transition-all duration-300 overflow-y-auto overflow-x-hidden ${getViewportWidthClass()}`}
        >
          {/* We render the high-fidelity StorefrontRenderer inside the virtual viewport frame */}
          <StorefrontRenderer config={config} isPreview={true} onOrderPlaced={handleOrderPlaced} />
        </div>
      </div>
    </div>
  );
}
