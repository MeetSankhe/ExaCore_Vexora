import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/RegisterForm';
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
                redirect('/dashboard');
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
                redirect('/provider');
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
                redirect('/dashboard');
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

        {/* Right Card: Register New Account with Compulsory GSTIN & IEC Code & Live GSTIN Fetch */}
        <RegisterForm action={registerUserAction} />
      </div>
    </div>
  );
}
