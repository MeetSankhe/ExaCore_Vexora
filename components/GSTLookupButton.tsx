'use client';

import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertCircle, Building2, MapPin, Sparkles } from 'lucide-react';
import { GSTDetails } from '@/lib/services/sandboxGst';

interface GSTLookupButtonProps {
  gstinValue: string;
  onDetailsFetched?: (details: GSTDetails) => void;
  className?: string;
}

export default function GSTLookupButton({
  gstinValue,
  onDetailsFetched,
  className = '',
}: GSTLookupButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<GSTDetails | null>(null);

  const handleFetch = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);

    const clean = (gstinValue || '').trim().toUpperCase();
    if (!clean || clean.length !== 15) {
      setError('Enter a full 15-character GSTIN first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/gst/verify?gstin=${encodeURIComponent(clean)}`);
      const json = await res.json();

      if (!json.success || !json.data) {
        setError(json.error || 'Failed to fetch GST details.');
        setDetails(null);
      } else {
        setDetails(json.data);
        if (onDetailsFetched) {
          onDetailsFetched(json.data);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching GST details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={handleFetch}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
        title="Lookup official legal name & taxpayer details from Sandbox.co.in GST API"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Verifying GSTIN...</span>
          </>
        ) : (
          <>
            <Search className="w-3.5 h-3.5" />
            <span>Fetch GST Details</span>
          </>
        )}
      </button>

      {/* Error display */}
      {error && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {details && (
        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 space-y-1.5 text-xs animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Verified Taxpayer
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-200 text-emerald-900">
              {details.status}
            </span>
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">
              Entity Legal Name
            </div>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-orange-600 shrink-0" />
              {details.legalName}
            </div>
            {details.tradeName && details.tradeName !== details.legalName && (
              <div className="text-[11px] text-slate-600">
                Trade Name: <span className="font-medium text-slate-800">{details.tradeName}</span>
              </div>
            )}
          </div>

          {details.address && (
            <div className="text-[11px] text-slate-600 flex items-start gap-1 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                {[details.address.city, details.address.state, details.address.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}

          <div className="text-[9px] text-slate-400 pt-1 flex items-center justify-between border-t border-emerald-200">
            <span>Constitution: {details.constitutionOfBusiness || 'Registered Entity'}</span>
            <span className="font-medium text-emerald-700">{details.source}</span>
          </div>
        </div>
      )}
    </div>
  );
}
