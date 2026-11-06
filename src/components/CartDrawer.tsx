import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    cartCount,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const result = applyCoupon(inputCoupon);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse our hardware & lifestyle catalogue to add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-medium text-slate-500">Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info & Actions */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={product.name}>
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                            title="Remove item (TC05)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                          {product.category}
                        </p>
                      </div>

                      {/* Stepper (TC04) & Line Price */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-md bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer font-bold select-none"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold font-mono text-slate-900 min-w-[24px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold select-none"
                            title={quantity >= product.stock ? 'Maximum stock reached' : 'Increase quantity'}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                            ${(product.price * quantity).toFixed(2)}
                          </span>
                          {quantity > 1 && (
                            <span className="block text-[10px] text-slate-400 font-mono tabular-nums">
                              ${product.price.toFixed(2)} ea
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Code Input */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Discount code (try AURA10)"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                  )}
                  {couponCode && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                      <span className="flex items-center gap-1 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Code <span className="font-mono">{couponCode}</span> applied ({couponDiscount}% off)
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer & Dynamic Cost Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({couponDiscount}%)</span>
                    <span className="font-mono tabular-nums">
                      -${((cartSubtotal * couponDiscount) / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Shipping</span>
                    {cartShipping === 0 ? (
                      <span className="text-[10px] text-emerald-700 font-medium">(Free over $150)</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">(Standard)</span>
                    )}
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartTax.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-950 font-mono tabular-nums">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Simulated secure 256-bit SSL encrypted checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
