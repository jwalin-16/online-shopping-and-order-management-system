/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerStore } from './components/CustomerStore';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Shield, Package, Store, RotateCcw } from 'lucide-react';

function MainLayout() {
  const { activeView, activeRole, setActiveView, setActiveRole, resetToDemoData } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Universal Responsive Navbar with Role Switcher */}
      <Navbar />

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'store' && <CustomerStore />}
        {activeView === 'orders' && <OrderHistoryView />}
        {activeView === 'admin' && <AdminDashboard />}
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Multi-step Checkout Modal */}
      <CheckoutModal />

      {/* Login & Customer Registration Modal */}
      <AuthModal />

      {/* Notifications and Feedback Toasts */}
      <ToastContainer />

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 tracking-wider">AURA</span>
              <span aria-hidden="true">·</span>
              <span>Online Shopping & Order Management System</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
              <button
                onClick={() => setActiveView('store')}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Storefront
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Order History (TC07)
              </button>
              <button
                onClick={() => {
                  setActiveRole('admin');
                  setActiveView('admin');
                }}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Admin Inventory
              </button>
              <button
                onClick={resetToDemoData}
                className="hover:text-slate-900 text-slate-400 hover:underline transition-colors cursor-pointer"
              >
                Reset Demo Data
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Role: <span className="text-slate-700 font-semibold uppercase">{activeRole}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
