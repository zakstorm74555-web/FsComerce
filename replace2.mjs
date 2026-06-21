import fs from 'fs';

let content = fs.readFileSync('src/components/StorefrontRenderer.tsx', 'utf-8');

// Colors & styles
content = content.replace(/bg-slate-950/g, 'bg-white');
content = content.replace(/bg-slate-900/g, 'bg-gray-50');
content = content.replace(/bg-slate-800/g, 'bg-gray-200');
content = content.replace(/border-slate-800/g, 'border-gray-200');
content = content.replace(/border-slate-850/g, 'border-gray-200');
content = content.replace(/border-slate-900/g, 'border-gray-200');
content = content.replace(/text-slate-200/g, 'text-gray-700');
content = content.replace(/text-white/g, 'text-gray-900');
content = content.replace(/text-gray-200/g, 'text-gray-700');
content = content.replace(/text-gray-300/g, 'text-gray-600');
content = content.replace(/text-gray-400/g, 'text-gray-500');
content = content.replace(/font-mono/g, 'font-sans');
content = content.replace(/text-cyan-400/g, 'text-green-600');
content = content.replace(/text-cyan-500/g, 'text-green-600');
content = content.replace(/bg-cyan-500/g, 'bg-green-600');
content = content.replace(/bg-cyan-600/g, 'bg-green-600');
content = content.replace(/bg-cyan-950/g, 'bg-green-50');
content = content.replace(/border-cyan-500/g, 'border-green-600');
content = content.replace(/text-cyan-300/g, 'text-gray-900');
content = content.replace(/bg-cyan-400\/20/g, 'bg-green-600\/20');
content = content.replace(/bg-cyan-400\/10/g, 'bg-green-600\/10');
content = content.replace(/border-cyan-400\/50/g, 'border-green-600\/50');
content = content.replace(/bg-black\/80/g, 'bg-white\/90');
content = content.replace(/bg-black\/40/g, 'bg-white\/50');
content = content.replace(/bg-black/g, 'bg-white');

// Wording
content = content.replace(/Cart Terminal/g, 'Shopping Cart');
content = content.replace(/Compile Order/g, 'Checkout');
content = content.replace(/Checkout Terminal/g, 'Checkout');
content = content.replace(/Transmit via Secure WhatsApp/g, 'Complete via WhatsApp');
content = content.replace(/Initialize Crypto Transfer/g, 'Pay with Crypto');
content = content.replace(/Submit Corporate Email/g, 'Send via Email');
content = content.replace(/Simulate Sandbox Credit/g, 'Checkout with Card Simulator');

fs.writeFileSync('src/components/StorefrontRenderer.tsx', content, 'utf-8');

console.log('Storefront Replacements completed.');
