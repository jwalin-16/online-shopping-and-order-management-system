import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    quickLogin,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authModalMode === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      login(email.trim(), password);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (!password || password.length < 4) {
        setError('Password should be at least 4 characters long');
        return;
      }
      register(name.trim(), email.trim(), password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-2">
            A
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {authModalMode === 'login' ? 'Sign In to AURA' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {authModalMode === 'login'
              ? 'Enter your credentials or choose a quick evaluation profile'
              : 'Register to manage orders, track shipments, and save cart items'}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Register (TC01)
          </button>
        </div>

        {error && (
          <div className="p-2.5 mt-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg">
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {authModalMode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {authModalMode === 'login' ? 'Sign In' : 'Create Account (TC01)'}
          </button>
        </form>

        {/* 1-Click Fast Testing Logins */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Test Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin('customer')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Alex Morgan</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Customer Role</span>
            </button>

            <button
              onClick={() => quickLogin('admin')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Jordan Lee</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Admin Role</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
