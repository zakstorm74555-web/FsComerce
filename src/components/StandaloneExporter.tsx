/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Server, Play, ExternalLink } from 'lucide-react';

export default function StandaloneExporter() {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const files = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FSCommerce - Cybernetic E-Commerce Builder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=Orbitron:wght@400;900&family=Fira+Code:wght@300;500&display=swap">
  <style>
    body {
      background-color: #030408;
      color: #e2e8f0;
      font-family: 'Space Grotesk', sans-serif;
    }
    .neon-border {
      border: 1px solid #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
    }
  </style>
</head>
<body class="min-h-screen relative overflow-x-hidden">
  <!-- Dynamic Containers loaded by router.js -->
  <div id="saas-platform-container" class="hidden">
    <!-- Main SaaS Builder UI renders here -->
  </div>
  
  <div id="storefront-container" class="hidden">
    <!-- User Custom Storefront renders here -->
  </div>

  <div id="fallback-loader" class="fixed inset-0 bg-white flex flex-col justify-center items-center gap-4 z-50">
    <div class="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-xs font-sans text-green-600 tracking-widest uppercase">INITIALIZING ROUTER NET...</p>
  </div>

  <script type="module">
    import { initRouter } from './js/router.js';
    window.addEventListener('DOMContentLoaded', () => {
      initRouter();
    });
  </script>
</body>
</html>`,

    'js/router.js': `/**
 * FSCommerce - Dynamic Subdomain Router Module
 * Strict Mode Client-Side Routing for main domains vs wildcards
 */
'use strict';

export async function initRouter() {
  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  
  // Loader and Shell elements
  const loader = document.getElementById('fallback-loader');
  const saasShell = document.getElementById('saas-platform-container');
  const storeShell = document.getElementById('storefront-container');

  // Helper: Extract wildcard subdomain or simulation parameter
  let subdomain = null;
  
  // 1. Check if we are simulating in preview via ?store=some_subdomain
  if (urlParams.has('store')) {
    subdomain = urlParams.get('store');
  } else {
    // 2. Parse active hostname (e.g., zara.fscom.eu.org)
    const hostnameParts = hostname.split('.');
    
    // Check if we are matches *.fscom.eu.org
    if (hostnameParts.length >= 3 && !hostname.startsWith('fscomerce') && !hostname.startsWith('localhost')) {
      subdomain = hostnameParts[0];
    }
  }

  if (subdomain) {
    try {
      console.log(\`[Router] Custom Subdomain Node Detected: \${subdomain}\`);
      await renderStorefront(subdomain, storeShell);
      
      storeShell.classList.remove('hidden');
      if (saasShell) saasShell.classList.add('hidden');
    } catch (err) {
      console.error('[Router] Error initializing storefront module:', err);
      renderSubdomainError(subdomain, storeShell);
    }
  } else {
    // Default system landing page
    console.log('[Router] Main SaaS Platform Domain Detected: Routing to Builder Dashboard.');
    await renderSaaSPlatform(saasShell);
    
    if (saasShell) saasShell.classList.remove('hidden');
    storeShell.classList.add('hidden');
  }

  // Remove Loader once router is resolved
  if (loader) {
    loader.classList.add('hidden');
  }
}

async function renderStorefront(subdomain, element) {
  // Query storage configs
  const storageKey = 'fscom_store_' + subdomain;
  let config = localStorage.getItem(storageKey);
  
  if (!config) {
    // Return dummy or fetch via static JSON backup
    throw new Error(\`Config for store [\${subdomain}] not initialized.\`);
  }
  
  const store = JSON.parse(config);
  
  // Dynamic HTML compiler for theme
  let fontClass = 'font-sans';
  if (store.theme.typography === 'orbitron') fontClass = 'font-[Orbitron]';
  if (store.theme.typography === 'fira-code') fontClass = 'font-sans';

  element.innerHTML = \`
    <div class="min-h-screen text-gray-700 \${fontClass}" style="background-color: \${store.theme.primaryColor}">
      <style>\${store.theme.customCSS || ''}</style>
      <header class="p-6 border-b border-gray-200 flex justify-between items-center" style="background-color: \${store.theme.secondaryColor}">
        <h1 class="text-2xl font-bold tracking-wider" style="color: \${store.theme.accentColor}">\${store.name.toUpperCase()}</h1>
        <div class="text-sm font-sans text-gray-500">\${store.tagline}</div>
      </header>
      
      <main class="max-w-6xl mx-auto py-16 px-4">
        <h2 class="text-xl font-sans uppercase tracking-widest border-b border-gray-200 pb-4 mb-8">Active Modules</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          \${store.products.map(p => \`
            <div class="bg-white/40 border border-gray-200 p-6 rounded relative overflow-hidden group">
              <img src="\${p.imageUrl}" class="w-full aspect-video object-cover mb-4 rounded border border-gray-200" alt="\${p.name}">
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold text-gray-900">\${p.name}</span>
                <span style="color: \${store.theme.accentColor}" class="font-sans font-bold">\$\${p.price}</span>
              </div>
              <p class="text-sm text-gray-500 font-light mb-4">\${p.description}</p>
            </div>
          \`).join('')}
        </div>
      </main>
    </div>
  \`;

  // Inject user scripts
  if (store.theme.customJS) {
    try {
      const run = new Function('sub', store.theme.customJS);
      run(subdomain);
    } catch (e) {
      console.warn('[User Script Error]', e);
    }
  }
}

function renderSaaSPlatform(element) {
  element.innerHTML = \`
    <div class="max-w-6xl mx-auto py-24 px-4 text-center">
      <h1 class="text-5xl md:text-7xl font-sans font-black tracking-tight text-gray-900 mb-6">
        FS<span class="text-green-600">COMMERCE</span>
      </h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
        A metal-dark cybernetic SaaS client engine built to launch localized webstores across distributed networks.
      </p>
    </div>
  \`;
}

function renderSubdomainError(sub, element) {
  element.innerHTML = \`
    <div class="min-h-screen bg-white flex flex-col justify-center items-center font-sans p-4">
      <div class="border border-red-500 rounded bg-red-950/20 p-8 max-w-lg text-center">
        <h2 class="text-red-500 font-black text-xl mb-4">⚠️ SECTOR NOT MOUNTED</h2>
        <p class="text-sm text-gray-600 mb-6">
          Store terminal connection to node <span class="text-gray-900 font-bold">"\${sub}"</span> returned void. The database configurator has not compiled this sector.
        </p>
        <a href="/" class="px-4 py-2 bg-red-500 text-black text-xs font-bold uppercase transition hover:bg-red-400">
          RE-ROUTE MAIN GATE
        </a>
      </div>
    </div>
  \`;
}
`,
    'js/themeEngine.js': `/**
 * FSCommerce - Standard Theme Schema Parser & Validator
 * Validates theme blocks and maps components into interactive visual nodes.
 */
'use strict';

export const REQUIRED_THEME_BLOCKS = ['header', 'hero', 'product_grid', 'footer'];

export function parseThemeSchema(jsonString) {
  try {
    const rawSchema = JSON.parse(jsonString);
    
    // Safety assertions
    if (!rawSchema.blocks || !Array.isArray(rawSchema.blocks)) {
      throw new Error("Theme validation failed: Schema must include 'blocks' array.");
    }
    
    const blockTypes = rawSchema.blocks.map(b => b.type);
    const missing = REQUIRED_THEME_BLOCKS.filter(req => !blockTypes.includes(req));
    
    if (missing.length > 0) {
      console.warn(\`Theme Schema missing recommended blocks: \${missing.join(', ')}\`);
    }

    // Sanitize and return parsed blocks
    return rawSchema.blocks.map(block => ({
      id: block.id || 'block-' + Math.random().toString(36).substr(2, 9),
      type: block.type,
      settings: block.settings || {}
    }));
  } catch (err) {
    throw new Error(\`Failed to compile schema: \${err.message}\`);
  }
}

export function generateStandardTemplate() {
  return JSON.stringify({
    name: "Cybernetic Default Theme",
    blocks: [
      {
        id: "header",
        type: "header",
        settings: {
          heading: "SYS_CORP STOREFRONT",
          links: [
            { label: "AUGMENTS", href: "#products" }
          ]
        }
      },
      {
        id: "hero",
        type: "hero",
        settings: {
          heading: "OVERLOAD SYSTEM MATRIX",
          subheading: "Hardware adapters configured directly over high-speed links.",
          ctaText: "UPGRADE SYSTEMS NOW",
          bannerUrl: "https://images.unsplash.com/photo-1544256718-3bcf237f3974",
          showImage: true
        }
      },
      {
        id: "product_grid",
        type: "product_grid",
        settings: {
          heading: "COMPILERS AVAILABLE",
          gridCols: 3
        }
      },
      {
        id: "footer",
        type: "footer",
        settings: {
          footerText: "FSCOMMERCE INDUSTRIAL SYSTEMS - PRIVACY COMPLIANT LAYER"
        }
      }
    ]
  }, null, 2);
}`
  };

  const copyToClipboard = (filename: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const downloadFile = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename.split('/').pop() || filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-start gap-3">
        <Server className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-green-600 font-sans tracking-wide uppercase">GitHub Pages Standalone Deploy Code</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Need to host your compiled stores on <span className="text-gray-900 font-medium">GitHub Pages</span> or a separate server? 
            FSCommerce runs 100% on standard clients. Deploy by creating these matching folder structures onto your target workspace repo!
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(files).map(([filename, content]) => (
          <div key={filename} className="border border-gray-200 rounded bg-white overflow-hidden flex flex-col">
            <header className="bg-white px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-green-600" />
                <span className="font-sans text-xs text-gray-900 font-semibold">{filename}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(filename, content)}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-200 text-xs text-gray-600 font-sans flex items-center gap-1.5 transition"
                >
                  {copiedFile === filename ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" /> Copy Raw
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadFile(filename, content)}
                  className="px-2 py-1 bg-green-50 hover:bg-green-100 border border-green-300 text-green-600 rounded text-xs transition"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>
            <div className="p-3 overflow-x-auto max-h-60 bg-white font-sans text-xs text-gray-900 whitespace-pre">
              {content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded text-xs text-gray-500 leading-relaxed">
        <h5 className="font-bold text-gray-900 uppercase font-sans mb-2">📌 DEPLOYMENT STEPS:</h5>
        <ol className="list-decimal list-inside space-y-1 font-light font-sans text-xs">
          <li>Create a new public repository labeled <span className="text-green-600">"fscommerce"</span> on GitHub.</li>
          <li>Write the above <span className="text-gray-900 font-medium">index.html</span> and place the remaining Javascript tools in <span className="text-green-600">/js/</span>.</li>
          <li>Turn on GitHub Pages within Repository Settings to host from the <span className="text-gray-900 font-medium">/main</span> branch.</li>
          <li>Stores automatically load active elements instantly from LocalStorage or the connected Firebase cluster.</li>
        </ol>
      </div>
    </div>
  );
}

export function parseThemeSchema(jsonString: string) {
  try {
    const rawSchema = JSON.parse(jsonString);
    if (!rawSchema.blocks || !Array.isArray(rawSchema.blocks)) {
      throw new Error("Theme validation failed: Schema must include 'blocks' array.");
    }
    return rawSchema.blocks.map((block: any) => ({
      id: block.id || 'block-' + Math.random().toString(36).substr(2, 9),
      type: block.type,
      settings: block.settings || {}
    }));
  } catch (err: any) {
    throw new Error(`Failed to compile schema: ${err.message}`);
  }
}

export function generateStandardTemplate() {
  return JSON.stringify({
    name: "Cybernetic Default Theme",
    blocks: [
      {
        id: "header",
        type: "header",
        settings: {
          heading: "SYS_CORP STOREFRONT",
          links: [
            { label: "AUGMENTS", href: "#products" }
          ]
        }
      }
    ]
  });
}

