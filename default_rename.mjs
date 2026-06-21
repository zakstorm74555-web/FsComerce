import fs from 'fs';
let content = fs.readFileSync('src/utils/defaultStores.ts', 'utf-8');

content = content.replace("gatewayType: 'whatsapp'", "gatewayType: 'credit_simulator'");

fs.writeFileSync('src/utils/defaultStores.ts', content, 'utf-8');
console.log('Defaults updated');
