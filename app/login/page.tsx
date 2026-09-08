import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getActiveUser, switchUserRoleAction, registerUserAction } from '@/app/actions';
import { Ship, UserPlus, Building2, Truck, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export default async function LoginPage() {
  const { role, user } = await getActiveUser();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-sans pb-16">
      <Navbar currentRole={role} userEmail={user?.email} userName={user?.name} />

      <div className="max-w-4xl mx-auto my-auto py-12 px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Card: 1-Click Quick Demo Switcher */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-orange-600/20">
              <Ship className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">VyaparFlow Quick Login</h1>
            <p className="text-xs text-slate-500">
              Evaluator 1-Click Persona Sign In
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <form
              action={async () => {
                'use server';
                await switchUserRoleAction('MSME');
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Palghar MSME Exporter Demo
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <form
              action={async () => {
                'use server';
                await switchUserRoleAction('PROVIDER');
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Service Provider Portal Demo
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <form
              action={async () => {
                'use server';
                await switchUserRoleAction('ADMIN');
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-between border border-slate-700"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-400" /> Platform Admin Operator Demo
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <Link href="/dashboard" className="text-xs text-orange-600 font-bold hover:underline">
              Continue directly to Dashboard →
            </Link>
          </div>
        </div>

        {/* Right Card: Register New Account with Compulsory GSTIN & IEC Code */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <UserPlus className="w-6 h-6 text-orange-600" />
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">Create MSME Account</h2>
              <p className="text-xs text-slate-500">Compulsory GSTIN & IEC Code registration for exporters</p>
            </div>
          </div>

          <form action={registerUserAction} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Ramesh Shah"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. ramesh@palghar-exports.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Role *</label>
              <select
                name="role"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                required
              >
                <option value="MSME">MSME Exporter</option>
                <option value="PROVIDER">Service Provider (Freight / Lab / CHA)</option>
                <option value="ADMIN">Platform Admin</option>
              </select>
            </div>

            {/* Business Type / Industry Selector */}
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
              <p className="text-[10px] text-blue-700">
                Your certificates, documents, and compliance requirements will be generated based on this selection.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business / Company Name *</label>
              <input
                type="text"
                name="businessName"
                placeholder="e.g. Konkan Agro Products Pvt Ltd"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                required
              />
            </div>

            {/* Compulsory GSTIN & IEC Fields with Format Validation */}
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
                  placeholder="e.g. 27AAACP1234F1Z5"
                  pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[A-Za-z0-9]{1}[Zz]{1}[A-Za-z0-9]{1}"
                  title="GSTIN format: 2 digits (state code) + 5 letters (PAN) + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric. Example: 27AAACP1234F1Z5"
                  maxLength={15}
                  minLength={15}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium uppercase text-xs invalid:[&:not(:placeholder-shown)]:border-red-400 invalid:[&:not(:placeholder-shown)]:bg-red-50/50"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  DGFT Import Export Code (IEC - 10 Digits) <span className="text-red-600 font-bold">* Compulsory</span>
                </label>
                <input
                  type="text"
                  name="iecCode"
                  placeholder="e.g. 0301099882"
                  pattern="[0-9]{10}"
                  title="IEC Code must be exactly 10 digits. Example: 0301099882"
                  maxLength={10}
                  minLength={10}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium uppercase text-xs invalid:[&:not(:placeholder-shown)]:border-red-400 invalid:[&:not(:placeholder-shown)]:bg-red-50/50"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Must be exactly 10 digits (e.g. 0301099882)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  defaultValue="Palghar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  defaultValue="Maharashtra"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Create MSME Account & Register GSTIN/IEC →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
