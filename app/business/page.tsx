import React from 'react';
import Navbar from '@/components/Navbar';
import { getActiveUser, getAllUsers, updateBusinessRegistrationsAction } from '@/app/actions';
import { Building2, MapPin, CheckCircle2, ShieldCheck, Upload, FileText, AlertTriangle } from 'lucide-react';

export default async function BusinessPage() {
  const { role, user } = await getActiveUser();
  const allUsers = await getAllUsers();
  const business = user?.businesses[0];

  const gstDone = business?.gstStatus?.toLowerCase().includes('active') || business?.gstStatus?.toLowerCase().includes('verified');
  const iecDone = business?.iecStatus?.toLowerCase().includes('active') || business?.iecStatus?.toLowerCase().includes('verified');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 pb-16 font-sans">
      <Navbar currentRole={role} userEmail={user?.email} userName={user?.name} allUsers={allUsers} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              MSME Entity Registration Profile
            </span>
            <h1 className="text-3xl font-black text-slate-900 font-serif">
              Business Profile & Government Registrations
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Location: {business?.location}, {business?.city}, {business?.state}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Profile Readiness:</span>
            <span className="text-xl font-bold text-slate-900">{business?.profileCompletion || 20}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Business Details Overview */}
          <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <Building2 className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {business?.legalName || 'New MSME Exporter'}
                </h3>
                <p className="text-xs text-slate-500">{business?.businessType}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Display Brand Name</span>
                <span className="block font-bold text-slate-900 text-sm">{business?.displayName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Location / Address</span>
                <span className="block font-bold text-slate-900 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" /> {business?.location}, {business?.city}, {business?.state}
                </span>
              </div>

              <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold">GSTIN Registration Status</span>
                {gstDone ? (
                  <span className="block font-bold text-emerald-600 text-sm flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" /> {business?.gstStatus}
                  </span>
                ) : (
                  <span className="block font-bold text-amber-600 text-sm flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-4 h-4" /> Pending Upload (0 Score)
                  </span>
                )}
              </div>

              <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold">IEC Code Status</span>
                {iecDone ? (
                  <span className="block font-bold text-emerald-600 text-sm flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" /> {business?.iecStatus}
                  </span>
                ) : (
                  <span className="block font-bold text-amber-600 text-sm flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-4 h-4" /> Pending Upload (0 Score)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Upload & Verification Form */}
          <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Upload className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Upload Registration Proofs</h3>
                <p className="text-xs text-slate-500">Provide GSTIN and IEC numbers & certificate files to increase score</p>
              </div>
            </div>

            <form action={updateBusinessRegistrationsAction} className="space-y-5 text-xs">
              <input type="hidden" name="businessId" value={business?.id || ''} />

              <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-[#FAF9F6]">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-600" /> GSTIN Registration
                </span>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enter GSTIN Number (15 Digits)</label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="e.g. 27AAACP1234F1Z5"
                    defaultValue={business?.gstStatus?.includes('(') ? business.gstStatus.split('(')[1].replace(')', '') : ''}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Upload GST Certificate (PDF/JPG)</label>
                  <input
                    type="file"
                    name="gstFile"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white text-slate-600 text-xs cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-[#FAF9F6]">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-600" /> Import Export Code (IEC)
                </span>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enter DGFT IEC Code (10 Digits)</label>
                  <input
                    type="text"
                    name="iecCode"
                    placeholder="e.g. 0301099882"
                    defaultValue={business?.iecStatus?.includes('(') ? business.iecStatus.split('(')[1].replace(')', '') : ''}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Upload IEC Certificate (PDF/JPG)</label>
                  <input
                    type="file"
                    name="iecFile"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white text-slate-600 text-xs cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Submit Registration Proofs & Recalculate Score →
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
