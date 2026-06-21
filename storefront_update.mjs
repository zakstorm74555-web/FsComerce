import fs from 'fs';
let content = fs.readFileSync('src/components/StorefrontRenderer.tsx', 'utf-8');

const regexToReplaceCheckout = /\{\/\* If credit simulator is active gateway, display fields inline \*\/\}[\s\S]*?(?=\{\/\* P2P mapping info tag depending on gatewayType \*\/\})/;

const newCheckoutUi = `{/* Card Payment Element Simulator */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4 mt-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" /> Credit / Debit Card
                      </div>
                      {/* Fake card badges */}
                      <div className="flex items-center gap-1.5 opacity-70">
                         <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic shadow-sm">VISA</div>
                         <div className="w-8 h-5 bg-gradient-to-br from-red-500 to-yellow-500 rounded flex items-center justify-center shadow-sm">
                            <div className="w-3 h-3 rounded-full bg-red-600 -mr-1 z-10 border border-white/20"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 bg-black/10 z-0"></div>
                         </div>
                         <div className="w-8 h-5 bg-sky-500 rounded flex items-center justify-center text-[7px] text-white font-bold shadow-sm">AMEX</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={creditCardNumber}
                            onChange={(e) => setCreditCardNumber(e.target.value.replace(/\\s?/g, '').replace(/(\\d{4})/g, '$1 ').trim().slice(0, 19))}
                            placeholder="0000 0000 0000 0000"
                            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 font-sans focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition shadow-sm"
                          />
                          <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Expiration</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={creditExpiry}
                            onChange={(e) => setCreditExpiry(e.target.value.slice(0, 5))}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 font-sans focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">CVC</label>
                          <input
                            type="password"
                            required
                            placeholder="123"
                            value={creditCvc}
                            onChange={(e) => setCreditCvc(e.target.value.replace(/\\D/g, '').slice(0, 4))}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 font-sans focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>\n                  `;

content = content.replace(regexToReplaceCheckout, newCheckoutUi);


// Fixing cyber terms 
content = content.replace(/Operator Signature Name/gi, 'Full Name');
content = content.replace(/e\.g\. CORE_COWBOY/gi, 'e.g. John Doe');
content = content.replace(/Client Mailbox IP Destination/gi, 'Email Address');
content = content.replace(/e\.g\. interface@port80\.net/gi, 'e.g. john@example.com');
content = content.replace(/Physical coordinate address/gi, 'Shipping Address');
content = content.replace(/e\.g\. Section 9 Labs, Sector 4 Grid/gi, 'e.g. 123 Main St, New York, NY');
content = content.replace(/SOLDER TRANSACTION CONTRACT/gi, 'PROCESSING SECURE PAYMENT');
content = content.replace(/Creating peer logs, zero-fees active\.\.\./gi, 'Authenticating payment with your bank...');
content = content.replace(/No middleware slice\./g, 'Processed securely.');
content = content.replace(/checkout routing: directly utilizing/gi, 'Payment processing via');
content = content.replace(/P2P mapping info tag depending on gatewayType/g, 'Checkout text log');

fs.writeFileSync('src/components/StorefrontRenderer.tsx', content, 'utf-8');
console.log('Storefront checkout overhauled.');
