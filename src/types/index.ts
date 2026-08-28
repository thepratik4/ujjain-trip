export type PaymentMode = 'UPI/Online' | 'Cash';

export type MemberStatus = 'Confirmed' | 'Maybe' | 'Not Going';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

export type ExpenseSource = 'trip_fund' | 'personal';

export type ExpenseCategory =
  | 'Travel'
  | 'Hotel'
  | 'Food'
  | 'Snacks'
  | 'Fuel'
  | 'Auto/Cab'
  | 'Darshan'
  | 'Puja'
  | 'Tickets'
  | 'Shopping'
  | 'Entertainment'
  | 'Miscellaneous';

export interface TripSettings {
  trip_name: string;
  subtitle: string;
  destination: string;
  start_date: string;
  end_date: string;
  contribution_per_person: number;
  currency: string;
  cover_image?: string;
}

export interface Member {
  id: string;
  trip_id?: string;
  name: string;
  phone?: string;
  status: MemberStatus;
  expected_contribution: number;
  amount_paid: number;
  payment_mode: PaymentMode;
  payment_date?: string; // YYYY-MM-DD
  notes?: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface Expense {
  id: string;
  trip_id?: string;
  expense_number: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  payment_mode: PaymentMode;
  date: string; // YYYY-MM-DD
  paid_by_member_id?: string;
  paid_by_name: string;
  source: ExpenseSource; // 'trip_fund' | 'personal'
  is_reimbursed?: boolean;
  bill_image?: string; // base64 or URL
  notes?: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ReimbursementItem {
  member_id?: string;
  member_name: string;
  total_personal_spent: number;
  total_reimbursed: number;
  pending_reimbursement: number;
  expense_ids: string[];
}

export interface FinancialSummary {
  contributionPerPerson: number;
  confirmedMembersCount: number;
  totalMembersCount: number;
  expectedFund: number;
  totalCollected: number;
  pendingCollection: number;
  collectionProgressPercent: number;
  totalTripFundExpenses: number;
  totalPersonalExpenses: number;
  totalExpenses: number;
  availableBalance: number;
  shortfall: number;
  totalReimbursementsDue: number;
  reimbursements: ReimbursementItem[];
  paidMembersCount: number;
  partialMembersCount: number;
  unpaidMembersCount: number;
}
