import React, { useState } from 'react';
import {
  Save,
  Database,
  CheckCircle2,
  Zap,
  CloudOff,
  Upload,
  RotateCcw,
  Wallet,
} from 'lucide-react';
import { TripSettings, Member, Expense } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsViewProps {
  settings: TripSettings;
  members: Member[];
  expenses: Expense[];
  onSaveSettings: (newSettings: TripSettings) => void;
  onResetData: () => void;
  onImportData: (importedData: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  members,
  expenses,
  onSaveSettings,
  onResetData,
  onImportData,
}) => {
  const [tripName, setTripName] = useState(settings.trip_name);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [destination, setDestination] = useState(settings.destination);
  const [startDate, setStartDate] = useState(settings.start_date);
  const [endDate, setEndDate] = useState(settings.end_date);
  const [contributionPerPerson, setContributionPerPerson] = useState<string>(
    String(settings.contribution_per_person || 4000)
  );
  const [coverImage, setCoverImage] = useState(settings.cover_image || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TripSettings = {
      trip_name: tripName.trim() || 'Ujjain Trip',
      subtitle: subtitle.trim() || 'Boys Trip • 2026',
      destination: destination.trim() || 'Ujjain, Madhya Pradesh',
      start_date: startDate || '2026-08-28',
      end_date: endDate || '2026-09-2',
      contribution_per_person: Number(contributionPerPerson) || 4000,
      currency: '₹',
      cover_image: coverImage.trim() || undefined,
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const data = {
      settings,
      members,
      expenses,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ujjain_Trip_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        alert('Trip data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeup">
      {/* ── 1. Header ─────────────────────────────────── */}
      <div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Trip Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure destination, fixed contribution amount, sync & backup
        </p>
      </div>

      {/* ── 2. Settings Form ──────────────────────────── */}
      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              🛕
            </div>
            <h3 className="text-sm font-bold text-slate-900">Trip Budget & Configuration</h3>
          </div>

          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        {/* Trip Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Trip Name *
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="input-field w-full px-3.5 py-2.5 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="input-field w-full px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Destination & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field w-full px-3.5 py-2.5 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field w-full px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field w-full px-3 py-2 text-xs font-medium"
            />
          </div>
        </div>

        {/* Contribution Per Person */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Fixed Contribution Per Confirmed Person (₹) *
          </label>
          <div className="relative">
            <input
              type="number"
              value={contributionPerPerson}
              onChange={(e) => setContributionPerPerson(e.target.value)}
              min="0"
              className="input-field w-full pl-9 pr-3.5 py-2.5 text-sm font-extrabold text-slate-900"
            />
            <Wallet className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Expected Fund automatically calculates as: Confirmed Members × ₹{contributionPerPerson}
          </p>
        </div>

        {/* Cover Emblem URL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Trip Logo / Cover Image URL (Optional)
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className="input-field w-full px-3.5 py-2 text-xs font-mono"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-xs text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md active:scale-97 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* ── 3. Supabase Cloud Sync Status ─────────────── */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Cloud Sync & Database</h3>
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isSupabaseConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Supabase Live Sync</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-amber-600" />
                <span>Offline / Local Mode</span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {isSupabaseConfigured
            ? '✅ App is connected to Supabase PostgreSQL database. All expenses and member payments sync in real time across devices.'
            : '⚠️ Running in offline-first localStorage mode. Data is stored safely in this browser.'}
        </p>
      </div>

      {/* ── 4. Backup, Restore & Reset ────────────────── */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Data Backup & Restore</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-slate-600" />
            <span>Download JSON Backup</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Restore from JSON File</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-700">Reset Trip Data</h4>
            <p className="text-[11px] text-slate-500">Reset all records back to default demo data</p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
