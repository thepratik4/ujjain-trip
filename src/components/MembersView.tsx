import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  CreditCard,
  Banknote,
  Clock,
  ArrowDownCircle,
} from 'lucide-react';
import { Member, MemberStatus, FinancialSummary } from '../types';
import { formatINR } from '../utils/currency';

interface MembersViewProps {
  members: Member[];
  summary: FinancialSummary;
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
  onQuickPayMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  summary,
  onOpenAddMember,
  onEditMember,
  onDeleteMember,
  onQuickPayMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MemberStatus>('All');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Partial' | 'Pending'>('All');

  // Filter members
  const filtered = members.filter((m) => {
    if (m.is_active === false) return false;

    // Status filter
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;

    // Payment filter
    if (paymentFilter === 'Paid' && m.amount_paid < m.expected_contribution) return false;
    if (
      paymentFilter === 'Partial' &&
      (m.amount_paid <= 0 || m.amount_paid >= m.expected_contribution)
    )
      return false;
    if (paymentFilter === 'Pending' && m.amount_paid > 0) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchNotes = m.notes ? m.notes.toLowerCase().includes(q) : false;
      return matchName || matchNotes;
    }

    return true;
  });

  // SORT: Place Unpaid / Pending / Partial members at the VERY TOP
  const sortedMembers = [...filtered].sort((a, b) => {
    const aPending = Math.max(0, a.expected_contribution - a.amount_paid);
    const bPending = Math.max(0, b.expected_contribution - b.amount_paid);

    // If a has pending balance and b is paid, a comes first
    if (aPending > 0 && bPending === 0) return -1;
    if (aPending === 0 && bPending > 0) return 1;

    // If both have pending, sort by higher pending amount first
    if (aPending > 0 && bPending > 0) return bPending - aPending;

    // Otherwise alphabetical
    return a.name.localeCompare(b.name);
  });

  const unpaidMembers = members.filter(
    (m) => m.status === 'Confirmed' && m.amount_paid < m.expected_contribution && m.is_active !== false
  );

  return (
    <div className="space-y-4 pb-24 animate-fadeup">
      {/* ── 1. Header & Title ─────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Trip Members
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {summary.confirmedMembersCount} Confirmed • {formatINR(summary.contributionPerPerson)} per person
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* ── 2. Top Stats Matrix ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Confirmed
          </span>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            {summary.confirmedMembersCount} / {summary.totalMembersCount}
          </div>
          <span className="text-[10px] text-slate-500">Boys travelling</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Expected Fund
          </span>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            {formatINR(summary.expectedFund)}
          </div>
          <span className="text-[10px] text-slate-500">{summary.confirmedMembersCount} × {formatINR(summary.contributionPerPerson)}</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Collected
          </span>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            {formatINR(summary.totalCollected)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">{summary.collectionProgressPercent}% collected</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Pending
          </span>
          <div className="text-lg font-black text-rose-600 mt-0.5">
            {formatINR(summary.pendingCollection)}
          </div>
          <span className="text-[10px] text-slate-500">{summary.unpaidMembersCount} unpaid</span>
        </div>
      </div>

      {/* ── 3. Unpaid Members Top Banner (If Any) ──────── */}
      {unpaidMembers.length > 0 && (
        <div className="card p-4 bg-amber-50/80 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Pending Payment from {unpaidMembers.length} {unpaidMembers.length === 1 ? 'Person' : 'People'}
            </h3>
            <span className="text-xs font-black text-amber-900">
              {formatINR(summary.pendingCollection)} Due
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {unpaidMembers.map((m) => {
              const pending = m.expected_contribution - m.amount_paid;
              return (
                <div
                  key={m.id}
                  onClick={() => onQuickPayMember(m)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-amber-300 shadow-xs cursor-pointer hover:bg-amber-100/50 transition-all text-xs"
                >
                  <span className="font-bold text-slate-900">{m.name}:</span>
                  <span className="font-extrabold text-rose-600">{formatINR(pending)} pending</span>
                  <span className="text-[10px] text-amber-700 underline font-semibold">Pay ➔</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Search & Filter Bar ───────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name or notes..."
            className="w-full text-xs font-medium bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Status:</span>
          {(['All', 'Confirmed', 'Maybe', 'Not Going'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] transition-all border cursor-pointer ${
                statusFilter === st
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="text-[11px] font-bold text-slate-500 ml-2 mr-1">Payment:</span>
          {(['All', 'Paid', 'Partial', 'Pending'] as const).map((pf) => (
            <button
              key={pf}
              onClick={() => setPaymentFilter(pf)}
              className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] transition-all border cursor-pointer ${
                paymentFilter === pf
                  ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pf}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Member Cards List (Unpaid First) ───────── */}
      {sortedMembers.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 space-y-2">
          <Users className="w-10 h-10 mx-auto opacity-30 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700">No members found</h4>
          <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedMembers.map((m) => {
            const isPaid = m.amount_paid >= m.expected_contribution;
            const isPartial = m.amount_paid > 0 && m.amount_paid < m.expected_contribution;
            const pendingAmount = Math.max(0, m.expected_contribution - m.amount_paid);
            const progress =
              m.expected_contribution > 0
                ? Math.min(100, Math.round((m.amount_paid / m.expected_contribution) * 100))
                : 0;

            return (
              <div
                key={m.id}
                className={`card p-4 transition-all hover:shadow-md relative overflow-hidden ${
                  !isPaid ? 'border-amber-300 bg-amber-50/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{m.name}</h3>

                        {/* Status badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            m.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : m.status === 'Maybe'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {m.status}
                        </span>

                        {/* Payment badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPartial
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPaid ? '✓ Paid in Full' : isPartial ? '⚡ Partial' : '⌛ Pending'}
                        </span>
                      </div>

                      {/* Payment Mode */}
                      {m.amount_paid > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
                          {m.payment_mode === 'Cash' ? (
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>Paid via {m.payment_mode}</span>
                        </div>
                      )}

                      {m.notes && <p className="text-[11px] text-slate-500 mt-1 italic">"{m.notes}"</p>}
                    </div>
                  </div>

                  {/* Right: Amounts & Quick Pay */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatINR(m.amount_paid)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      of {formatINR(m.expected_contribution)} expected
                    </div>

                    {!isPaid && (
                      <button
                        onClick={() => onQuickPayMember(m)}
                        className="mt-2 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-xs cursor-pointer"
                      >
                        Record Pay
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar and Edit/Delete */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPaid ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Edit button */}
                    <button
                      onClick={() => onEditMember(m)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                      title="Edit Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteMember(m)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
