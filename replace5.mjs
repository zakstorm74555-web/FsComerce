import fs from 'fs';
let content = fs.readFileSync('src/components/SaaSMainPlatform.tsx', 'utf-8');
content = content.replace(/checkoutType/g, 'gatewayType');
content = content.replace(/checkoutDestination/g, 'gatewayValue');
fs.writeFileSync('src/components/SaaSMainPlatform.tsx', content, 'utf-8');
console.log('Reverted gateway references');
