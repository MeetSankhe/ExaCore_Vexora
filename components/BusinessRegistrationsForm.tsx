'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import GSTLookupButton from '@/components/GSTLookupButton';
import { GSTDetails } from '@/lib/services/sandboxGst';

interface BusinessRegistrationsFormProps {
  businessId: string;
  defaultGstin: string;
  defaultIec: string;
  action: (formData: FormData) => Promise<void>;
}

export default function BusinessRegistrationsForm({
  businessId,
  defaultGstin,
  defaultIec,
  action,
}: BusinessRegistrationsFormProps) {
  const [gstin, setGstin] = useState(defaultGstin || '');
  const [iec, setIec] = useState(defaultIec || '');
  const [fetchedDetails, setFetchedDetails] = useState<GSTDetails | null>(null);

  const handleGSTFetched = (details: GSTDetails) => {
    setFetchedDetails(details);
  };

  return (
    <form action={action} className="space-y-5 text-xs">
      <input type="hidden" name="businessId" value={businessId} />

      <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-[#FAF9F6]">
        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-orange-600" /> GSTIN Registration
        </span>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Enter GSTIN Number (15 Characters)</label>
          <input
            type="text"
            name="gstNumber"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="e.g. 27AAACP1234F1Z5"
            pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[A-Za-z0-9]{1}[Zz]{1}[A-Za-z0-9]{1}"
            title="GSTIN format: 2 digits + 5 letters (PAN) + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric"
            maxLength={15}
            minLength={15}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs uppercase invalid:[&:not(:placeholder-shown)]:border-red-400"
            required
          />
          <p className="text-[10px] text-slate-500 mt-1 mb-2">
            Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric
          </p>

          {/* Real-time GST Verification Button */}
          <GSTLookupButton
            gstinValue={gstin}
            onDetailsFetched={handleGSTFetched}
          />
        </div>
        <div className="pt-2">
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
            value={iec}
            onChange={(e) => setIec(e.target.value)}
            placeholder="e.g. 0301099882"
            pattern="[0-9]{10}"
            title="IEC Code must be exactly 10 digits"
            maxLength={10}
            minLength={10}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs uppercase invalid:[&:not(:placeholder-shown)]:border-red-400"
            required
          />
          <p className="text-[10px] text-slate-500 mt-0.5">Must be exactly 10 digits (e.g. 0301099882)</p>
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
  );
}
