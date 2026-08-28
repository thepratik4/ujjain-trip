import {
  TripSettings,
  Member,
  Expense,
  FinancialSummary,
  ReimbursementItem,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'ujjain_trip_settings_v1',
  MEMBERS: 'ujjain_trip_members_v1',
  EXPENSES: 'ujjain_trip_expenses_v1',
};

export const DEFAULT_SETTINGS: TripSettings = {
  trip_name: 'Ujjain Trip',
  subtitle: 'Boys Trip • 2026',
  destination: 'Ujjain, Madhya Pradesh',
  start_date: '2026-09-18',
  end_date: '2026-09-21',
  contribution_per_person: 4000,
  currency: '₹',
  cover_image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
};

export const DEFAULT_MEMBERS: Member[] = [];

export const DEFAULT_EXPENSES: Expense[] = [];

export class StorageService {
  /* ── Settings ─────────────────────────────────────── */
  static getSettings(): TripSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: TripSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  /* ── Members ──────────────────────────────────────── */
  static getMembers(): Member[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (!data) return DEFAULT_MEMBERS;
      return JSON.parse(data);
    } catch {
      return DEFAULT_MEMBERS;
    }
  }

  static saveMembers(members: Member[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }

  /* ── Expenses ─────────────────────────────────────── */
  static getExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!data) return DEFAULT_EXPENSES;
      return JSON.parse(data);
    } catch {
      return DEFAULT_EXPENSES;
    }
  }

  static saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  /* ── Next Expense Number Generator ────────────────── */
  static getNextExpenseNumber(expenses: Expense[] = []): string {
    let maxNum = 0;
    expenses.forEach((e) => {
      const match = e.expense_number?.match(/EXP-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `EXP-${String(nextNum).padStart(4, '0')}`;
  }

  /* ── Core Financial Summary Calculation ───────────── */
  static getFinancialSummary(
    members: Member[] = [],
    expenses: Expense[] = [],
    settings: TripSettings = DEFAULT_SETTINGS
  ): FinancialSummary {
    const activeMembers = members.filter((m) => m.is_active !== false);
    const confirmedMembers = activeMembers.filter((m) => m.status === 'Confirmed');

    const contributionPerPerson = settings.contribution_per_person || 4000;
    const confirmedMembersCount = confirmedMembers.length;
    const totalMembersCount = activeMembers.length;

    // Expected fund comes solely from Confirmed members
    const expectedFund = confirmedMembersCount * contributionPerPerson;

    // Total collected from all members
    const totalCollected = activeMembers.reduce((sum, m) => sum + (Number(m.amount_paid) || 0), 0);
    const pendingCollection = Math.max(0, expectedFund - totalCollected);
    const collectionProgressPercent =
      expectedFund > 0 ? Math.min(100, Math.round((totalCollected / expectedFund) * 100)) : 0;

    // Expenses breakdown
    const activeExpenses = expenses.filter((e) => e.is_active !== false);
    const tripFundExpenses = activeExpenses.filter((e) => e.source === 'trip_fund');
    const personalExpenses = activeExpenses.filter((e) => e.source === 'personal');

    const totalTripFundExpenses = tripFundExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalPersonalExpenses = personalExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpenses = totalTripFundExpenses + totalPersonalExpenses;

    // Inflows breakdown by Online vs Cash
    const collectedOnline = activeMembers.reduce(
      (sum, m) => sum + (m.payment_mode === 'Cash' ? 0 : Number(m.amount_paid) || 0),
      0
    );
    const collectedCash = activeMembers.reduce(
      (sum, m) => sum + (m.payment_mode === 'Cash' ? Number(m.amount_paid) || 0 : 0),
      0
    );

    // Expenses breakdown by Online vs Cash (from common trip fund)
    const expensesOnline = tripFundExpenses.reduce(
      (sum, e) => sum + (e.payment_mode === 'Cash' ? 0 : Number(e.amount) || 0),
      0
    );
    const expensesCash = tripFundExpenses.reduce(
      (sum, e) => sum + (e.payment_mode === 'Cash' ? Number(e.amount) || 0 : 0),
      0
    );

    // Balances
    const balanceOnline = collectedOnline - expensesOnline;
    const balanceCash = collectedCash - expensesCash;
    const availableBalance = totalCollected - totalTripFundExpenses;
    const shortfall = availableBalance < 0 ? Math.abs(availableBalance) : 0;

    // Reimbursements calculation for personal expenses
    const reimbursementsMap: Record<string, { total: number; reimbursed: number; expIds: string[] }> = {};
    personalExpenses.forEach((e) => {
      const name = e.paid_by_name || 'Anonymous';
      if (!reimbursementsMap[name]) {
        reimbursementsMap[name] = { total: 0, reimbursed: 0, expIds: [] };
      }
      reimbursementsMap[name].total += Number(e.amount);
      if (e.is_reimbursed) {
        reimbursementsMap[name].reimbursed += Number(e.amount);
      }
      reimbursementsMap[name].expIds.push(e.id);
    });

    const reimbursements: ReimbursementItem[] = Object.entries(reimbursementsMap).map(([name, data]) => ({
      member_name: name,
      total_personal_spent: data.total,
      total_reimbursed: data.reimbursed,
      pending_reimbursement: Math.max(0, data.total - data.reimbursed),
      expense_ids: data.expIds,
    }));

    const totalReimbursementsDue = reimbursements.reduce((sum, r) => sum + r.pending_reimbursement, 0);

    // Member payment status counts
    let paidMembersCount = 0;
    let partialMembersCount = 0;
    let unpaidMembersCount = 0;

    confirmedMembers.forEach((m) => {
      const paid = Number(m.amount_paid) || 0;
      const expected = Number(m.expected_contribution) || contributionPerPerson;
      if (paid >= expected) {
        paidMembersCount++;
      } else if (paid > 0) {
        partialMembersCount++;
      } else {
        unpaidMembersCount++;
      }
    });

    return {
      contributionPerPerson,
      confirmedMembersCount,
      totalMembersCount,
      expectedFund,
      totalCollected,
      collectedOnline,
      collectedCash,
      pendingCollection,
      collectionProgressPercent,
      totalTripFundExpenses,
      totalPersonalExpenses,
      totalExpenses,
      expensesOnline,
      expensesCash,
      availableBalance,
      balanceOnline,
      balanceCash,
      shortfall,
      totalReimbursementsDue,
      reimbursements,
      paidMembersCount,
      partialMembersCount,
      unpaidMembersCount,
    };
  }

  /* ── Export CSV ───────────────────────────────────── */
  static exportToCSV(
    members: Member[] = [],
    expenses: Expense[] = [],
    settings: TripSettings = DEFAULT_SETTINGS
  ): string {
    const summary = this.getFinancialSummary(members, expenses, settings);

    let csv = `${settings.trip_name.toUpperCase()} - ${settings.subtitle.toUpperCase()}\n`;
    csv += `Destination: ${settings.destination} | Dates: ${settings.start_date} to ${settings.end_date}\n\n`;

    csv += 'FINANCIAL SUMMARY\n';
    csv += `Contribution Per Person,₹${summary.contributionPerPerson}\n`;
    csv += `Confirmed Members,${summary.confirmedMembersCount}\n`;
    csv += `Expected Trip Fund,₹${summary.expectedFund}\n`;
    csv += `Actual Collected,₹${summary.totalCollected}\n`;
    csv += `Pending Collection,₹${summary.pendingCollection}\n`;
    csv += `Trip Fund Expenses,₹${summary.totalTripFundExpenses}\n`;
    csv += `Personal Expenses (Reimbursements Due),₹${summary.totalReimbursementsDue}\n`;
    csv += `Available Fund Balance,₹${summary.availableBalance}\n\n`;

    csv += 'MEMBERS & CONTRIBUTIONS\n';
    csv += 'Name,Status,Expected (INR),Paid (INR),Pending Due (INR),Payment Mode,Payment Date,Notes\n';
    members.forEach((m) => {
      const pendingDue = Math.max(0, m.expected_contribution - m.amount_paid);
      csv += `"${m.name.replace(/"/g, '""')}","${m.status}",${m.expected_contribution},${m.amount_paid},${pendingDue},"${m.payment_mode}","${m.payment_date || ''}","${(m.notes || '').replace(/"/g, '""')}"\n`;
    });

    csv += '\nTRIP EXPENSES\n';
    csv += 'Expense No,Title,Category,Amount (INR),Paid By,Source,Payment Mode,Date,Reimbursed,Notes\n';
    expenses.forEach((e) => {
      csv += `"${e.expense_number}","${e.title.replace(/"/g, '""')}","${e.category}",${e.amount},"${e.paid_by_name}","${e.source}","${e.payment_mode}","${e.date}","${e.is_reimbursed ? 'Yes' : 'No'}","${(e.notes || '').replace(/"/g, '""')}"\n`;
    });

    return csv;
  }

  /* ── Reset Everything with Default Data ───────────── */
  static resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(DEFAULT_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
  }
}
