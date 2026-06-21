import fs from 'fs';
let content = fs.readFileSync('src/components/SaaSMainPlatform.tsx', 'utf-8');

content = content.replace(
  '<option value="credit_simulator">💳 Sandbox Core Credit Card</option>',
  '<option value="credit_simulator">💳 Direct Credit Card (Stripe Simulator)</option>'
);
content = content.replace(
  '<option value="p2p_wallet">🔗 Bank Transfer</option>',
  '<option value="p2p_wallet">🔗 Direct Bank Transfer</option>'
);

fs.writeFileSync('src/components/SaaSMainPlatform.tsx', content, 'utf-8');
console.log('Gateways updated in SaaSMainPlatform.');
