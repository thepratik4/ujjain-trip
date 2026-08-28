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
  passcode_enabled?: boolean;
}

export interface Member {
  id: string;
  trip_id?: string;
  name: string;
  phone: string;
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

export interface ItineraryItem {
  id: string;
  trip_id?: string;
  day_number: number;
  date: string; // YYYY-MM-DD
  time_label: string; // e.g. "05:00 AM"
  title: string;
  location?: string;
  map_url?: string;
  description?: string;
  notes?: string;
  is_completed?: boolean;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export type TravelType = 'outbound' | 'return' | 'stay' | 'local';

export interface TravelDetail {
  id: string;
  trip_id?: string;
  type: TravelType;
  mode?: string; // Train / Bus / Flight / Car / Auto
  title: string;
  booking_ref?: string; // PNR / Ticket / Hotel Booking ID
  departure_station?: string;
  arrival_station?: string;
  departure_time?: string;
  arrival_time?: string;
  hotel_name?: string;
  address?: string;
  contact_number?: string;
  map_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export type NoteCategory =
  | 'Packing List'
  | 'Important Contacts'
  | 'Documents'
  | 'Food & Food Places'
  | 'Temple & Darshan Tips'
  | 'Trip Rules'
  | 'General';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface TripNote {
  id: string;
  trip_id?: string;
  title: string;
  category: NoteCategory;
  content: string;
  is_checklist?: boolean;
  checklist_items?: ChecklistItem[];
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
