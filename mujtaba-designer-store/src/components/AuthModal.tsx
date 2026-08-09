import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, KeyRound, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { User, AdminUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUser: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessUser,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Sign Up Form States
  const [gmail, setGmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification States
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // General States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin Form States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Step 1: Send OTP to Gmail
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!gmail || !firstName || !password) {
      setErrorMsg('Please fill in Gmail, First Name, and Password.');
      return;
    }

    if (!gmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail address.');
      return;
    }

    setLoading(true);

    try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gmail, firstName, lastName, password }),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { parseJSONSafe } = await import('../utils/response');
        const data = await parseJSONSafe(res);

        if (!res.ok) {
          const errorMessage = data?.error || data?.message || data?._text || `Request failed with status ${res.status}`;
          throw new Error(errorMessage || 'Failed to send verification code.');
        }

        setStep('otp');
        setSuccessMsg((data && data.message) || `Verification code sent to ${gmail}`);
        if (data && data.debugOtp) {
          setDebugOtp(data.debugOtp);
        }
    } catch (err: any) {
      const fallbackMessage = err?.message || 'Error communicating with authentication server.';
      const message = fallbackMessage.includes('fetch') || fallbackMessage.includes('Failed to fetch')
        ? 'Unable to reach the authentication server. Please try again in a moment.'
        : fallbackMessage;
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gmail, code: otpCode }),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { parseJSONSafe } = await import('../utils/response');
        const data = await parseJSONSafe(res);

        if (!res.ok) {
          const errorMessage = data?.error || data?.message || data?._text || `Request failed with status ${res.status}`;
          throw new Error(errorMessage || 'Verification failed.');
        }

        setSuccessMsg('Account verified and created successfully!');
        setTimeout(() => {
          onSuccessUser(data.user, data.token);
          onClose();
        }, 800);
    } catch (err: any) {
      const fallbackMessage = err?.message || 'Verification error.';
      const message = fallbackMessage.includes('fetch') || fallbackMessage.includes('Failed to fetch')
        ? 'Unable to reach the authentication server. Please try again in a moment.'
        : fallbackMessage;
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // User Login
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!gmail || !password) {
      setErrorMsg('Please enter both Gmail and Password.');
      return;
    }

    setLoading(true);

    try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gmail, password }),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { parseJSONSafe } = await import('../utils/response');
        const data = await parseJSONSafe(res);

        if (!res.ok) {
          const errorMessage = data?.error || data?.message || data?._text || `Request failed with status ${res.status}`;
          throw new Error(errorMessage || 'Login failed.');
        }

        setSuccessMsg('Login successful! Welcome back.');
        setTimeout(() => {
          onSuccessUser(data.user, data.token);
          onClose();
        }, 600);
    } catch (err: any) {
      const fallbackMessage = err?.message || 'Invalid Gmail or password.';
      const message = fallbackMessage.includes('fetch') || fallbackMessage.includes('Failed to fetch')
        ? 'Unable to reach the authentication server. Please try again in a moment.'
        : fallbackMessage;
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-slate-950/90 text-white p-6 flex justify-between items-start border-b border-slate-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-400 block mb-1">
              MUJTABA DESIGNER
            </span>
            <h3 className="font-serif text-xl font-bold tracking-wide text-white">
              {activeTab === 'signup' && (step === 'form' ? 'Customer Sign Up' : 'Verify Gmail OTP')}
              {activeTab === 'login' && 'Customer Login'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Switches */}
        <div className="grid grid-cols-2 bg-stone-100 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => {
              setActiveTab('signup');
              setStep('form');
              setErrorMsg('');
            }}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800 font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800 font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {/* Notifications */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN UP & OTP VERIFICATION */}
          {activeTab === 'signup' && (
            <>
              {step === 'form' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                      Gmail Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          placeholder="Mujtaba"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Khan"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Verification Code to Gmail <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Entry */
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-amber-50/80 p-3.5 border border-amber-200 text-xs text-amber-900 rounded-none mb-2">
                    <p className="font-medium">
                      A 6-digit OTP verification code was sent to: <strong>{gmail}</strong>
                    </p>
                    <p className="text-[11px] text-amber-800/80 mt-1">
                      Please check your inbox / spam folder and enter the code below.
                    </p>
                  </div>

                  {/* Debug OTP Convenience Banner */}

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                      Enter 6-Digit OTP Code *
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-base font-mono font-bold tracking-[0.4em] text-center border border-stone-300 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="w-1/3 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase font-semibold hover:bg-stone-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 bg-slate-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify & Activate Account'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* TAB 2: CUSTOMER LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                  Gmail Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Log In to Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
