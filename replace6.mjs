import fs from 'fs';

let utils = fs.readFileSync('src/utils/defaultStores.ts', 'utf-8');
utils = utils.replace(/Shopify-like Green/gi, 'E-commerce Green');
fs.writeFileSync('src/utils/defaultStores.ts', utils, 'utf-8');

let exporter = fs.readFileSync('src/components/StandaloneExporter.tsx', 'utf-8');
exporter = exporter.replace(/Shopify Theme/g, 'Standard Theme');
exporter = exporter.replace(/parseShopifySchema/g, 'parseThemeSchema');
exporter = exporter.replace(/generateShopifyTemplate/g, 'generateStandardTemplate');
fs.writeFileSync('src/components/StandaloneExporter.tsx', exporter, 'utf-8');

let saas = fs.readFileSync('src/components/SaaSMainPlatform.tsx', 'utf-8');
saas = saas.replace(/Shopify theme schema/gi, 'Standard theme schema');
saas = saas.replace(/Shopify Theme Schema/gi, 'Standard Theme Schema');
saas = saas.replace(/Shopify-styled/gi, 'Standard-styled');
saas = saas.replace(/Shopify Blocks/gi, 'Standard Theme Blocks');
fs.writeFileSync('src/components/SaaSMainPlatform.tsx', saas, 'utf-8');

console.log('Removed Shopify references');
