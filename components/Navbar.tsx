'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUserAction } from '@/app/actions';
import {
  Ship,
  LayoutDashboard,
  Building2,
  FileCheck2,
  FileText,
  Award,
  Box,
  Truck,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'MSME' | 'PROVIDER' | 'ADMIN';
  userEmail?: string;
  userName?: string;
  allUsers?: Array<{
    id: string;
    name: string;
    email: string;
    role: 'MSME' | 'PROVIDER' | 'ADMIN';
    displayName: string;
  }>;
}

export default function Navbar({ currentRole, userEmail, userName }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-serif uppercase">
                  VYAPARFLOW
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                  Export Logistics Readiness Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links based on role */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentRole === 'MSME' && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/dashboard'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/readiness"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/readiness'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Readiness Score
                </Link>

                <Link
                  href="/documents"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/documents'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Documents
                </Link>

                <Link
                  href="/certifications"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/certifications'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Certifications
                </Link>

                <Link
                  href="/packaging"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/packaging'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  Packaging
                </Link>

                <Link
                  href="/shipments"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/shipments')
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Shipments
                </Link>
              </>
            )}

            {currentRole === 'PROVIDER' && (
              <>
                <Link
                  href="/provider"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/provider'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Task Queue Portal
                </Link>

                <Link
                  href="/shipments"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/shipments')
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Ship className="w-4 h-4" />
                  All Shipments
                </Link>
              </>
            )}

            {currentRole === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/admin'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Overview
                </Link>

                <Link
                  href="/documents"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    pathname === '/documents'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Doc Verification
                </Link>
              </>
            )}
          </nav>

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userName ? userName.charAt(0).toUpperCase() : currentRole.charAt(0)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 leading-tight">
                    {userName || 'Active User'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      currentRole === 'ADMIN'
                        ? 'bg-slate-900 text-orange-400'
                        : currentRole === 'PROVIDER'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {currentRole}
                  </span>
                </div>
                <span className="block text-slate-500 text-[10px]">
                  {userEmail || `${currentRole.toLowerCase()}@vyaparflow.com`}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <form action={logoutUserAction}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Log out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
