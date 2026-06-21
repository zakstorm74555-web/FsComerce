import fs from 'fs';

let content = fs.readFileSync('src/components/SaaSMainPlatform.tsx', 'utf-8');

// Change tab name
content = content.replace(
  /{ id: 'templates', label: 'Themes', icon: FileJson },/g,
  `{ id: 'templates', label: 'Theme Marketplace', icon: FileJson },`
);

// Replace templates tab content
const oldTemplatesTabRegex = /{activeTab === 'templates' && \([\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*\)}/;

const newTemplatesTab = `{activeTab === 'templates' && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Theme Marketplace</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse premium themes, community designs, or upload your own to sell.
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload Theme
                  <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleThemeUpload}
                    className="hidden"
                  />
                </button>
              </div>

              {themeUploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{themeUploadError}</span>
                </div>
              )}

              {themeUploadSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm flex gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Theme layout applied successfully!</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* Theme 1 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:border-gray-300 hover:shadow-sm transition bg-white">
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-white text-gray-900 text-xs font-bold px-2 py-0.5 rounded shadow">FREE</div>
                    <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="Lumina Minimal" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-gray-900">Lumina Minimal</h4>
                      <span className="text-green-600 font-bold text-sm">$0.00</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-1">Clean, high-contrast theme optimized for fashion and apparel.</p>
                    <button onClick={() => applyPresetTemplate('stealth')} className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 transition">
                      Install Theme
                    </button>
                  </div>
                </div>

                {/* Theme 2 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:border-gray-300 hover:shadow-sm transition bg-white">
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded shadow">PREMIUM</div>
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="CyberGrid Terminal" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-gray-900">CyberGrid Terminal</h4>
                      <span className="text-gray-900 font-bold text-sm">$49.00</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-1">Aggressive, dark-mode terminal aesthetics for tech vendors.</p>
                    <button onClick={() => applyPresetTemplate('modern')} className="w-full py-2 bg-green-600 text-white border border-green-600 text-xs font-semibold rounded hover:bg-green-700 transition">
                      Buy Theme
                    </button>
                  </div>
                </div>

                {/* Theme 3 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:border-gray-300 hover:shadow-sm transition bg-white">
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow">COMMUNITY</div>
                    <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="Velvet Boutique" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-gray-900">Velvet Boutique</h4>
                      <span className="text-gray-900 font-bold text-sm">$19.00</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-1">Elegant typography and smooth scroll effects.</p>
                     <button onClick={() => applyPresetTemplate('industrial')} className="w-full py-2 bg-green-600 text-white border border-green-600 text-xs font-semibold rounded hover:bg-green-700 transition">
                      Buy Theme
                    </button>
                  </div>
                </div>
                
                 {/* Sell Your Theme Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Code2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Sell Your Theme</h4>
                  <p className="text-xs text-gray-500 mb-4">Are you a developer? Upload your custom JSON theme schema and earn revenue.</p>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition">
                    Upload & Publish
                  </button>
                </div>
              </div>

               <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Want to export your current design to edit or sell?</p>
                  <button
                    onClick={downloadSchemaJson}
                    className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium rounded transition cursor-pointer"
                  >
                    Export Current Theme JSON Schema
                  </button>
              </div>
            </div>
          )}`;

content = content.replace(oldTemplatesTabRegex, newTemplatesTab);

fs.writeFileSync('src/components/SaaSMainPlatform.tsx', content, 'utf-8');
console.log('Templates tab updated to Theme Marketplace');
