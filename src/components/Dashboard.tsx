import React from 'react';
import {
  PlusCircle,
  TrendingDown,
  Wallet,
  ArrowRight,
  Receipt,
  Users,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileImage,
  ChevronRight,
  HandCoins,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  FinancialSummary,
  TripSettings,
  Member,
  Expense,
} from '../types';
import { formatINR } from '../utils/currency';

interface DashboardProps {
  settings: TripSettings;
  summary: FinancialSummary;
  members: Member[];
  expenses: Expense[];
  onOpenAddExpense: () => void;
  onOpenAddMember: () => void;
  onNavigateTab: (tab: 'dashboard' | 'members' | 'expenses' | 'settings') => void;
  onViewBillImage: (url: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Travel: '#3B82F6',
  Hotel: '#8B5CF6',
  Food: '#F59E0B',
  Snacks: '#F97316',
  Fuel: '#EF4444',
  'Auto/Cab': '#06B6D4',
  Darshan: '#10B981',
  Puja: '#EC4899',
  Tickets: '#6366F1',
  Shopping: '#14B8A6',
  Entertainment: '#84CC16',
  Miscellaneous: '#6B7280',
};

export const Dashboard: React.FC<DashboardProps> = ({
  settings,
  summary,
  members,
  expenses,
  onOpenAddExpense,
  onOpenAddMember,
  onNavigateTab,
  onViewBillImage,
}) => {
  // Category Breakdown for chart
  const categoryDataMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryDataMap[e.category] = (categoryDataMap[e.category] || 0) + Number(e.amount);
  });

  const chartData = Object.entries(categoryDataMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#6B7280',
    }));

  const recentExpenses = expenses.slice(0, 5);
  const pendingMembers = members.filter(
    (m) => m.status === 'Confirmed' && m.amount_paid < m.expected_contribution
  );

  return (
    <div className="space-y-5 pb-24 animate-fadeup">
      {/* ── 1. Hero Trip Card ─────────────────────────── */}
      <div
        className="rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #18181B 0%, #27272A 60%, #3F3F46 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EAB308 0%, transparent 70%)' }}
        />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{settings.subtitle || 'Boys Trip • 2026'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>{settings.trip_name}</span>
              <span className="text-xl">🛕</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-300 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {settings.destination}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {settings.start_date} to {settings.end_date}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('expenses')}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Fund Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5 relative z-10 pt-3 border-t border-white/10">
          <button
            onClick={onOpenAddExpense}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={onOpenAddMember}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white transition-all border border-white/20 active:scale-97 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* ── 2. Budget Shortfall Alert (If Expenses > Collected) ── */}
      {summary.shortfall > 0 && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3 animate-shake border"
          style={{
            backgroundColor: 'var(--color-expense-light)',
            borderColor: 'var(--color-expense)',
          }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">⚠️ Fund Shortfall Detected!</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Trip expenses ({formatINR(summary.totalTripFundExpenses)}) exceed actual collected funds (
              {formatINR(summary.totalCollected)}) by <strong>{formatINR(summary.shortfall)}</strong>. Collect pending
              contributions from members immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── 3. Four Core Financial Cards (With Online/Cash Split) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Trip Fund Collected */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="card p-4 transition-all hover:shadow-md cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Trip Fund</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatINR(summary.totalCollected)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5 border-t border-slate-100 pt-1">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CreditCard className="w-3 h-3" /> UPI: {formatINR(summary.collectedOnline)}
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Banknote className="w-3 h-3" /> Cash: {formatINR(summary.collectedCash)}
            </span>
          </div>
        </div>

        {/* 2. Total Spent */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="card p-4 transition-all hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Spent</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600">
            {formatINR(summary.totalExpenses)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5 border-t border-slate-100 pt-1">
            <span className="flex items-center gap-1 text-rose-700 font-medium">
              <CreditCard className="w-3 h-3" /> UPI: {formatINR(summary.expensesOnline)}
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Banknote className="w-3 h-3" /> Cash: {formatINR(summary.expensesCash)}
            </span>
          </div>
        </div>

        {/* 3. Available Balance (Online vs Cash in Hand) */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="card p-4 transition-all hover:shadow-md cursor-pointer bg-emerald-50/30 border-emerald-200/80"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Available</span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                summary.availableBalance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black ${
              summary.availableBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatINR(summary.availableBalance)}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 flex flex-col gap-0.5 border-t border-emerald-200/50 pt-1">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <CreditCard className="w-3 h-3 text-emerald-600" /> Bank/UPI: {formatINR(summary.balanceOnline)}
            </span>
            <span className="flex items-center gap-1 text-slate-800 font-bold">
              <Banknote className="w-3 h-3 text-amber-600" /> Cash: {formatINR(summary.balanceCash)}
            </span>
          </div>
        </div>

        {/* 4. Confirmed Members Paid */}
        <div
          onClick={() => onNavigateTab('members')}
          className="card p-4 transition-all hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Members</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {summary.paidMembersCount} / {summary.confirmedMembersCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5 border-t border-slate-100 pt-1">
            <span className="font-semibold text-slate-700">
              {formatINR(summary.contributionPerPerson)} / person
            </span>
            <span className="text-rose-600 font-bold">
              {summary.unpaidMembersCount} pending
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Online (UPI) vs Cash Treasury Breakdown Bar ── */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-amber-600" />
            Treasury Split (Online / UPI vs Cash in Hand)
          </span>
          <span className="text-emerald-700 font-extrabold">Total: {formatINR(summary.availableBalance)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Online / UPI Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Online / UPI (Bank)
              </span>
              <span className={`text-sm font-black ${summary.balanceOnline >= 0 ? 'text-blue-900' : 'text-rose-600'}`}>
                {formatINR(summary.balanceOnline)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-blue-700 pt-1 border-t border-blue-200/60 font-medium">
              <span>Collected: +{formatINR(summary.collectedOnline)}</span>
              <span>Spent: -{formatINR(summary.expensesOnline)}</span>
            </div>
          </div>

          {/* Cash in Hand Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-amber-600" />
                Cash in Hand Pool
              </span>
              <span className={`text-sm font-black ${summary.balanceCash >= 0 ? 'text-amber-900' : 'text-rose-600'}`}>
                {formatINR(summary.balanceCash)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-amber-800 pt-1 border-t border-amber-200/60 font-medium">
              <span>Collected: +{formatINR(summary.collectedCash)}</span>
              <span>Spent: -{formatINR(summary.expensesCash)}</span>
            </div>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1 font-semibold">
            <span className="text-slate-600">Total Collection Progress</span>
            <span className="text-amber-800 font-bold">{summary.collectionProgressPercent}%</span>
          </div>
          <div className="progress-bar-track h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="progress-bar-fill h-full rounded-full transition-all duration-700"
              style={{
                width: `${summary.collectionProgressPercent}%`,
                background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
            <span>Collected: <strong>{formatINR(summary.totalCollected)}</strong></span>
            <span>Pending: <strong className="text-rose-600">{formatINR(summary.pendingCollection)}</strong></span>
          </div>
        </div>
      </div>

      {/* ── 5. Spending Breakdown & Reimbursements Due ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spending Category Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Spending Breakdown</h3>
              <p className="text-xs text-slate-500">Category-wise trip expenditures</p>
            </div>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              All Expenses <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {chartData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Receipt className="w-8 h-8 mb-2 opacity-40" />
              <span>No expenses recorded yet</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [formatINR(Number(val)), 'Spent']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Pills List */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {chartData.slice(0, 4).map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-50 border border-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.name}:</span>
                    <strong className="text-slate-900">{formatINR(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Personal Payments & Reimbursements Due */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <HandCoins className="w-4 h-4 text-amber-600" />
                  Personal Expenses & Reimbursements
                </h3>
                <p className="text-xs text-slate-500">Out-of-pocket payments by boys</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {formatINR(summary.totalReimbursementsDue)} Due
              </span>
            </div>

            {summary.reimbursements.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500 opacity-80" />
                <span>All personal expenses are settled or paid from the common pool.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {summary.reimbursements.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{r.member_name}</h4>
                      <p className="text-[10px] text-slate-500">
                        Total spent: {formatINR(r.total_personal_spent)} • Settled: {formatINR(r.total_reimbursed)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-amber-900">
                        {formatINR(r.pending_reimbursement)} due
                      </div>
                      <button
                        onClick={() => onNavigateTab('expenses')}
                        className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer"
                      >
                        Settle in Fund ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total out-of-pocket spent:</span>
            <strong className="text-slate-900">{formatINR(summary.totalPersonalExpenses)}</strong>
          </div>
        </div>
      </div>

      {/* ── 6. Pending Member Contributions ───────────── */}
      {pendingMembers.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Pending Contributions ({pendingMembers.length})
              </h3>
              <p className="text-xs text-slate-500">Confirmed members with balance pending</p>
            </div>
            <button
              onClick={() => onNavigateTab('members')}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              View All Members
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pendingMembers.map((m) => {
              const pending = m.expected_contribution - m.amount_paid;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[10px] text-slate-500">{m.status} member</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-600">{formatINR(pending)} pending</div>
                    <span className="text-[10px] text-slate-400">
                      Paid {formatINR(m.amount_paid)} / {formatINR(m.expected_contribution)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 7. Latest Recent Expenses Feed ────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-700" />
              Recent Trip Expenses
            </h3>
            <p className="text-xs text-slate-500">Latest recorded payments and vouchers</p>
          </div>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View All ({expenses.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No expenses recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentExpenses.map((exp) => (
              <div key={exp.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[exp.category] || '#6B7280'}15`,
                      color: CATEGORY_COLORS[exp.category] || '#6B7280',
                    }}
                  >
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{exp.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {exp.category}
                      </span>
                      <span>•</span>
                      <span>Paid by {exp.paid_by_name}</span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          exp.source === 'trip_fund' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {exp.source === 'trip_fund' ? '🏛️ Common Fund' : '👤 Personal'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        {exp.payment_mode === 'Cash' ? (
                          <Banknote className="w-3 h-3 text-amber-600" />
                        ) : (
                          <CreditCard className="w-3 h-3 text-blue-600" />
                        )}
                        {exp.payment_mode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {formatINR(exp.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">{exp.date}</div>
                  </div>

                  {exp.bill_image && (
                    <button
                      onClick={() => onViewBillImage(exp.bill_image!)}
                      title="View Bill Photo"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      <FileImage className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
