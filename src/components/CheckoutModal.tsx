import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, Truck, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Package, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { ShippingAddress, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    couponDiscount,
    placeOrder,
    currentUser,
    setActiveView,
    lastPlacedOrder,
    setLastPlacedOrder,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Address state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.address?.fullName || currentUser?.name || 'Alex Morgan',
    street: currentUser?.address?.street || '742 Evergreen Terrace, Apt 4B',
    city: currentUser?.address?.city || 'Portland',
    state: currentUser?.address?.state || 'Oregon',
    zipCode: currentUser?.address?.zipCode || '97201',
    phone: currentUser?.address?.phone || '+1 (555) 234-8901',
  });

  // Shipping method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment simulation state
  const [paymentType, setPaymentType] = useState<'card' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(address.fullName);
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Errors state
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Reset or initialize on open
  useEffect(() => {
    if (isCheckoutOpen && !lastPlacedOrder) {
      setCurrentStep(1);
      if (currentUser?.address) {
        setAddress(currentUser.address);
      }
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.street.trim()) errs.street = 'Street address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'State / Province is required';
    if (!address.zipCode.trim()) errs.zipCode = 'ZIP code is required';
    if (!address.phone.trim()) errs.phone = 'Phone number is required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fillDemoAddress = () => {
    setAddress({
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      phone: '+1 (555) 234-8901',
    });
    setAddressErrors({});
  };

  const handleNextFromAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCardHolder(address.fullName);
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = () => {
    const paymentLabel =
      paymentType === 'card'
        ? `Credit Card (ending in •••• ${cardNumber.replace(/\D/g, '').slice(-4) || '4242'})`
        : 'Cash on Delivery (COD)';

    const createdOrder = placeOrder(address, shippingMethod, paymentLabel);

    if (createdOrder) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0f172a', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Fallback gracefully if canvas is constrained
      }
    }
  };

  const handleFinishAndGoToHistory = () => {
    setIsCheckoutOpen(false);
    setLastPlacedOrder(null);
    setActiveView('orders');
  };

  const handleContinueShopping = () => {
    setIsCheckoutOpen(false);
    setLastPlacedOrder(null);
    setActiveView('store');
  };

  const effectiveShipping = shippingMethod === 'express' ? 18.00 : cartShipping;
  const effectiveTotal = Math.max(0, cartSubtotal - (couponDiscount > 0 ? (cartSubtotal * couponDiscount) / 100 : 0) + effectiveShipping + cartTax);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">
              {lastPlacedOrder ? 'Order Confirmation' : 'Complete Your Order'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setLastPlacedOrder(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Order State (TC06 Completion) */}
        {lastPlacedOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider font-mono">
                Order Confirmed & Payment Verified
              </div>
              <h3 className="text-2xl font-bold text-slate-950 mt-1">
                Thank you for your order!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                A confirmation summary has been saved to your account.
              </p>
            </div>

            {/* Order Highlight Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Order ID:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">{lastPlacedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    {lastPlacedOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-600 font-medium">Deliver to:</p>
                <p className="font-bold text-slate-900">{lastPlacedOrder.shippingAddress.fullName}</p>
                <p className="text-slate-500">
                  {lastPlacedOrder.shippingAddress.street}, {lastPlacedOrder.shippingAddress.city},{' '}
                  {lastPlacedOrder.shippingAddress.state} {lastPlacedOrder.shippingAddress.zipCode}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Charged:</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  ${lastPlacedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleFinishAndGoToHistory}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View in Order History (TC07)</span>
              </button>
              <button
                onClick={handleContinueShopping}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Indicators */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 max-w-md mx-auto">
                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                      currentStep >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    1
                  </span>
                  <span>Shipping</span>
                </div>
                <div className="w-8 h-px bg-slate-200"></div>
                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                      currentStep >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    2
                  </span>
                  <span>Delivery</span>
                </div>
                <div className="w-8 h-px bg-slate-200"></div>
                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                      currentStep >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    3
                  </span>
                  <span>Payment</span>
                </div>
                <div className="w-8 h-px bg-slate-200"></div>
                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep >= 4 ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                      currentStep >= 4 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    4
                  </span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            {/* Step 1: Shipping Address Form */}
            {currentStep === 1 && (
              <form onSubmit={handleNextFromAddress} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-slate-700" />
                    <span>1. Shipping Destination</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoAddress}
                    className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    Fill Demo Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.fullName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.street && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.street}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="e.g. Portland"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.city && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="e.g. Oregon"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.state && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.state}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      placeholder="e.g. 97201"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.zipCode && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="e.g. +1 (555) 234-8901"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {addressErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{addressErrors.phone}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <span>2. Select Shipping Method</span>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-slate-900 bg-slate-50/80 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Standard Eco Delivery (3-5 business days)</p>
                        <p className="text-[11px] text-slate-500">Carbon-neutral ground shipment via local carrier</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-slate-900 bg-slate-50/80 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Express Priority Air (1-2 business days)</p>
                        <p className="text-[11px] text-slate-500">Expedited handling with guaranteed delivery slot</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900">$18.00</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="py-2 px-3 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Simulation */}
            {currentStep === 3 && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <span>3. Payment Method Simulation</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    Demo Sandbox Mode
                  </span>
                </div>

                {/* Payment Selection Tabs */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentType === 'card'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('cod')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentType === 'cod'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {paymentType === 'card' ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="888"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      Pre-filled with simulated test card for rapid evaluation.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <p className="font-semibold">Cash on Delivery selected</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      You will pay exactly <span className="font-bold">${effectiveTotal.toFixed(2)}</span> in cash to the courier upon parcel delivery. Please keep exact change ready.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="py-2 px-3 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Final Order Review & "Place Order" (TC06) */}
            {currentStep === 4 && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 font-bold text-sm">
                    <span>4. Final Review & Authorization</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {cart.length} unique item(s)
                  </span>
                </div>

                {/* Items Summary */}
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 truncate max-w-[320px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">Qty: {quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 font-mono tabular-nums">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Badges */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Shipping to:</span>
                    <span className="font-semibold text-slate-900 truncate block">{address.fullName}</span>
                    <span className="text-slate-500 text-[11px] truncate block">{address.street}, {address.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment:</span>
                    <span className="font-semibold text-slate-900 block">
                      {paymentType === 'card' ? 'Credit Card (••4242)' : 'Cash on Delivery'}
                    </span>
                    <span className="text-slate-500 text-[11px] block capitalize">{shippingMethod} Shipping</span>
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums font-semibold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({couponDiscount}%)</span>
                      <span className="font-mono tabular-nums">-${((cartSubtotal * couponDiscount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-mono tabular-nums font-semibold">
                      {effectiveShipping === 0 ? 'FREE' : `$${effectiveShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span className="font-mono tabular-nums font-semibold">${cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-950 font-bold text-base pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="font-mono tabular-nums">${effectiveTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="py-2 px-3 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="py-3 px-6 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Place Order · ${effectiveTotal.toFixed(2)} (TC06)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
