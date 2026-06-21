import fs from 'fs';

const filepath = 'src/components/StorefrontRenderer.tsx';
const lines = fs.readFileSync(filepath, 'utf8').split('\n');

const returnLineIndex = lines.findIndex(l => l.startsWith('  return (') || l.startsWith('  return('));

if (returnLineIndex === -1) {
  console.log('Return statement not found');
  process.exit(1);
}

const beforeReturn = lines.slice(0, returnLineIndex).join('\n');

const newJSX = \`
  return (
    <div 
      className={\`min-h-screen text-gray-800 transition-colors duration-150 relative pb-20 \${getFontClass()}\`} 
      style={{ backgroundColor: theme.backgroundColor || '#ffffff' }}
    >
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=Orbitron:wght@400;600;900&family=Fira+Code:wght@300;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-fira { font-family: 'Fira Code', monospace; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        .bookly-btn {
          background-color: \${theme.primaryColor || '#000000'};
          color: \${theme.textColor || '#ffffff'};
          transition: all 0.2s ease;
        }
        .bookly-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      \`}</style>

      {/* Sticky High-End Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ color: theme.primaryColor }}>
              {name || 'Premium Store'}
            </h1>
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Home</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Shop Catalog</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">About Us</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Contact</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            {/* Currency Selector */}
            <div className="hidden md:flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select
                value={clientCurrency}
                onChange={(e) => setClientCurrency(e.target.value as any)}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCY_CONVERSION).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>
            
            <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

            <button className="text-gray-600 hover:text-gray-900 transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition relative outline-none">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-gray-600 hover:text-gray-900 transition relative outline-none"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm bookly-btn">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
            <button className="hidden md:block text-gray-600 hover:text-gray-900 transition">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto min-h-[70vh]">
        
        {/* Hero Banner Grid (Magazine Layout) */}
        {!isCartOpen && checkoutStep === 'cart' && (
          <div className="px-4 md:px-8 py-8 animate-fade-in">
            <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/20 transition-all duration-700"></div>
              <img 
                src={theme.bannerImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop'} 
                alt="Store Banner" 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6 md:p-12">
                <span className="text-white/80 font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-4 drop-shadow-md">
                  New Collection
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-xl" style={{ fontFamily: theme.typography === 'playfair' ? 'Playfair Display' : 'Inter' }}>
                  {customization.tagline || 'Discover Premium Quality'}
                </h2>
                <div className="w-16 h-1 bg-white mb-8 rounded-full shadow-md"></div>
                <button 
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                  className="px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Shop the Catalog
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid - Premium Cards */}
        {checkoutStep === 'cart' && (
          <div className="px-4 md:px-8 py-8 md:py-12">
            <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ color: theme.primaryColor }}>
                  Trending Now
                </h3>
                <p className="text-gray-500 mt-2 font-medium">Showing {products.length} Products</p>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition">Sort by: Featured</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
              {products.map(product => (
                <div key={product.id} className="group cursor-pointer flex flex-col relative w-full h-full">
                  {/* Image Holder */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4 isolate">
                    {product.stock < 5 && product.stock > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded z-20 shadow-sm">
                        Low Stock ({product.stock})
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center text-gray-800 font-bold uppercase tracking-widest">
                        Sold Out
                      </span>
                    )}
                    
                    {/* Hover Add To Cart overlay (Desktop) */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 flex flex-col justify-end p-4">
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                         disabled={product.stock === 0}
                         className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg bookly-btn disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                       </button>
                    </div>

                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />

                    {/* Quick Like */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition shadow-sm z-20"
                    >
                      <Heart className="w-4 h-4" fill={favorites.includes(product.id) ? "currentColor" : "none"} color={favorites.includes(product.id) ? "#ef4444" : "currentColor"} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:underline decoration-2 underline-offset-4" style={{ color: theme.primaryColor }}>
                        {product.name}
                      </h4>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {product.description || 'Premium quality materials.'}
                      </p>
                    </div>

                    {/* Variants Setup if any */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="flex flex-col gap-2 mb-4">
                        {product.variants.map((variant) => {
                          const activeOption = getSatisfiedOptionsForProduct(product)[variant.name];
                          return (
                            <div key={variant.name} className="flex flex-wrap gap-1.5 items-center">
                              {variant.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductOptionSelection(product.id, variant.name, opt);
                                  }}
                                  className={\`px-2 py-1 text-[10px] font-semibold border rounded transition \${
                                    activeOption === opt
                                      ? 'bg-gray-900 border-gray-900 text-white'
                                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                  }\`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-gray-900 tracking-tight">
                        {formatCostValue(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {products.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <Package className="w-16 h-16 text-gray-200 mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Inventory Empty</h3>
                  <p className="text-gray-400 text-sm max-w-md">The merchant has not added any products to the active catalog.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Cart Slide-Out Modal */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
            
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right transform overflow-hidden" 
                 style={{ backgroundColor: theme.backgroundColor }}>
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10 shadow-sm relative">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-gray-50/50">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-sm">Explore our catalog and add items.</p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2.5 bookly-btn font-semibold rounded-lg shadow-sm"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : checkoutStep === 'cart' ? (
                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const variantsStr = JSON.stringify(item.selectedVariants);
                      return (
                        <div key={\`\${item.product.id}-\${idx}\`} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm relative group">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-20 h-24 object-cover rounded-lg bg-gray-50 border border-gray-100" 
                          />
                          <div className="flex-1 flex flex-col pt-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight pr-4">{item.product.name}</h4>
                              <button 
                                onClick={() => handleRemoveItem(item.product.id, variantsStr)}
                                className="text-gray-300 hover:text-red-500 transition absolute right-3 top-3"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Variants Display */}
                            {Object.keys(item.selectedVariants).length > 0 && (
                              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                {Object.values(item.selectedVariants).join(' / ')}
                              </div>
                            )}

                            <div className="text-xs text-gray-400 mt-1 mb-2 font-mono">SKU: {item.product.sku}</div>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                                <button 
                                  onClick={() => handleQuantityUpdate(item.product.id, variantsStr, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityUpdate(item.product.id, variantsStr, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-bold text-gray-900 tracking-tight">
                                {formatCostValue(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  
                  /* CHECKOUT FLOW (Classic Premium Form) */
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 checkout-container animate-fade-in relative z-10 transition-colors duration-300">
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Cart
                    </button>
                    
                    {checkoutStep === 'shipping' && (
                      <div className="space-y-5">
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight pb-2 border-b border-gray-100">1. Shipping Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 lg:text-[11px] uppercase tracking-wider">Full Name</label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060] transition shadow-sm font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 lg:text-[11px] uppercase tracking-wider">Email Address</label>
                            <input
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="e.g. john@example.com"
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060] transition shadow-sm font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 lg:text-[11px] uppercase tracking-wider">Destination Country</label>
                            <select
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060] transition shadow-sm font-sans cursor-pointer"
                            >
                              {Object.keys(COUNTRY_RULES).map(country => (
                                <option key={country} value={country}>{country}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 lg:text-[11px] uppercase tracking-wider">Shipping Address</label>
                            <textarea
                              value={customerAddress}
                              onChange={(e) => setCustomerAddress(e.target.value)}
                              placeholder="e.g. 123 Main St, New York, NY"
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060] transition shadow-sm h-20 resize-none font-sans"
                            ></textarea>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (customerName && customerEmail && customerAddress) {
                                setCheckoutStep('payment');
                              } else {
                                alert('Please complete all shipping fields to continue.');
                              }
                            }}
                            className="w-full py-3.5 mt-2 rounded-lg font-bold text-sm shadow-md transition-all duration-300 bookly-btn"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    )}

                    {checkoutStep === 'payment' && (
                      <form onSubmit={executeP2PCheckoutSubmit} className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight pb-2 border-b border-gray-100">2. Payment Method</h3>
                        
                        {store.checkoutConfig.gatewayType === 'credit_simulator' ? (
                          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-500" /> Credit / Debit Card
                              </div>
                              <div className="flex items-center gap-1.5 opacity-70">
                                 <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic shadow-sm">VISA</div>
                                 <div className="w-8 h-5 bg-gradient-to-br from-red-500 to-yellow-500 rounded flex items-center justify-center shadow-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-600 -mr-1 z-10 border border-white/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 bg-black/10 z-0"></div>
                                 </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                                <div className="relative">
                                  <input
                                    type="text" required value={creditCardNumber}
                                    onChange={(e) => setCreditCardNumber(e.target.value.replace(/\\s?/g, '').replace(/(\\d{4})/g, '$1 ').trim().slice(0, 19))}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-sans focus:outline-none focus:border-green-500 transition shadow-sm"
                                  />
                                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">Expiration</label>
                                  <input
                                    type="text" required placeholder="MM/YY" value={creditExpiry}
                                    onChange={(e) => setCreditExpiry(e.target.value.slice(0, 5))}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-sans focus:outline-none focus:border-green-500 transition shadow-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">CVC</label>
                                  <input
                                    type="password" required placeholder="123" value={creditCvc}
                                    onChange={(e) => setCreditCvc(e.target.value.replace(/\\D/g, '').slice(0, 4))}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-sans focus:outline-none focus:border-green-500 transition shadow-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 shadow-sm font-sans flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                               <MessageCircle className="w-5 h-5 text-blue-600" />
                             </div>
                             <div>
                               <h4 className="text-sm font-bold text-gray-900">Direct Invoice Checkout</h4>
                               <p className="text-xs text-gray-600 leading-relaxed mt-1">This store uses direct bank transfer. Your order will be sent to the merchant directly for fulfillment.</p>
                             </div>
                          </div>
                        )}

                        <button 
                          type="submit" 
                          disabled={isProcessingP2P}
                          className="w-full py-3.5 rounded-lg font-bold text-sm shadow-md transition-all duration-300 bookly-btn flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                          {isProcessingP2P ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...</>
                          ) : (
                            <><ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> Pay & Place Order</>
                          )}
                        </button>
                      </form>
                    )}

                    {checkoutStep === 'p2p_processing' && (
                       <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in font-sans">
                         <div className="w-16 h-16 border-4 border-gray-200 border-t-[#008060] rounded-full animate-spin"></div>
                         <h3 className="text-lg font-bold text-gray-900">Processing secure payment...</h3>
                         <p className="text-sm text-gray-500">Please do not close this window.</p>
                       </div>
                    )}
                    
                    {checkoutStep === 'success' && (
                      <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in font-sans">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                          <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Order Confirmed!</h3>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-[250px]">
                          Thank you for your purchase. We've sent a receipt to {customerEmail}.
                        </p>
                        <button 
                          onClick={() => {
                            setCheckoutStep('cart');
                            setCart([]);
                            setIsCartOpen(false);
                          }}
                          className="mt-6 px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all bookly-btn"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Footer Checkout Sticky Bottom */}
              {cart.length > 0 && checkoutStep === 'cart' && (
                <div className="p-6 bg-white border-t border-gray-100 shrink-0 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] box-border">
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>Subtotal</span>
                      <span>{formatCostValue(totalWeightCostBase)}</span>
                    </div>
                    {/* Add taxes and shipping logic visualization conceptually */}
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>Estimated Shipping</span>
                      <span>{formatCostValue(flatShippingInUSD)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span>{formatCostValue(totalCombinedInvoiceUSD)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-3.5 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md transition-all duration-300 bookly-btn hover:-translate-y-0.5"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Secure Encrypted Checkout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4" style={{ color: theme.primaryColor }}>
                {name || 'Store'}
              </h2>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
                Premium quality goods delivered straight to your door. Our commitment involves absolute quality and sustainable aesthetics.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 cursor-pointer transition">
                  <span className="font-bold">IG</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 cursor-pointer transition">
                  <span className="font-bold">TW</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Help & Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:text-gray-900 cursor-pointer transition">Track Order</li>
                <li className="hover:text-gray-900 cursor-pointer transition">Returns Info</li>
                <li className="hover:text-gray-900 cursor-pointer transition">Contact Us</li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:text-gray-900 cursor-pointer transition">New Arrivals</li>
                <li className="hover:text-gray-900 cursor-pointer transition">Featured Brands</li>
                <li className="hover:text-gray-900 cursor-pointer transition">Gift Cards</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
            <div>&copy; {new Date().getFullYear()} {name}. All Rights Reserved.</div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="text-gray-800 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">FSCommerce</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
\`

fs.writeFileSync(filepath, beforeReturn + '\n' + newJSX, 'utf8');
console.log('Successfully re-architected Storefront UI to Premium eCommerce Layout');
