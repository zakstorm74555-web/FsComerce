import fs from 'fs';

const filepath = 'src/components/StorefrontRenderer.tsx';
const lines = fs.readFileSync(filepath, 'utf8').split('\n');

const returnLineIndex = lines.findIndex(l => l.startsWith('  return (') || l.startsWith('  return('));

if (returnLineIndex === -1) {
  console.log('Return statement not found');
  process.exit(1);
}

const beforeReturn = lines.slice(0, returnLineIndex).join('\n');
const newJSX = fs.readFileSync('storefront_template.tsx', 'utf8');

fs.writeFileSync(filepath, beforeReturn + '\n' + newJSX, 'utf8');
console.log('Successfully re-architected Storefront UI to Premium eCommerce Layout');
