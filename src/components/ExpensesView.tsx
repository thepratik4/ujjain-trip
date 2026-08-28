import React, { useState } from 'react';
import {
  Receipt,
  PlusCircle,
  Search,
  Wallet,
  HandCoins,
  CreditCard,
  Banknote,
  FileImage,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseSource, PaymentMode, FinancialSummary, TripSettings, Member } from '../types';
import { formatINR } from '../utils/currency';
import { generateTripFinancialReportPDF } from '../utils/pdfGenerator';
import { StorageService } from '../utils/storage';

interface ExpensesViewProps {
  settings: TripSettings;
  expenses: Expense[];
  members: Member[];
  summary: FinancialSummary;
  onOpenAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onViewBillImage: (imageUrl: string) => void;
  onToggleReimburse: (expenseId: string, isReimbursed: boolean) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Travel: '🚆',
  Hotel: '🏨',
  Food: '🍛',
  Snacks: '☕',
  Fuel: '⛽',
  'Auto/Cab': '🛺',
  Darshan: '🛕',
  Puja: '🪔',
  Tickets: '🎟️',
  Shopping: '🛍️',
  Entertainment: '🎉',
  Miscellaneous: '📦',
};

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  settings,
  expenses,
  members,
  summary,
  onOpenAddExpense,
  onEditExpense,
  onDeleteExpense,
  onViewBillImage,
  onToggleReimburse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | ExpenseSource>('all');
  const [modeFilter, setModeFilter] = useState<'all' | PaymentMode>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    const doc = generateTripFinancialReportPDF(members, expenses, summary, settings);
    doc.save(`${settings.trip_name.replace(/\s+/g, '_')}_Financial_Report.pdf`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    const csv = StorageService.exportToCSV(members, expenses, settings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.trip_name.replace(/\s+/g, '_')}_Ledger.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredExpenses = expenses.filter((e) => {
    if (e.is_active === false) return false;

    if (sourceFilter !== 'all' && e.source !== sourceFilter) return false;
    if (modeFilter !== 'all' && e.payment_mode !== modeFilter) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchNumber = e.expense_number.toLowerCase().includes(q);
      const matchPaidBy = e.paid_by_name.toLowerCase().includes(q);
      const matchCategory = e.category.toLowerCase().includes(q);
      const matchNotes = e.notes ? e.notes.toLowerCase().includes(q) : false;
      return matchTitle || matchNumber || matchPaidBy || matchCategory || matchNotes;
    }

    return true;
  });

  const personalExpenses = expenses.filter((e) => e.source === 'personal' && e.is_active !== false);

  return (
    <div className="space-y-5 pb-24 animate-fadeup">
      {/* ── 1. Top Header & Primary Action ───────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Fund & Expenses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Common treasury, online vs cash breakdown & expenses ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'PDF'}</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* ── 2. Master Fund Summary Card with Online vs Cash Split ── */}
      <div
        className="rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {/* Available Balance */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Available Balance
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black mt-0.5 ${
                summary.availableBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatINR(summary.availableBalance)}
            </div>
            <div className="text-[10px] text-zinc-300 mt-1 flex flex-col gap-0.5 border-t border-white/10 pt-1">
              <span className="text-blue-300 font-semibold">💳 UPI: {formatINR(summary.balanceOnline)}</span>
              <span className="text-amber-300 font-semibold">💵 Cash: {formatINR(summary.balanceCash)}</span>
            </div>
          </div>

          {/* Collected Fund */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Collected Fund
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {formatINR(summary.totalCollected)}
            </div>
            <div className="text-[10px] text-zinc-300 mt-1 flex flex-col gap-0.5 border-t border-white/10 pt-1">
              <span className="text-blue-300">💳 UPI: {formatINR(summary.collectedOnline)}</span>
              <span className="text-amber-300">💵 Cash: {formatINR(summary.collectedCash)}</span>
            </div>
          </div>

          {/* Fund Spent */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Fund Spent
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5">
              {formatINR(summary.totalTripFundExpenses)}
            </div>
            <div className="text-[10px] text-zinc-300 mt-1 flex flex-col gap-0.5 border-t border-white/10 pt-1">
              <span className="text-blue-300">💳 UPI: {formatINR(summary.expensesOnline)}</span>
              <span className="text-amber-300">💵 Cash: {formatINR(summary.expensesCash)}</span>
            </div>
          </div>

          {/* Reimbursements */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Reimbursements
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              {formatINR(summary.totalReimbursementsDue)}
            </div>
            <div className="text-[10px] text-zinc-300 mt-1 flex flex-col gap-0.5 border-t border-white/10 pt-1">
              <span className="text-zinc-400">Total out-of-pocket</span>
              <span className="text-amber-300 font-semibold">{formatINR(summary.totalPersonalExpenses)}</span>
            </div>
          </div>
        </div>

        {/* Collection progress */}
        <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-300 font-medium">Fund Collection Progress</span>
            <span className="text-amber-400 font-bold">{summary.collectionProgressPercent}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-amber-400"
              style={{ width: `${summary.collectionProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Out-of-Pocket Reimbursements Hub ──────── */}
      {personalExpenses.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HandCoins className="w-4 h-4 text-amber-600" />
                Personal Out-of-Pocket Expenses
              </h3>
              <p className="text-xs text-slate-500">Expenses paid personally by boys that need payback</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              {formatINR(summary.totalReimbursementsDue)} Due
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {personalExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 truncate">{exp.title}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900">
                      {exp.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {exp.payment_mode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Paid by <strong>{exp.paid_by_name}</strong> on {exp.date}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">{formatINR(exp.amount)}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        exp.is_reimbursed ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {exp.is_reimbursed ? '✓ Settled' : '⌛ Pending'}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleReimburse(exp.id, !exp.is_reimbursed)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                      exp.is_reimbursed
                        ? 'bg-slate-100 text-slate-600 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {exp.is_reimbursed ? 'Revert' : 'Mark Settled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Search & Filter Controls ───────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses by title, category, who paid..."
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

        {/* Source & Payment Mode Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Source Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-500 mr-0.5">Source:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'trip_fund', label: '🏛️ Fund' },
              { id: 'personal', label: '👤 Personal' },
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setSourceFilter(src.id as any)}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all border cursor-pointer ${
                  sourceFilter === src.id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          {/* Payment Mode Filter */}
          <div className="flex items-center gap-1 ml-auto sm:ml-2">
            <span className="text-[11px] font-bold text-slate-500 mr-0.5">Mode:</span>
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'UPI/Online', label: '💳 Online' },
              { id: 'Cash', label: '💵 Cash' },
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => setModeFilter(pm.id as any)}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all border cursor-pointer ${
                  modeFilter === pm.id
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] shrink-0 transition-all border cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {Object.keys(CATEGORY_ICONS).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as ExpenseCategory)}
              className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] shrink-0 transition-all border cursor-pointer flex items-center gap-1 ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Full Expenses Ledger ───────────────────── */}
      {filteredExpenses.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 space-y-2">
          <Receipt className="w-10 h-10 mx-auto opacity-30 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700">No expenses found</h4>
          <p className="text-xs text-slate-400">Try adjusting your filters or click "Add Expense"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="card p-4 transition-all hover:shadow-md relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
                    {CATEGORY_ICONS[exp.category] || '📦'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{exp.title}</h3>

                      {/* Source tag */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          exp.source === 'trip_fund'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {exp.source === 'trip_fund' ? '🏛️ Common Fund' : '👤 Personal'}
                      </span>

                      {/* Payment Mode badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                          exp.payment_mode === 'Cash'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {exp.payment_mode === 'Cash' ? (
                          <Banknote className="w-3 h-3 text-amber-700" />
                        ) : (
                          <CreditCard className="w-3 h-3 text-blue-700" />
                        )}
                        <span>{exp.payment_mode}</span>
                      </span>

                      {/* Reimbursement tag for personal */}
                      {exp.source === 'personal' && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            exp.is_reimbursed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {exp.is_reimbursed ? '✓ Settled' : '⌛ Reimbursement Due'}
                        </span>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span className="font-semibold text-slate-700">{exp.category}</span>
                      <span>•</span>
                      <span>
                        Paid by <strong>{exp.paid_by_name}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exp.date}
                      </span>
                    </div>

                    {exp.notes && <p className="text-[11px] text-slate-500 mt-1 italic">"{exp.notes}"</p>}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {formatINR(exp.amount)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {exp.expense_number}
                  </span>

                  {exp.source === 'personal' && (
                    <button
                      onClick={() => onToggleReimburse(exp.id, !exp.is_reimbursed)}
                      className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        exp.is_reimbursed
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : 'bg-emerald-600 text-white border-emerald-600'
                      }`}
                    >
                      {exp.is_reimbursed ? 'Revert' : 'Mark Settled'}
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Bill Thumbnail & Edit / Delete */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  {exp.bill_image ? (
                    <button
                      onClick={() => onViewBillImage(exp.bill_image!)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                    >
                      <FileImage className="w-3.5 h-3.5 text-amber-600" />
                      <span>View Receipt Photo</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">No bill photo attached</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditExpense(exp)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                    title="Edit Expense"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteExpense(exp)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                    title="Delete Expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
