'use client';

import React, { useState } from 'react';
import {
  Ship,
  LogIn,
  UserPlus,
  Building2,
  FileText,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';
import GSTLookupButton from '@/components/GSTLookupButton';
import { GSTDetails } from '@/lib/services/sandboxGst';

interface AuthCardProps {
  loginAction: (formData: FormData) => Promise<void>;
  registerAction: (formData: FormData) => Promise<void>;
}

export default function AuthCard({ loginAction, registerAction }: AuthCardProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<'MSME' | 'PROVIDER' | 'ADMIN'>('MSME');

  // MSME Form states
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Palghar');
  const [state, setState] = useState('Maharashtra');

  const handleGSTFetched = (details: GSTDetails) => {
    if (details.legalName) setBusinessName(details.legalName);
    if (details.address?.city) setCity(details.address.city);
    if (details.address?.state) setState(details.address.state);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black mx-auto shadow-lg shadow-orange-600/30">
            <Ship className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight font-serif uppercase text-white">
              VYAPARFLOW
            </h1>
            <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
              Export Logistics Readiness & Compliance Platform
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mode === 'signin'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8">
        {mode === 'signin' ? (
          /* ============================================================ */
          /*                       SIGN IN FORM                           */
          /* ============================================================ */
          <form action={loginAction} className="space-y-5 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-serif text-slate-900">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500">
                Enter your credentials to access your export readiness dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. admin@vyaparflow.com or ramesh@exports.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password (default: password123)"
                    defaultValue="password123"
                    required
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Create a new account →
              </button>
            </div>
          </form>
        ) : (
          /* ============================================================ */
          /*                     REGISTRATION FORM                        */
          /* ============================================================ */
          <form action={registerAction} className="space-y-4 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-serif text-slate-900">
                {role === 'ADMIN'
                  ? 'Platform Admin Registration'
                  : role === 'PROVIDER'
                  ? 'Service Provider Registration'
                  : 'Create MSME Exporter Account'}
              </h2>
              <p className="text-xs text-slate-500">
                {role === 'ADMIN'
                  ? 'Superuser console access — no business details required'
                  : role === 'PROVIDER'
                  ? 'Freight, testing lab & customs house agent partner'
                  : 'Compulsory GSTIN & IEC registration for exporters'}
              </p>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Role *
              </label>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'MSME' | 'PROVIDER' | 'ADMIN')}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs cursor-pointer focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="MSME">🏢 MSME Exporter (Compulsory GSTIN & IEC)</option>
                <option value="ADMIN">🛡️ Platform Admin Operator (No GSTIN / Business info)</option>
                <option value="PROVIDER">🚢 Service Provider (Freight / Lab / CHA)</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder={
                  role === 'ADMIN'
                    ? 'e.g. Platform Administrator'
                    : role === 'PROVIDER'
                    ? 'e.g. Vikram Sharma'
                    : 'e.g. Ramesh Shah'
                }
                defaultValue={role === 'ADMIN' ? 'Platform Administrator' : ''}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder={
                  role === 'ADMIN'
                    ? 'e.g. admin@vyaparflow.com'
                    : role === 'PROVIDER'
                    ? 'e.g. contact@freightcorp.com'
                    : 'e.g. ramesh@palghar-exports.com'
                }
                defaultValue={role === 'ADMIN' ? 'admin@vyaparflow.com' : ''}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                If your email is already registered, submitting will automatically log you in without error.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Choose a password (default: password123)"
                defaultValue="password123"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
              />
            </div>

            {/* --- ADMIN ROLE: EXEMPTION BANNER --- */}
            {role === 'ADMIN' && (
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 space-y-2.5">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Platform Administrator Privileges</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Platform administrators oversee compliance rules, document approval desks, and platform audit trails.
                </p>
                <div className="flex items-start gap-2 pt-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>
                    <strong>Exempt:</strong> GSTIN, IEC code, type of business, and company legal name are not required for administrator accounts.
                  </span>
                </div>
              </div>
            )}

            {/* --- PROVIDER ROLE --- */}
            {role === 'PROVIDER' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block font-semibold text-slate-800">
                    Provider Organization Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="e.g. SwiftGlobe Freight Logistics Pvt Ltd"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    required
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <label className="block font-semibold text-blue-900">
                    Service Specialization *
                  </label>
                  <select
                    name="businessCategory"
                    className="w-full p-2.5 rounded-xl border border-blue-300 bg-white font-medium text-xs"
                    required
                  >
                    <option value="Steel">🚢 International Ocean & Air Freight Forwarding</option>
                    <option value="Food">🧪 Quality Testing & Inspection Laboratory</option>
                    <option value="Agricultural Goods">📋 Customs House Agent (CHA)</option>
                  </select>
                </div>
              </div>
            )}

            {/* --- MSME ROLE (FULL GSTIN & IEC) --- */}
            {role === 'MSME' && (
              <>
                {/* Type of Business */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" /> Type of Business *
                  </span>
                  <select
                    name="businessCategory"
                    className="w-full p-2.5 rounded-xl border border-blue-300 bg-white font-medium text-xs"
                    required
                  >
                    <option value="">— Select your business type —</option>
                    <option value="Steel">🏗️ Steel & Metal Products</option>
                    <option value="Food">🍱 Food & Processed Foods</option>
                    <option value="Agricultural Goods">🌾 Agricultural Goods</option>
                    <option value="Diamonds">💎 Diamonds & Precious Stones</option>
                    <option value="Gold">🪙 Gold & Precious Metals</option>
                  </select>
                </div>

                {/* Mandatory GSTIN & IEC */}
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-3">
                  <span className="font-bold text-orange-900 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-600" /> Mandatory Government Registrations
                  </span>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      GSTIN Number (15 Characters) <span className="text-red-600 font-bold">* Compulsory</span>
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AAACP1234F1Z5"
                      pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[A-Za-z0-9]{1}[Zz]{1}[A-Za-z0-9]{1}"
                      maxLength={15}
                      minLength={15}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium uppercase text-xs"
                      required
                    />
                    <div className="mt-2">
                      <GSTLookupButton gstinValue={gstin} onDetailsFetched={handleGSTFetched} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-200/60">
                    <label className="block font-semibold text-slate-800 mb-1">
                      DGFT Import Export Code (IEC - 10 Digits) <span className="text-red-600 font-bold">* Compulsory</span>
                    </label>
                    <input
                      type="text"
                      name="iecCode"
                      placeholder="e.g. 0301099882"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium uppercase text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business / Company Legal Name *
                    {businessName && (
                      <span className="ml-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Auto-filled from GST Portal
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Konkan Agro Products Pvt Ltd"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    required
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                role === 'ADMIN'
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : role === 'PROVIDER'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Sign In / Enter Dashboard as Admin →
                </>
              ) : role === 'PROVIDER' ? (
                <>
                  <Truck className="w-4 h-4" />
                  Create Service Provider Account →
                </>
              ) : (
                'Create MSME Account & Register GSTIN/IEC →'
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Sign in to existing account →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
