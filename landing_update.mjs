import fs from 'fs';

const content = `import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Store, CreditCard, Layout, BarChart, CheckCircle2, Shield, Zap, Code, Users, Star, ChevronRight, UploadCloud, Monitor } from 'lucide-react';

interface LandingPageProps {
  onLogin: (email: string) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'auth'>('intro');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeType, setStoreType] = useState('clothing');
  const [storeName, setStoreName] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email);
  };

  if (activeTab === 'intro') {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-green-500 selection:text-black">
        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded text-black hidden sm:block">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FSCommerce</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#platform" className="hover:text-white transition">The Platform</a>
              <a href="#pricing" className="hover:text-white transition">Fair-Play Pricing</a>
              <a href="#marketplace" className="hover:text-white transition">Theme Marketplace</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { setActiveTab('auth'); setAuthMode('login'); }} className="text-sm font-medium text-gray-300 hover:text-white transition">Log In</button>
              <button onClick={() => { setActiveTab('auth'); setAuthMode('signup'); }} className="px-5 py-2.5 text-sm font-bold text-black bg-green-500 rounded hover:bg-green-400 transition shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                Start 2-Month Free Trial
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs font-medium text-green-400">
              <Zap className="w-4 h-4" /> No Limits. 100% Client-Side. Blazing Fast.
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white tracking-tighter">
              DOMINATE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">E-COMMERCE.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
              We built FSCommerce to destroy the sluggish, bloated competition. Zero generic AI slop. Absolute control. Launch a hyper-converting, highly-customized storefront in seconds, managed entirely from an elite metallic dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex w-full sm:w-auto relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-5 py-4 w-full sm:w-80 rounded-l border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={() => { setActiveTab('auth'); setAuthMode('signup'); }} 
                  className="px-6 py-4 bg-green-500 text-black font-bold rounded-r hover:bg-green-400 transition whitespace-nowrap flex items-center gap-2"
                >
                  Deploy Store <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> 2-Month Free Trial</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Credit Card Required</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instant Provisioning</span>
            </div>
          </div>
          
          {/* Dynamic Hero Visual */}
          <div className="relative group perspective-1000 mt-10 md:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-700 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl transform md:rotate-y-[-5deg] md:rotate-x-[5deg] hover:rotate-0 transition duration-500">
              <div className="bg-gray-950 p-3 border-b border-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 px-2 py-1 bg-gray-900 rounded text-xs text-gray-500 font-mono flex-1 text-center truncate">fscommerce.run/dashboard</div>
              </div>
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" alt="Dashboard Preview" className="w-full object-cover opacity-80 group-hover:opacity-100 transition h-[300px] md:h-[400px]" />
            </div>
          </div>
        </main>

        {/* Why FSCommerce? / Feature Grid */}
        <section id="platform" className="py-24 px-6 border-t border-gray-900 bg-gray-950 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-6">WHY FSCOMMERCE CRUSHES THE COMPETITION</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                We stripped away the bloated plugins, hidden fees, and sluggish backend calls. FSCommerce is an ultra-lightweight, 100% client-side optimized powerhouse built for raw conversion and sheer speed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-green-500/50 transition">
                <div className="w-12 h-12 bg-gray-950 border border-gray-800 rounded flex items-center justify-center mb-6">
                  <Code className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ruthless Customization</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Complete control over your components. Inject custom CSS and deep variant logic directly into your store. No arbitrary restrictions. Your code, your layout.
                </p>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-green-500/50 transition">
                <div className="w-12 h-12 bg-gray-950 border border-gray-800 rounded flex items-center justify-center mb-6">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Checkout Integrations</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  We process direct seamless credit cards or alternative methods without redirecting your buyer. Our high-converting checkout terminal guarantees zero friction.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-green-500/50 transition">
                <div className="w-12 h-12 bg-gray-950 border border-gray-800 rounded flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sub-Second Load Times</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Your store is mapped directly to our lightweight routing system. No database queries blocking your first-paint. Speed is revenue, and we run faster than anyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Pricing Engine - The "Fair-Play" Model */}
        <section id="pricing" className="py-24 px-6 border-t border-gray-900 bg-black">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-6">THE FAIR-PLAY DYNAMIC PRICING ENGINE</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                We do not believe in punishing you before you succeed. Our intelligent pricing logic ensures you only pay when your business is thriving. We don't earn unless you earn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">PHASE 1</div>
                <h3 className="text-2xl font-black text-white mt-4 mb-2">The Hook</h3>
                <div className="text-4xl font-black text-green-400 mb-4">$0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-6">
                  Your first 2 months are completely free. Unlimited access to every premium feature. No artificial limits.
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Full Store Builder</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom Domain Support</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Revenue Kept</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
                <div className="text-gray-500 text-xs font-bold mb-2">PHASE 2 (The Scale)</div>
                <h3 className="text-xl font-bold text-white mb-2">The Climb</h3>
                <div className="text-3xl font-black text-white mb-4">$4 - $12<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-6">
                  After 2 months, fees gradually increase from $4 to $12 monthly, allowing you to comfortably scale.
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Affordable Tiering</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Premium Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Priority Support Routing</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl border-l-4 border-l-red-500">
                <div className="text-red-400 text-xs font-bold mb-2">THE SAFETY NET</div>
                <h3 className="text-xl font-bold text-white mb-2">Down Weeks?</h3>
                <div className="text-3xl font-black text-white mb-4">$1<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-6">
                  If you get 0 orders in a billing cycle, your fee drops to $1 to keep your server and database alive.
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Server Preservation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Zero Stress</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Auto-Activation</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-900 border border-green-500/30 p-8 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <div className="text-green-400 text-xs font-bold mb-2">THE SUCCESS TAX</div>
                <h3 className="text-xl font-bold text-white mb-2">Whale Status</h3>
                <div className="text-3xl font-black text-green-400 mb-4">0.5%<span className="text-lg text-gray-500 font-medium"> Vol.</span></div>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-6">
                  For stores doing massive multi-million volume, flat fees vanish. A tiny percentage fee aligns our goals perfectly.
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited Bandwidth</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Enterprise CDN</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Marketplace ecosystem */}
        <section id="marketplace" className="py-24 px-6 border-t border-gray-900 bg-gray-950 relative">
           <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black text-white mb-4">THE FSCOMMERCE THEME MARKETPLACE</h2>
                <p className="text-lg text-gray-400 font-light">
                  A thriving developer ecosystem. Browse free community templates, premium studio designs, or upload your own theme JSON schema to sell directly to thousands of merchants.
                </p>
              </div>
              <button className="mt-6 md:mt-0 px-6 py-3 border border-gray-700 hover:border-white rounded bg-gray-900 text-white font-medium transition flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Become a Theme Creator
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Theme 1 */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 rounded">FREE</div>
                   <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Theme" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-white">Lumina Minimal</h4>
                    <span className="text-green-400 font-bold">$0.00</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Clean, high-contrast theme optimized for fashion and apparel. By FSCommerce Core.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9 (2.4k installs)
                  </div>
                </div>
              </div>

              {/* Theme 2 */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                <div className="h-48 overflow-hidden relative z-0">
                   <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded z-20">PREMIUM</div>
                   <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Theme" />
                </div>
                <div className="p-5 relative z-20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-white">CyberGrid Terminal</h4>
                    <span className="text-white font-bold">$49.00</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Aggressive, dark-mode terminal aesthetics for tech and hardware vendors. By NexusStudio.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 5.0 (892 installs)
                  </div>
                </div>
              </div>

               {/* Theme 3 */}
               <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">COMMUNITY</div>
                   <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Theme" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-white">Velvet Boutique</h4>
                    <span className="text-white font-bold">$19.00</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Elegant typography and smooth scroll effects for modern lifestyle brands. By DevCreative.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.7 (415 installs)
                  </div>
                </div>
              </div>
            </div>
           </div>
        </section>

        {/* Footer CTA */}
        <footer className="py-20 px-6 bg-black border-t border-gray-900 text-center">
          <h2 className="text-4xl font-black text-white mb-6">READY TO LAUNCH?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the elite network of merchants who refuse to settle for slow, bloated platforms. Deploy your first storefront in the next 60 seconds.
          </p>
          <button onClick={() => { setActiveTab('auth'); setAuthMode('signup'); }} className="px-10 py-5 text-lg font-bold text-black bg-green-500 hover:bg-green-400 rounded transition shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            Start Your 2-Month Free Trial Now
          </button>
          <div className="mt-20 text-gray-600 text-sm flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4"/> Enterprise SSL</div>
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> Secure Payments</div>
            <div className="flex items-center gap-2"><Monitor className="w-4 h-4"/> 99.99% Uptime</div>
            <span className="md:ml-auto">© 2026 FSCommerce Systems.</span>
          </div>
        </footer>
      </div>
    );
  }

  // Auth Flow (Dark / Cyber Metallic style)
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-green-500 selection:text-black font-sans relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black z-0"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center gap-3 items-center cursor-pointer mb-8" onClick={() => setActiveTab('intro')}>
          <div className="p-2 bg-green-500 rounded text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">FSCommerce</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          {authMode === 'signup' ? 'Initialize Workspace' : 'Access Dashboard'} 
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {authMode === 'signup' ? 'Have an existing node? ' : 'New to FSCommerce? '}
          <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')} className="font-bold text-green-400 hover:text-green-300">
            {authMode === 'signup' ? 'Authenticate here' : 'Deploy a free store'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-gray-900 py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Store Identifier</label>
                  <div className="mt-1">
                    <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)} className="appearance-none block w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500" placeholder="e.g. Nexus Gear" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Primary Vertical</label>
                  <select 
                    className="block w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:border-green-500"
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value)}
                  >
                    <option value="clothing">Apparel & Streetwear</option>
                    <option value="electronics">Hardware & Electronics</option>
                    <option value="beauty">Aesthetics & Health</option>
                    <option value="software">Digital Goods & Software</option>
                    <option value="other">General Merchandise</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Secure Email Address</label>
              <div className="mt-1">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500" placeholder="admin@domain.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Access Key</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500" placeholder="••••••••" />
              </div>
            </div>

            {authMode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-gray-950 border-gray-700 rounded text-green-500 focus:ring-green-500 focus:ring-offset-gray-900" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400"> Persist session </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-bold text-green-400 hover:text-green-300"> Reset Access Key </a>
                </div>
              </div>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 rounded border border-transparent text-sm font-bold text-black bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition">
                {authMode === 'signup' ? 'COMPILE STOREFRONT' : 'ESTABLISH UPLINK'}
              </button>
            </div>
            
            {authMode === 'signup' && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Deploying initializes a 2-Month Free Trial. By proceeding you agree to our Fair-Play Terms of Service.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/LandingPage.tsx', content, 'utf-8');
console.log('Landing page completely upgraded');
