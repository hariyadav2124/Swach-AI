import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  UserCheck, 
  Shield, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Truck, 
  Droplets, 
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import { AccessChannel, AuthSession } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface LoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { signIn } = useAuth();
  const [activeChannel, setActiveChannel] = useState<AccessChannel>('citizen');

  // Citizen OTP flow state
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [citizenOtp, setCitizenOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(45);

  // Staff flow state
  const [staffId, setStaffId] = useState<string>('');
  const [staffPassword, setStaffPassword] = useState<string>('');
  const [showStaffPassword, setShowStaffPassword] = useState<boolean>(false);

  // Admin flow state
  const [adminIdentifier, setAdminIdentifier] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);

  // Loading & error feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (/^(CW-|SW-|ADM-)/i.test(citizenPhone.trim())) {
      setAuthError('This credential belongs to municipal personnel. Please switch to the Municipal Staff or Administration login channel.');
      return;
    }

    if (!citizenPhone.trim() || citizenPhone.trim().length < 8) {
      setAuthError('Please enter a valid mobile number or email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setCitizenOtp('');
      setCountdown(45);
    }, 450);
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please verify your OTP code.');
    }
  };

  const handleStaffSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please check your staff ID and password.');
    }
  };

  const handleAdminSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please check your admin ID and password.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans selection:bg-teal-200">
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-lg leading-none tracking-tighter">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 leading-tight tracking-tight">SwachAI</span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase tracking-widest leading-none">CivicWaste</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Citizen Portal</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <span>Field Operations</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <span className="text-xs font-mono text-neutral-400">v4.2</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
            <div className="p-6 sm:p-8 pb-5 border-b border-neutral-100 bg-gradient-to-b from-neutral-50/70 to-white">
              <div className="flex items-center gap-2 mb-2 text-teal-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Unified Platform Sign-In</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Sign in to CivicWaste
              </h1>
              <p className="text-sm text-neutral-600 mt-1.5">
                Smart community waste management for cleaner cities. Choose how you access your services.
              </p>
            </div>

            <div className="px-6 sm:px-8 pt-5 pb-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Access Channel
                </span>
                <span className="text-[11px] text-neutral-500">
                  Select your login portal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-neutral-100/90 p-1.5 rounded-xl border border-neutral-200/80">
                <button
                  type="button"
                  onClick={() => { setActiveChannel('citizen'); setAuthError(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeChannel === 'citizen' ? 'bg-white text-teal-800 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveChannel('staff'); setAuthError(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeChannel === 'staff' ? 'bg-white text-teal-800 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveChannel('admin'); setAuthError(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeChannel === 'admin' ? 'bg-white text-teal-800 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-4">
              {authError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">{authError}</p>
                </div>
              )}

              {authSuccessMsg && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">{authSuccessMsg}</p>
                </div>
              )}

              {activeChannel === 'citizen' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 block">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={citizenPhone}
                            onChange={(e) => setCitizenPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full px-3.5 pl-10 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-shadow"
                            autoFocus
                          />
                          <Smartphone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !citizenPhone.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-teal-900/20"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending OTP...
                          </span>
                        ) : (
                          <>
                            <span>Request OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                      <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-neutral-600">Verification code sent to:</p>
                          <p className="text-sm font-bold text-neutral-900 font-mono">{citizenPhone}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline"
                        >
                          Change
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            disabled={countdown > 0}
                            className="text-[11px] font-semibold text-neutral-500 hover:text-teal-700 disabled:opacity-50 disabled:hover:text-neutral-500"
                          >
                            Resend {countdown > 0 ? `(${countdown}s)` : ''}
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={citizenOtp}
                          onChange={(e) => setCitizenOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="??????"
                          className="w-full px-3.5 py-2.5 text-center tracking-[0.5em] bg-white border border-neutral-300 rounded-xl text-neutral-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || citizenOtp.length !== 6}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-teal-900/20"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            <span>Verify & Sign In</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeChannel === 'staff' && (
                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 block">
                      Staff ID or Email
                    </label>
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      placeholder="e.g. CW-1048 or email"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 block">
                      Secure Password
                    </label>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? 'text' : 'password'}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="????????"
                        className="w-full px-3.5 pr-10 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                      >
                        {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !staffId.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-teal-900/20 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating staff roster...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to Operational Workspace</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeChannel === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 block">
                      Administrator ID or Official Email
                    </label>
                    <input
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="ADM-0014 or admin@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 block">
                      Admin Master Password
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="????????"
                        className="w-full px-3.5 pr-10 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Authorized Executive Terminal:</strong> Grants oversight over Ward 14 fleet dispatch, AI overflow predictions, citizen complaint escalations, and budget KPIs.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !adminIdentifier.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-teal-900/20"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying Executive Clearance...
                      </span>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Sign In to Command Center</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="text-center mt-6 text-xs text-neutral-500 space-y-1">
            <p>Municipal Corporation SAS Nagar A Smart City Waste Infrastructure</p>
            <p className="text-[11px] text-neutral-400">Production Build - Supabase Integrated.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
