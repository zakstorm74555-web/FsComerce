import fs from 'fs';

const filepath = 'src/components/SaaSMainPlatform.tsx';
const lines = fs.readFileSync(filepath, 'utf8').split('\n');

const returnLineIndex = lines.findIndex(l => l.startsWith('  return (') || l.startsWith('  return('));

if (returnLineIndex === -1) {
  console.log('Return statement not found');
  process.exit(1);
}

const beforeReturn = lines.slice(0, returnLineIndex).join('\n');

const newJSX = `
  return (
    <div className="flex w-full h-[calc(100vh-64px)] max-h-[1200px] bg-[#f4f6f8] text-[#202223] font-sans antialiased border border-t-0 border-[#e1e3e5] shadow-inner overflow-hidden">
      
      {/* SHOPIFY-STYLE SIDEBAR */}
      <div className="w-16 md:w-[240px] bg-[#ebebeb] flex flex-col shrink-0 border-r border-[#e1e3e5] h-full overflow-hidden transition-all">
        
        {/* Store Navigator Header */}
        <div className="p-4 border-b border-[#e1e3e5] flex items-center justify-between bg-[#e1e3e5]/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 bg-[#202223] rounded flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:flex flex-col truncate">
              <span className="text-sm font-semibold truncate leading-tight">{store.name || 'Store'}</span>
              <span className="text-xs text-[#6d7175] truncate">/ {activeStoreId}.fscom</span>
            </div>
          </div>
          <button onClick={handleLogout} className="hidden md:flex text-xs text-[#6d7175] hover:text-[#202223] transition" title="Log Out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin">
          <div className="hidden md:block px-2 text-[11px] font-semibold text-[#6d7175] uppercase tracking-wider mb-2 mt-2">Sales Channels</div>
          
          {[
            { id: 'visual', label: 'Online Store', icon: Monitor },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: Inbox },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={\`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition \${
                  isSelected ? 'bg-white text-[#202223] shadow-sm' : 'text-[#6d7175] hover:bg-[#e1e3e5]/50 hover:text-[#202223]'
                }\`}
              >
                <Icon className={\`w-4 h-4 shrink-0 \${isSelected ? 'text-[#008060]' : 'text-[#6d7175]'}\`} />
                <span className="hidden md:inline-block">{tab.label}</span>
              </button>
            )
          })}

           <div className="hidden md:block px-2 text-[11px] font-semibold text-[#6d7175] uppercase tracking-wider mb-2 mt-6">Settings & Scale</div>
           {[
            { id: 'templates', label: 'Theme Market', icon: LayoutGrid },
            { id: 'code', label: 'Code Edit', icon: Code2 },
            { id: 'deploy', label: 'Export', icon: DownloadCloud }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={\`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition \${
                  isSelected ? 'bg-white text-[#202223] shadow-sm' : 'text-[#6d7175] hover:bg-[#e1e3e5]/50 hover:text-[#202223]'
                }\`}
              >
                <Icon className={\`w-4 h-4 shrink-0 \${isSelected ? 'text-[#008060]' : 'text-[#6d7175]'}\`} />
                <span className="hidden md:inline-block">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Small Bottom Profile */}
        <div className="p-4 border-t border-[#e1e3e5] flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser?.username.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col truncate">
             <span className="text-xs font-semibold">{currentUser?.username}</span>
             <span className="text-[10px] text-[#6d7175]">Admin</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f8] relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#e1e3e5] px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
           <h1 className="text-lg font-semibold tracking-tight text-[#202223] capitalize">
             {activeTab === 'visual' ? 'Store Editor' : activeTab === 'templates' ? 'Theme Marketplace' : activeTab}
           </h1>
           {activeTab === 'visual' && (
             <div className="flex items-center gap-2 text-xs">
               <span className="flex items-center gap-1.5 px-2 py-1 bg-[#e4f8ec] text-[#008060] border border-[#aae4c7] rounded-md font-medium">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-pulse"></div>
                 Live View
               </span>
             </div>
           )}
        </header>

        {/* Dynamic Context Render */}
        <div className="flex-1 overflow-hidden relative">

           {/* IF ONLINE STORE (VISUAL EDITOR), RENDER SPLIT MODE */}
           {activeTab === 'visual' ? (
             <div className="flex w-full h-full">
               
               {/* Configurator Left Panel */}
               <div className="w-[320px] bg-white border-r border-[#e1e3e5] flex flex-col h-full shrink-0 z-0">
                  <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                    
                    {/* Basic Meta */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Identity</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Company Workspace Name</label>
                          <input
                            type="text"
                            value={store.name}
                            onChange={(e) => updateStoreField('name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Tagline</label>
                          <input
                            type="text"
                            value={store.customization.tagline}
                            onChange={(e) => updateCustomField('tagline', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                    {/* Layouts */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Layout Preset</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['modern', 'classic', 'stealth', 'industrial'].map(preset => (
                          <button
                            key={preset}
                            onClick={() => applyPresetTemplate(preset as any)}
                            className={\`py-2 px-3 text-xs font-medium rounded-lg border capitalize transition shadow-sm \${
                              store.theme.layoutId === preset 
                              ? 'bg-[#f4f6f8] border-[#202223] text-[#202223]' 
                              : 'bg-white border-[#c9cccf] text-[#6d7175] hover:border-[#8c9196]'
                            }\`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                    {/* Aesthetics */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Color Engine</h3>
                      <div className="space-y-3">
                        {['primaryColor', 'accentColor', 'textColor', 'backgroundColor'].map(colorKey => (
                          <div key={colorKey} className="flex items-center justify-between bg-white border border-[#c9cccf] p-2 rounded-lg shadow-sm">
                            <span className="text-xs font-medium text-[#6d7175] capitalize">{colorKey.replace('Color', '')}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={(store.theme as any)[colorKey]}
                                onChange={(e) => updateThemeField(colorKey, e.target.value)}
                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-[#e1e3e5]" />

                     {/* Checkout Strategy */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-[#202223]">Checkout Engine</h3>
                      <div className="space-y-3">
                        <select
                          value={store.checkoutConfig.gatewayType}
                          onChange={(e) => {
                            const newStore = { ...store };
                            newStore.checkoutConfig.gatewayType = e.target.value as any;
                            onStoreUpdate(store.id, newStore);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm transition"
                        >
                          <option value="credit_simulator">💳 Direct Credit Card (Simulator)</option>
                          <option value="p2p_wallet">🔗 Direct Bank Transfer</option>
                        </select>
                      </div>
                    </div>

                  </div>
               </div>

               {/* Live Storefront Right Panel */}
               <div className="flex-1 bg-[#f4f6f8] h-full overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
                  <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-[#e1e3e5] bg-white">
                    <LivePreviewFrame config={store} onStoreUpdate={(updatedConfig) => onStoreUpdate(store.id, updatedConfig)} />
                  </div>
               </div>

             </div>
           ) : (
             
             /* OTHER TABS SCROLLABLE CONTENT (SHOPIFY STYLE) */
             <div className="w-full h-full overflow-y-auto p-6 lg:p-10 scrollbar-thin">
               <div className="max-w-[1000px] mx-auto animate-fade-in space-y-6">
                 
                 {/* TAB: PRODUCTS */}
                 {activeTab === 'products' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Products</h2>
                          <p className="text-sm text-[#6d7175]">Manage inventory and create variants.</p>
                        </div>
                      </div>

                      {/* Add Product Widget */}
                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-[#e1e3e5] bg-[#f9fafb]">
                          <h3 className="text-sm font-semibold">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                              <input type="text" value={newProduct.name} onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" placeholder="e.g. Classic T-Shirt" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#202223] mb-1">Price ($)</label>
                              <input type="number" value={newProduct.price} onChange={(e) => setNewProduct(prev => ({...prev, price: Number(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-[#202223] mb-1">Image URL</label>
                              <input type="text" value={newProduct.imageUrl} onChange={(e) => setNewProduct(prev => ({...prev, imageUrl: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-[#202223] mb-1">Description</label>
                              <textarea value={newProduct.description} onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))} className="w-full px-3 py-2 bg-white border border-[#c9cccf] rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none shadow-sm h-20 resize-none"></textarea>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2">
                             <button onClick={handleAddOrUpdateProduct} className="px-4 py-2 bg-[#008060] text-white text-sm font-semibold rounded-lg hover:bg-[#006e52] shadow-sm transition">
                               {editingProductId ? 'Save changes' : 'Save product'}
                             </button>
                             {editingProductId && (
                               <button onClick={() => { setEditingProductId(null); setNewProduct({name: '', price: 0, description: '', imageUrl: '', sku: '', stock: 0, variants: []}); }} className="ml-2 px-4 py-2 bg-white border border-[#c9cccf] text-[#202223] text-sm font-semibold rounded-lg hover:bg-[#f4f6f8] shadow-sm transition">
                                 Cancel
                               </button>
                             )}
                          </div>
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead className="bg-[#f9fafb] border-b border-[#e1e3e5]">
                            <tr>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Product</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Inventory</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Price</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.products.map(p => (
                              <tr key={p.id} className="border-b border-[#e1e3e5] hover:bg-[#f9fafb] transition">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded border border-[#e1e3e5]" />
                                    <span className="font-medium text-[#202223] text-sm">{p.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  <span className="inline-block px-2 py-0.5 bg-[#e4f8ec] text-[#008060] rounded-full text-xs font-semibold">Active</span>
                                </td>
                                <td className="px-5 py-3 text-sm text-[#202223] font-medium">{p.stock} in stock</td>
                                <td className="px-5 py-3 text-sm text-[#202223]">\\$\{p.price.toFixed(2)}</td>
                                <td className="px-5 py-3 text-right">
                                  <button onClick={() => editProduct(p.id)} className="text-[#008060] hover:text-[#006e52] text-sm font-semibold mr-3">Edit</button>
                                  <button onClick={() => removeProduct(p.id)} className="text-red-600 hover:text-red-700 text-sm font-semibold">Delete</button>
                                </td>
                              </tr>
                            ))}
                            {store.products.length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6d7175]">No products available. Add one above.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {/* TAB: ORDERS */}
                 {activeTab === 'orders' && (
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Orders</h2>
                          <p className="text-sm text-[#6d7175]">Manage incoming purchases and shipments.</p>
                        </div>
                      </div>

                      <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead className="bg-[#f9fafb] border-b border-[#e1e3e5]">
                             <tr>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Order ID</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Total</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase">Date</th>
                              <th className="px-5 py-3 text-xs font-semibold text-[#6d7175] uppercase text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.orders.map(order => (
                              <tr key={order.id} className="border-b border-[#e1e3e5] hover:bg-[#f9fafb] transition">
                                <td className="px-5 py-4 text-sm font-medium text-[#202223]">
                                  #{order.id.slice(0, 8)}
                                  <div className="text-xs text-[#6d7175] font-normal">{order.customerDetails.name}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={\`inline-block px-2 py-0.5 rounded-full text-xs font-semibold \${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }\`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-[#202223]">\\$\{order.totalAmount.toFixed(2)}</td>
                                <td className="px-5 py-4 text-xs text-[#6d7175]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-right">
                                   <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                    className="px-2 py-1 bg-white border border-[#c9cccf] rounded text-xs focus:outline-none shadow-sm cursor-pointer"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="fulfilled">Fulfilled</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {store.orders.length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-5 py-12 text-center">
                                  <Inbox className="w-8 h-8 text-[#c9cccf] mx-auto mb-2" />
                                  <div className="text-sm font-semibold text-[#202223]">No orders yet</div>
                                  <div className="text-xs text-[#6d7175]">When customers purchase, orders appear here.</div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {/* TAB: TEMPLATES */}
                 {activeTab === 'templates' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Theme Marketplace</h2>
                          <p className="text-sm text-[#6d7175]">Browse premium themes, install, or export yours.</p>
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-[#202223] border border-[#c9cccf] rounded-lg text-sm font-medium hover:bg-[#f9fafb] shadow-sm transition flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" /> Upload Custom Theme
                          <input type="file" accept=".json" ref={fileInputRef} onChange={handleThemeUpload} className="hidden" />
                        </button>
                      </div>

                      {themeUploadSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex gap-2">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Theme logic applied successfully!</span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Premium Theme Card */}
                         <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                           <div className="h-40 bg-gray-100 overflow-hidden relative">
                             <div className="absolute top-2 left-2 bg-[#202223] text-white text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM</div>
                             <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-4 flex flex-col items-start">
                             <div className="flex justify-between w-full items-center mb-1">
                               <h4 className="text-sm font-bold text-[#202223]">Bookly / MarketSupply</h4>
                               <span className="text-[#202223] font-bold text-sm">$49.00</span>
                             </div>
                             <p className="text-xs text-[#6d7175] mb-4">Clean, high-end e-commerce layouts.</p>
                             <button onClick={() => applyPresetTemplate('modern')} className="w-full py-2 bg-[#008060] text-white text-xs font-bold rounded-lg hover:bg-[#006e52] transition">
                               Install Active Theme
                             </button>
                           </div>
                         </div>

                         {/* Free Theme */}
                         <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                           <div className="h-40 bg-gray-100 overflow-hidden relative">
                             <div className="absolute top-2 left-2 bg-white border border-[#e1e3e5] text-[#202223] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">FREE</div>
                             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-4 flex flex-col items-start">
                             <div className="flex justify-between w-full items-center mb-1">
                               <h4 className="text-sm font-bold text-[#202223]">Minimalist Core</h4>
                               <span className="text-[#008060] font-bold text-sm">$0.00</span>
                             </div>
                             <p className="text-xs text-[#6d7175] mb-4">A fast, lightweight template framework.</p>
                             <button onClick={() => applyPresetTemplate('stealth')} className="w-full py-2 bg-white border border-[#c9cccf] text-[#202223] text-xs font-bold rounded-lg hover:bg-[#f9fafb] shadow-sm transition">
                               Install Theme
                             </button>
                           </div>
                         </div>

                         {/* Export Tool */}
                         <div className="bg-white border-2 border-dashed border-[#c9cccf] rounded-xl flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-10 h-10 bg-[#f4f6f8] rounded-full flex items-center justify-center mb-3">
                              <DownloadCloud className="w-5 h-5 text-[#6d7175]" />
                            </div>
                            <h4 className="text-sm font-bold text-[#202223] mb-1">Export Architecture</h4>
                            <p className="text-xs text-[#6d7175] mb-4">Download your current layout schema and configuration as JSON.</p>
                            <button onClick={downloadSchemaJson} className="px-4 py-2 bg-[#008060] text-white text-xs font-bold rounded-lg hover:bg-[#006e52] shadow-sm transition">
                              Export Schema
                            </button>
                         </div>
                      </div>
                    </div>
                 )}

                 {/* TAB: CODE */}
                 {activeTab === 'code' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#202223]">Code Injection</h2>
                          <p className="text-sm text-[#6d7175]">Add custom scripts or override CSS directly.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                           <div className="p-3 bg-[#1e1e1e] flex items-center justify-between border-b border-[#333]">
                              <span className="text-xs font-mono text-gray-300">global.css</span>
                           </div>
                           <textarea value={cssCode} onChange={e => setCssCode(e.target.value)} onBlur={() => updateThemeField('customCSS', cssCode)} className="flex-1 w-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs focus:outline-none resize-none" spellCheck="false" />
                        </div>

                        <div className="bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                           <div className="p-3 bg-[#1e1e1e] flex items-center justify-between border-b border-[#333]">
                              <span className="text-xs font-mono text-yellow-300">app.js</span>
                           </div>
                           <textarea value={jsCode} onChange={e => setJsCode(e.target.value)} onBlur={() => updateThemeField('customJS', jsCode)} className="flex-1 w-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs focus:outline-none resize-none" spellCheck="false" />
                        </div>
                      </div>
                    </div>
                 )}

                 {/* TAB: DEPLOY */}
                 {activeTab === 'deploy' && (
                    <div className="space-y-6">
                      <StandaloneExporter />
                    </div>
                 )}

               </div>
             </div>

           )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(filepath, beforeReturn + '\n' + newJSX, 'utf8');
console.log('Successfully re-architected SaaS UI to Shopify Layout');
