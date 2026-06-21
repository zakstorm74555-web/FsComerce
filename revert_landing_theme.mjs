import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Button color consistency
content = content.replace(/text-black bg-green-500 hover:bg-green-700/g, 'text-white bg-green-600 hover:bg-green-700');
content = content.replace(/text-white bg-green-600 hover:bg-green-700/g, 'text-white bg-green-600 hover:bg-green-700'); // Just in case
content = content.replace(/text-black bg-green-500 hover:bg-green-400/g, 'text-white bg-green-600 hover:bg-green-700');
content = content.replace(/text-black bg-green-500/g, 'text-white bg-green-600');

// Placeholder colors
content = content.replace(/placeholder-gray-600/g, 'placeholder-gray-400');

// Hover colors for text
content = content.replace(/hover:text-green-300/g, 'hover:text-green-800');

// Additional button fixes
content = content.replace(/text-white bg-green-600 rounded hover:bg-green-700 rounded/g, 'text-white bg-green-600 rounded hover:bg-green-700');

fs.writeFileSync('src/components/LandingPage.tsx', content, 'utf-8');
console.log('Fixed final theme bits in landing');
