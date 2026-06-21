import fs from 'fs';

let content = fs.readFileSync('src/components/SaaSMainPlatform.tsx', 'utf-8');

// Replace cyber/hacker terms
content = content.replace(/cybermatic/gi, 'store');
content = content.replace(/Terminal Interface/gi, 'Modern Layout');
content = content.replace(/Cyberpunk Skyline/gi, 'Modern Skyline');
content = content.replace(/Scrambler Node/gi, 'Modern Gadget');
content = content.replace(/corporate email gateway connection/gi, 'admin email address');
content = content.replace(/routing nodes configured/gi, 'stores configured');
content = content.replace(/Register a new node below instead/gi, 'Register a new store below instead');
content = content.replace(/Industrial hardware core node/gi, 'Modern E-commerce store');
content = content.replace(/gatewayType/gi, 'checkoutType');
content = content.replace(/gatewayValue/gi, 'checkoutDestination');
content = content.replace(/P2P Terminal Core Chipset/gi, 'Premium Store Template');
content = content.replace(/Encrypted hardware hub/gi, 'Modern template');
content = content.replace(/CORTECTORATORIUM/gi, 'STOREFRONT');
content = content.replace(/Dynamic transaction nodes/gi, 'Dynamic storefront checkouts');
content = content.replace(/block node/gi, 'storefront');
content = content.replace(/Cryptographically routed network node/gi, 'Modern E-commerce store');
content = content.replace(/cyberpunk/gi, 'modern');
content = content.replace(/Cyber cyan/gi, 'Modern Blue');
content = content.replace(/cyber-card/gi, 'store-card');
content = content.replace(/Brutalist metallic borders/gi, 'Modern minimalist borders');
content = content.replace(/Matrix Green/gi, 'Forest Green');
content = content.replace(/binary-matrix/gi, 'fade-in');
content = content.replace(/Product node/gi, 'Product data');
content = content.replace(/Cyber accents/gi, 'Store accents');
content = content.replace(/netnode\.io/gi, 'store.com');
content = content.replace(/Direct Gateway/gi, 'Checkout Delivery');
content = content.replace(/Crypto P2P Wallet Address/gi, 'Bank Transfer');
content = content.replace(/Orbitron \(Cyber Heavy\)/gi, 'Orbitron (Display)');
content = content.replace(/Fira Code \(Brutalist Terminal\)/gi, 'Fira Code (Monospace)');
content = content.replace(/Modify Node/gi, 'Edit Product');
content = content.replace(/Eject Node/gi, 'Delete Product');
content = content.replace(/hardware components installed on node database/g, 'products available in store');
content = content.replace(/Retro Cyber Neon Accent/g, 'Modern Playful Accent');
content = content.replace(/Stealth Binary Green Matrix/g, 'Clean Minimalist Green');

fs.writeFileSync('src/components/SaaSMainPlatform.tsx', content, 'utf-8');
console.log('Fixed additional phrases in SaaSMainPlatform.tsx');
