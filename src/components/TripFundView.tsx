import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  Users,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HandCoins,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  RotateCcw,
  Receipt,
  FileText,
} from 'lucide-react';
import {
  FinancialSummary,
  TripSettings,
  Member,
  Expense,
} from '../types';
import { formatINR } from '../utils/currency';
import { generateTripFinancialReportPDF } from '../utils/pdfGenerator';
import { StorageService } from '../utils/storage';

interface TripFundViewProps {
  settings: TripSettings;
  summary: FinancialSummary;
  members: Member[];
  expenses: Expense[];
  onToggleReimburse: (expenseId: string, isReimbursed: boolean) => void;
  onOpenAddExpense: () => void;
  onOpenAddMember: () => void;
}

export const TripFundView: React.FC<TripFundViewProps> = ({
  settings,
  summary,
  members,
  expenses,
  onToggleReimburse,
  onOpenAddExpense,
  onOpenAddMember,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    const doc = generateTripFinancialReportPDF(members, expenses, summary, settings);
    doc.save(`${settings.trip_name.replace(/\s+/g, '_')}_Financial_Report_2026.pdf`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const csv = StorageService.exportToCSV(members, expenses, settings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.trip_name.replace(/\s+/g, '_')}_Ledger_2026.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const personalExpenses = expenses.filter((e) => e.source === 'personal' && e.is_active !== false);
  const tripFundExpenses = expenses.filter((e) => e.source === 'trip_fund' && e.is_active !== false);

  return (
    <div className="space-y-5 pb-24 animate-fadeup">
      {/* ── 1. Title & Export Actions ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Common Trip Fund
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Central shared treasury & reimbursement reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Master Fund Balance Matrix ─────────────── */}
      <div
        className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Main Available Balance */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Available Cash Balance
            </span>
            <div
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                summary.availableBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatINR(summary.availableBalance)}
            </div>
            <p className="text-[11px] text-zinc-400">
              Actual Collected ({formatINR(summary.totalCollected)}) − Fund Expenses (
              {formatINR(summary.totalTripFundExpenses)})
            </p>
          </div>

          {/* Expected vs Collected */}
          <div className="space-y-1 border-l-0 md:border-l border-white/10 md:pl-6">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Expected Fund
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatINR(summary.expectedFund)}
            </div>
            <p className="text-[11px] text-zinc-400">
              {summary.confirmedMembersCount} Confirmed Boys × {formatINR(summary.contributionPerPerson)}
            </p>
          </div>

          {/* Pending Collection */}
          <div className="space-y-1 border-l-0 md:border-l border-white/10 md:pl-6">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pending Collections
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {formatINR(summary.pendingCollection)}
            </div>
            <p className="text-[11px] text-zinc-400">
              {summary.unpaidMembersCount} unpaid • {summary.partialMembersCount} partial
            </p>
          </div>
        </div>

        {/* Progress bar inside dark card */}
        <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-300 font-medium">Fund Collection Progress</span>
            <span className="text-amber-400 font-bold">{summary.collectionProgressPercent}%</span>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-amber-400"
              style={{ width: `${summary.collectionProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Six Detailed Financial Metrics ─────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Per Person
          </span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {formatINR(summary.contributionPerPerson)}
          </div>
          <span className="text-[10px] text-slate-400">Fixed upfront</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Confirmed
          </span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {summary.confirmedMembersCount}
          </div>
          <span className="text-[10px] text-slate-400">of {summary.totalMembersCount} members</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Collected
          </span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            {formatINR(summary.totalCollected)}
          </div>
          <span className="text-[10px] text-slate-400">From members</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Fund Spent
          </span>
          <div className="text-base font-extrabold text-rose-600 mt-0.5">
            {formatINR(summary.totalTripFundExpenses)}
          </div>
          <span className="text-[10px] text-slate-400">Drawn from pool</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Personal Paid
          </span>
          <div className="text-base font-extrabold text-amber-700 mt-0.5">
            {formatINR(summary.totalPersonalExpenses)}
          </div>
          <span className="text-[10px] text-slate-400">Out of pocket</span>
        </div>

        <div className="card p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Reimbursements
          </span>
          <div className="text-base font-extrabold text-amber-900 mt-0.5">
            {formatINR(summary.totalReimbursementsDue)}
          </div>
          <span className="text-[10px] text-slate-400">Pending payback</span>
        </div>
      </div>

      {/* ── 4. Personal Expenses & Reimbursement Hub ──── */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <HandCoins className="w-4 h-4 text-amber-600" />
              Reconciliation: Out-of-Pocket Reimbursements
            </h3>
            <p className="text-xs text-slate-500">
              When someone pays personally for a group expense, the trip fund reimburses them.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">
            Total Due: {formatINR(summary.totalReimbursementsDue)}
          </span>
        </div>

        {personalExpenses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
            <span>No personal out-of-pocket expenses recorded. All expenses came directly from the fund pool.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {personalExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                    👤
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Paid by <strong>{exp.paid_by_name}</strong> on {exp.date} ({exp.payment_mode})
                    </p>
                    {exp.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">"{exp.notes}"</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatINR(exp.amount)}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        exp.is_reimbursed ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {exp.is_reimbursed ? '✓ Reimbursed' : '⌛ Pending Reimbursement'}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleReimburse(exp.id, !exp.is_reimbursed)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      exp.is_reimbursed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {exp.is_reimbursed ? 'Mark Pending' : 'Mark Settled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. Fund Inflows (Member Contributions Table) ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              Fund Inflows (Member Contributions)
            </h3>
            <p className="text-xs text-slate-500">Collected: {formatINR(summary.totalCollected)}</p>
          </div>
          <button
            onClick={onOpenAddMember}
            className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
          >
            + Add Member
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((m) => {
            const isPaid = m.amount_paid >= m.expected_contribution;
            const isPartial = m.amount_paid > 0 && m.amount_paid < m.expected_contribution;
            return (
              <div key={m.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({m.status})</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-slate-900">{formatINR(m.amount_paid)}</span>
                  <span
                    className={`ml-2 text-[10px] font-bold ${
                      isPaid
                        ? 'text-emerald-700'
                        : isPartial
                        ? 'text-amber-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {isPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. Fund Outflows (Expenses from Fund Pool) ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Fund Outflows (Trip Expenses from Pool)
            </h3>
            <p className="text-xs text-slate-500">Total Spent from Fund: {formatINR(summary.totalTripFundExpenses)}</p>
          </div>
          <button
            onClick={onOpenAddExpense}
            className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
          >
            + Add Expense
          </button>
        </div>

        {tripFundExpenses.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">No trip fund expenses recorded.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tripFundExpenses.map((exp) => (
              <div key={exp.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{exp.title}</h4>
                  <p className="text-[10px] text-slate-500">
                    {exp.category} • Paid by {exp.paid_by_name} • {exp.date}
                  </p>
                </div>
                <div className="text-right shrink-0 font-extrabold text-slate-900">
                  {formatINR(exp.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
