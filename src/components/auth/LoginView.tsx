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
import { AccessChannel, AuthResult, UserAccount, AuthSession } from '../../types/auth';
import { DEMO_PRESETS } from '../../data/mockAccounts';
import { useAuth } from '../../context/AuthContext';

interface LoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Channel tab: 'citizen' | 'staff' | 'admin'
  const { signIn } = useAuth();
  const [activeChannel, setActiveChannel] = useState<AccessChannel>('citizen');

  // Citizen OTP flow state
  const [citizenPhone, setCitizenPhone] = useState<string>('+91 9876543210');
  const [citizenOtp, setCitizenOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(45);

  // Staff flow state
  const [staffId, setStaffId] = useState<string>('CW-1048');
  const [staffPassword, setStaffPassword] = useState<string>('demo123');
  const [showStaffPassword, setShowStaffPassword] = useState<boolean>(false);

  // Admin flow state
  const [adminIdentifier, setAdminIdentifier] = useState<string>('ADM-0014');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);

  // Loading & error feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Handle Citizen OTP request
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    // Cross-channel detection guard
    if (/^(CW-|SW-|ADM-)/i.test(citizenPhone.trim())) {
      setAuthError('This credential belongs to municipal personnel. Please switch to the Municipal Staff or Administration login channel.');
      return;
    }

    if (!citizenPhone.trim() || citizenPhone.trim().length < 8) {
      setAuthError('Please enter a valid 10-digit mobile number with +91 country code.');
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

  // Handle Citizen OTP submit
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please verify your OTP code.');
  };

  // Handle Staff login submit
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };

  // Handle Admin login submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };

  // Quick Direct Login Preset (Runs full RBAC pipeline for reviewer convenience)
  const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    setAuthSuccessMsg(`Authenticating ${account.name}...`);
    
    const pass = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, pass, 'citizen');
    setIsLoading(false);
    if (!success) {
      setAuthSuccessMsg(null);
      setAuthError('Preset login failed.');
    }
  };


  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between text-neutral-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header / Civic Identity */}
      <header className="border-b border-neutral-200/80 bg-white/95 backdrop-blur px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-sm ring-1 ring-teal-700/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-neutral-900">CivicWaste</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/70">
                Auth Gateway
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Municipal Corporation SAS Nagar · Ward 14
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-1 rounded-md border border-neutral-200">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <span className="text-xs font-mono text-neutral-400">v4.2</span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
            {/* Card Header */}
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

            {/* ACCESS CHANNEL SELECTOR */}
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
                {/* 1. Citizen */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel('citizen');
                    setAuthError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    activeChannel === 'citizen'
                      ? 'bg-white text-neutral-900 shadow-sm font-semibold border border-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <Smartphone className={`w-4 h-4 mb-1 ${activeChannel === 'citizen' ? 'text-teal-600' : 'text-neutral-500'}`} />
                  <span>Citizen</span>
                </button>

                {/* 2. Municipal Staff */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel('staff');
                    setAuthError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    activeChannel === 'staff'
                      ? 'bg-white text-neutral-900 shadow-sm font-semibold border border-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <Truck className={`w-4 h-4 mb-1 ${activeChannel === 'staff' ? 'text-teal-600' : 'text-neutral-500'}`} />
                  <span>Municipal Staff</span>
                </button>

                {/* 3. Administration */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel('admin');
                    setAuthError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    activeChannel === 'admin'
                      ? 'bg-white text-neutral-900 shadow-sm font-semibold border border-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <Building2 className={`w-4 h-4 mb-1 ${activeChannel === 'admin' ? 'text-teal-600' : 'text-neutral-500'}`} />
                  <span>Administration</span>
                </button>
              </div>

              {/* Explanatory RBAC principle note */}
              <div className="mt-3.5 flex items-start gap-2 bg-neutral-50 px-3.5 py-2.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-neutral-800">RBAC Architecture:</strong> These are access channels, not user-selected roles. The system strictly inspects your verified account records to determine your authorized role and operational privileges.
                </p>
              </div>
            </div>

            {/* Error & Success Feedback Banners */}
            <div className="px-6 sm:px-8 pt-3">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{authError}</div>
                </div>
              )}
              {authSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{authSuccessMsg}</div>
                </div>
              )}
            </div>

            {/* CHANNEL FORM BODY */}
            <div className="p-6 sm:p-8 pt-4">
              {/* ========================================================= */}
              {/* CHANNEL 1: CITIZEN (Mobile + OTP) */}
              {/* ========================================================= */}
              {activeChannel === 'citizen' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-mono text-sm">
                            +91
                          </div>
                          <input
                            type="text"
                            value={citizenPhone.replace(/^\+91\s*/, '')}
                            onChange={(e) => setCitizenPhone(`+91 ${e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}`)}
                            placeholder="98765 43210"
                            className="w-full pl-14 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                            autoFocus
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1.5 flex items-center justify-between">
                          <span>Registered with MC SAS Nagar Citizen Registry</span>
                          <button
                            type="button"
                            onClick={() => setCitizenPhone('+91 9876543210')}
                            className="text-teal-700 hover:text-teal-900 font-medium underline"
                          >
                            Use Demo Phone
                          </button>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-teal-700/20"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying registry...
                          </span>
                        ) : (
                          <>
                            <span>Continue</span>
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
                          Change Number
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => setCitizenOtp('123456')}
                            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3" />
                            Fill Demo OTP (123456)
                          </button>
                        </div>

                        <input
                          type="text"
                          maxLength={6}
                          value={citizenOtp}
                          onChange={(e) => setCitizenOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="123456"
                          className="w-full text-center py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-xl font-mono font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                          autoFocus
                        />
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
                          <span>Prototype OTP code: <strong>123456</strong></span>
                          <span>Resend in {countdown}s</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || citizenOtp.length < 6}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Authenticating account...
                          </span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Verify & Enter Citizen Portal</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* CHANNEL 2: MUNICIPAL STAFF (Collection or Sanitation) */}
              {/* ========================================================= */}
              {activeChannel === 'staff' && (
                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Employee ID / Badge Code
                    </label>
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                      placeholder="CW-1048 or SW-2031"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      autoFocus
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] text-neutral-500">Quick fill demo staff:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setStaffId('CW-1048');
                          setStaffPassword('demo123');
                        }}
                        className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                      >
                        CW-1048 (Collection)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStaffId('SW-2031');
                          setStaffPassword('demo123');
                        }}
                        className="text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-2 py-0.5 rounded-md"
                      >
                        SW-2031 (Sanitation)
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Staff Password
                      </label>
                      <span className="text-[11px] text-neutral-400">Default: demo123</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? 'text' : 'password'}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="••••••••"
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

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-600 flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      The system inspects your employee record and automatically assigns you to either <strong>Waste Collection</strong> or <strong>Sanitation Operations</strong>. You do not manually choose.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !staffId.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
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

              {/* ========================================================= */}
              {/* CHANNEL 3: MUNICIPALITY ADMINISTRATION */}
              {/* ========================================================= */}
              {activeChannel === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Administrator ID or Official Email
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminIdentifier('ADM-0014');
                          setAdminPassword('admin123');
                        }}
                        className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                      >
                        Fill Admin Demo (ADM-0014)
                      </button>
                    </div>
                    <input
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="ADM-0014 or priya.mehta@sasnagar.gov.in"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      autoFocus
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Admin Master Password
                      </label>
                      <span className="text-[11px] text-neutral-400">Default: admin123</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
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

            {/* REVIEWER FAST-PASS BAR (VC & MUNICIPAL DEMO SHORTCUT) */}
            <div className="border-t border-neutral-200 bg-neutral-50/90 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Demo Fast-Pass (Instant Persona Switching)
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700">
                  VC / Evaluator
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-3.5 leading-relaxed">
                Click any persona below to authenticate with their official account record. The RBAC engine resolves their role and redirects to their dedicated operational view:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.account)}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-teal-500 hover:shadow-sm text-left transition-all group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-neutral-900 group-hover:text-teal-700">
                        {preset.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono truncate w-full">
                      {preset.account.identifier}
                    </span>
                    <span className="text-[10px] text-neutral-600 font-medium truncate w-full mt-0.5">
                      {preset.account.name}
                    </span>
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-6 text-xs text-neutral-500 space-y-1">
            <p>Municipal Corporation SAS Nagar · Smart City Waste Infrastructure</p>
            <p className="text-[11px] text-neutral-400">Confidential prototype for municipal evaluation & venture capital presentation.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
