import React from 'react';
import { Database, Zap, CloudOff, User, Compass, Sparkles } from 'lucide-react';
import { TripSettings, FinancialSummary } from '../types';
import { formatINR } from '../utils/currency';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  settings: TripSettings;
  summary: FinancialSummary;
  onOpenSettings: () => void;
  onQuickBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  summary,
  onOpenSettings,
  onQuickBackup,
}) => {
  const isPositiveBalance = summary.availableBalance >= 0;

  return (
    <header
      className="sticky top-0 z-30 overflow-x-hidden backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Logo & Trip Name */}
        <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={onOpenSettings}>
          {/* Logo square */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative"
            style={{
              backgroundColor: 'var(--color-primary)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {settings.cover_image ? (
              <img
                src={settings.cover_image}
                alt="Trip Emblem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xl">🛕</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1
                className="text-base font-extrabold leading-tight tracking-tight truncate"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)', fontSize: '1.05rem' }}
              >
                {settings.trip_name}
              </h1>
              <span className="text-xs">🛕</span>
            </div>
            <p className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isSupabaseConfigured ? '#10B981' : '#F59E0B',
                  animation: 'pulse 2s infinite',
                }}
              ></span>
              <span>{settings.subtitle || 'Boys Trip • 2026'}</span>
            </p>
          </div>
        </div>

        {/* Right: Controls & Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Supabase Status Chip */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all"
            style={{
              backgroundColor: isSupabaseConfigured ? '#ECFDF5' : 'var(--color-gold-light)',
              borderColor: isSupabaseConfigured ? '#A7F3D0' : '#FDE68A',
              color: isSupabaseConfigured ? '#065F46' : '#92400E',
            }}
            title={isSupabaseConfigured ? 'Supabase Realtime Sync Active' : 'Offline LocalStorage Mode'}
          >
            {isSupabaseConfigured ? (
              <>
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Live Sync</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-amber-600" />
                <span>Offline Mode</span>
              </>
            )}
          </div>

          {/* Available Fund Balance Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs"
            style={{
              backgroundColor: isPositiveBalance ? 'var(--color-gold-light)' : 'var(--color-expense-light)',
              borderColor: isPositiveBalance ? 'var(--color-gold-muted)' : 'var(--color-expense)',
              color: isPositiveBalance ? 'var(--color-gold)' : 'var(--color-expense)',
            }}
          >
            <span className="font-medium text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
              Fund
            </span>
            <span className="font-bold">{formatINR(summary.availableBalance)}</span>
          </div>

          {/* Export / Backup Button */}
          <button
            onClick={onQuickBackup}
            title="Download Trip Financial Report & Backup"
            className="p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--bg-subtle)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
          >
            <Database className="w-4 h-4 text-slate-700" />
            <span className="hidden md:inline">Report</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            title="Trip Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
