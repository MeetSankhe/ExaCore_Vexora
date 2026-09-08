import React from 'react';
import { loginUserAction, registerUserAction } from '@/app/actions';
import AuthCard from '@/components/AuthCard';

export const metadata = {
  title: 'Sign In & Register | VyaparFlow Export Platform',
  description: 'Sign in to access your export readiness score, compliance documents, and shipment operations.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AuthCard
        loginAction={loginUserAction}
        registerAction={registerUserAction}
      />
    </div>
  );
}
