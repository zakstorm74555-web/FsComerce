import fs from 'fs';

let content = fs.readFileSync('src/components/StandaloneExporter.tsx', 'utf-8');

// Colors & styles
content = content.replace(/bg-slate-950/g, 'bg-white');
content = content.replace(/bg-slate-900/g, 'bg-gray-50');
content = content.replace(/bg-slate-800/g, 'bg-gray-200');
content = content.replace(/bg-gray-950/g, 'bg-white');
content = content.replace(/bg-gray-900\/60/g, 'bg-white');
content = content.replace(/bg-gray-900/g, 'bg-gray-50');
content = content.replace(/bg-gray-800/g, 'bg-gray-200');
content = content.replace(/border-slate-800/g, 'border-gray-200');
content = content.replace(/border-gray-800/g, 'border-gray-200');
content = content.replace(/border-cyan-950\/50/g, 'border-gray-200');
content = content.replace(/border-cyan-800\/40/g, 'border-green-300');
content = content.replace(/text-slate-200/g, 'text-gray-700');
content = content.replace(/text-white/g, 'text-gray-900');
content = content.replace(/text-gray-200/g, 'text-gray-700');
content = content.replace(/text-gray-300/g, 'text-gray-600');
content = content.replace(/text-gray-400/g, 'text-gray-500');
content = content.replace(/font-mono/g, 'font-sans');
content = content.replace(/text-cyan-400/g, 'text-green-600');
content = content.replace(/text-cyan-200\/90/g, 'text-gray-900');
content = content.replace(/text-cyan-500/g, 'text-green-600');
content = content.replace(/bg-cyan-500/g, 'bg-green-600');
content = content.replace(/bg-cyan-600/g, 'bg-green-600');
content = content.replace(/bg-cyan-950\/30/g, 'bg-green-50');
content = content.replace(/hover:bg-cyan-900\/40/g, 'hover:bg-green-100');
content = content.replace(/bg-cyan-950/g, 'bg-green-50');
content = content.replace(/border-cyan-500/g, 'border-green-600');
content = content.replace(/text-cyan-300/g, 'text-gray-900');
content = content.replace(/bg-black\/60/g, 'bg-white');
content = content.replace(/bg-black/g, 'bg-white');
content = content.replace(/text-green-400/g, 'text-green-600');


// Script tags HTML text string cleanup
content = content.replace(/text-cyan-400/g, 'text-green-600');
content = content.replace(/text-cyan-500/g, 'text-green-600');
content = content.replace(/border-cyan-500/g, 'border-green-600');
content = content.replace(/bg-black\/40/g, 'bg-white');

fs.writeFileSync('src/components/StandaloneExporter.tsx', content, 'utf-8');

console.log('Exporter Replacements completed.');
