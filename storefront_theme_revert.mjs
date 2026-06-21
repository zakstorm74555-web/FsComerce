import fs from 'fs';
let content = fs.readFileSync('src/components/StorefrontRenderer.tsx', 'utf-8');

// Undo the storefront update text changes
content = content.replace(/ASSEMBLED COMPONENTS INVENTORY/gi, 'OUR PRODUCTS');
content = content.replace(/CLUSTER NODES: \{products\.length\} DEVICES REGISTERED/gi, 'Showing {products.length} Products');
content = content.replace(/No hardware cores assembled on this node database\./gi, 'No products available in this store currently.');
content = content.replace(/RESERVOIR:/gi, 'STOCK:');
content = content.replace(/Assemble Unit/gi, 'Add to Cart');
content = content.replace(/SECURE GATEWAY TRANSMISSION ROUTING HOSTED BY FSCOMMERCE GROUP\./gi, 'All Rights Reserved. Powered by FSCommerce.');

// Undo the dark classes for products
content = content.replace(/className="cyber-card flex flex-col h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden group hover:border-gray-700 transition-all shadow-xl font-sans"/g, 
  'className="store-card flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-green-300 transition-all shadow-sm font-sans"');

// Image Frame
content = content.replace(/bg-gray-900 border-b border-gray-800 shrink-0/g, 'bg-gray-50 border-b border-gray-100 shrink-0');
content = content.replace(/bg-gradient-to-t from-gray-950 to-transparent/g, 'bg-gradient-to-t from-black\/40 to-transparent');
content = content.replace(/bg-gray-950\/80 rounded-full border border-gray-800/g, 'bg-white\/90 rounded-full border border-gray-200');

// Footer
content = content.replace(/border-t border-gray-900 px-4 py-12/g, 'border-t border-gray-200 px-4 py-12 bg-white');

// Tracker bar
content = content.replace(/FSCOMMERCE SECURED LINK CHANNEL:\/\//g, 'Secure Store Link: ');
content = content.replace(/🗲 OFFLINE-FIRST CACHE CORE: ACTIVE/g, 'Status: Online');
content = content.replace(/bg-cyan-400 rounded-full animate-ping/g, 'bg-green-500 rounded-full animate-pulse');

// Cart Modal Overlay
content = content.replace(/bg-white\/90 flex justify-end backdrop-blur-sm/g, 'bg-black\/50 flex justify-end backdrop-blur-sm');
content = content.replace(/bg-gray-950 h-full border-l border-gray-800/g, 'bg-white h-full border-l border-gray-200');
content = content.replace(/border-b border-gray-900 pb-4 mb-4/g, 'border-b border-gray-200 pb-4 mb-4');

content = content.replace(/Active Device Storage Bay/g, 'Your Shopping Cart');
content = content.replace(/bg-gray-900 hover:text-gray-900 border border-gray-800/g, 'bg-gray-100 hover:bg-gray-200 border border-gray-200');

content = content.replace(/No hardware modules detected in active memory channels\. Select device options and mount components\./g, 'Your cart is empty. Add some products to view them here.');

// Remove cyber product text in cart
content = content.replace(/CORE MODULE SKU:/g, 'SKU:');

// Let's also do a blanket sweep if there are other `bg-gray-950` hiding in this file
content = content.replace(/bg-gray-950/g, 'bg-white');
content = content.replace(/border-gray-800/g, 'border-gray-200');

fs.writeFileSync('src/components/StorefrontRenderer.tsx', content, 'utf-8');
console.log('Storefront theme reverted to clean style.');
