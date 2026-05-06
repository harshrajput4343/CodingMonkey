'use client';

import React, { useState } from 'react';
import { X, Github, Mail, Eye, EyeOff, Keyboard } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate auth delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (mode === 'signin') {
      if (email && password) {
        // In production, integrate with Supabase / NextAuth here
        setError('Authentication service coming soon. Check back later!');
      } else {
        setError('Please fill in all fields.');
      }
    } else {
      if (email && password && username) {
        setError('Registration service coming soon. Check back later!');
      } else {
        setError('Please fill in all fields.');
      }
    }
    setIsLoading(false);
  };

  const handleOAuthClick = (provider: string) => {
    setError(`${provider} authentication coming soon!`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-bg border border-sub-text/15 rounded-2xl shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-sub-text hover:text-text hover:bg-sub-bg transition-all"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center pt-8 pb-4 px-8">
            <div className="flex items-center gap-2 mb-2">
              <Keyboard className="w-6 h-6 text-main" />
              <span className="text-lg font-bold text-text tracking-tight">
                coding<span className="text-main">Monkey</span>
              </span>
            </div>
            <p className="text-sub-text text-sm">
              {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mx-8 mb-6 bg-sub-bg/50 rounded-lg p-0.5">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'signin' ? 'bg-sub-bg text-main shadow-sm' : 'text-sub-text hover:text-text'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'signup' ? 'bg-sub-bg text-main shadow-sm' : 'text-sub-text hover:text-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 flex flex-col gap-4">
            {/* OAuth buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleOAuthClick('GitHub')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-sub-bg/60 border border-sub-text/15 text-sub-text hover:text-text hover:border-sub-text/30 transition-all text-xs font-medium"
              >
                <Github size={14} />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthClick('Google')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-sub-bg/60 border border-sub-text/15 text-sub-text hover:text-text hover:border-sub-text/30 transition-all text-xs font-medium"
              >
                <Mail size={14} />
                <span>Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-sub-text/15" />
              <span className="text-[10px] text-sub-text/50 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-sub-text/15" />
            </div>

            {/* Username (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] text-sub-text uppercase tracking-widest mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="monkeytyper42"
                  className="w-full bg-sub-bg/40 border border-sub-text/15 rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-sub-text/30 focus:outline-none focus:border-main/50 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] text-sub-text uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-sub-bg/40 border border-sub-text/15 rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-sub-text/30 focus:outline-none focus:border-main/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] text-sub-text uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sub-bg/40 border border-sub-text/15 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-text placeholder:text-sub-text/30 focus:outline-none focus:border-main/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-xs text-center py-2.5 px-3 rounded-lg bg-main/10 text-main border border-main/20">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-main hover:bg-main/90 text-bg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                </span>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {mode === 'signin' && (
              <button type="button" className="text-xs text-sub-text hover:text-main transition-colors text-center">
                Forgot password?
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
