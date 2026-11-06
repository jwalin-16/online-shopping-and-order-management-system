import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, Shield, ChevronDown, LogOut, Package, Store, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeRole,
    setActiveRole,
    cartCount,
    setIsCartOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
    quickLogin,
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveView(activeRole === 'admin' ? 'admin' : 'store')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base tracking-wider transition-transform group-hover:scale-105">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                AURA
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('store')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 ${
              activeView === 'store'
                ? 'text-slate-950 font-semibold border-b-2 border-slate-950 -mb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            Catalogue
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 ${
              activeView === 'orders'
                ? 'text-slate-950 font-semibold border-b-2 border-slate-950 -mb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Order History
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') setActiveRole('admin');
              setActiveView('admin');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 ${
              activeView === 'admin'
                ? 'text-slate-950 font-semibold border-b-2 border-slate-950 -mb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin Hub
          </button>
        </nav>

        {/* Zone 3: Role Switcher & Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Prominent Role Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setActiveRole('customer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRole === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Test Customer Perspective"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Test Admin Perspective"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Cart Icon Button (Customer) */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="relative p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-950 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-150">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Role: <span className="font-semibold capitalize text-slate-900">{currentUser.role}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveView('store');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Store className="w-4 h-4 text-slate-500" />
                    Browse Catalogue
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('orders');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-slate-500" />
                    Order History (TC07)
                  </button>
                  <button
                    onClick={() => {
                      setActiveRole('admin');
                      setActiveView('admin');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    Admin Inventory & Orders
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <div className="px-4 py-1.5 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    Quick Switch Role
                  </div>
                  <button
                    onClick={() => {
                      quickLogin('customer');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>Switch to Alex (Customer)</span>
                    {currentUser.role === 'customer' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      quickLogin('admin');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>Switch to Jordan (Admin)</span>
                    {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 px-4 py-2 bg-slate-50/90 text-xs">
        <button
          onClick={() => setActiveView('store')}
          className={`flex items-center gap-1 py-1 px-2 rounded-md ${
            activeView === 'store' ? 'text-slate-900 font-bold bg-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          Catalogue
        </button>
        <button
          onClick={() => setActiveView('orders')}
          className={`flex items-center gap-1 py-1 px-2 rounded-md ${
            activeView === 'orders' ? 'text-slate-900 font-bold bg-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Orders
        </button>
        <button
          onClick={() => {
            setActiveRole('admin');
            setActiveView('admin');
          }}
          className={`flex items-center gap-1 py-1 px-2 rounded-md ${
            activeView === 'admin' ? 'text-slate-900 font-bold bg-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </button>
      </div>
    </header>
  );
};
