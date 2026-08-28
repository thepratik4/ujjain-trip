import {
  TripSettings,
  Member,
  Expense,
  ItineraryItem,
  TravelDetail,
  TripNote,
  FinancialSummary,
  ReimbursementItem,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'ujjain_trip_settings_v1',
  MEMBERS: 'ujjain_trip_members_v1',
  EXPENSES: 'ujjain_trip_expenses_v1',
  ITINERARY: 'ujjain_trip_itinerary_v1',
  TRAVEL: 'ujjain_trip_travel_v1',
  NOTES: 'ujjain_trip_notes_v1',
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
  passcode_enabled: true,
};

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'Rahul Sharma',
    phone: '9820112345',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-20',
    notes: 'Paid via GPay',
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-2',
    name: 'Akash Verma',
    phone: '9820223456',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-21',
    notes: 'Paid via PhonePe',
    created_at: '2026-08-21T11:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-3',
    name: 'Aman Gupta',
    phone: '9820334567',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-21',
    notes: 'Paid in full',
    created_at: '2026-08-21T12:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-4',
    name: 'Rohit Joshi',
    phone: '9820445678',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'Cash',
    payment_date: '2026-08-22',
    notes: 'Handed over cash',
    created_at: '2026-08-22T14:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-5',
    name: 'Sameer Khan',
    phone: '9820556789',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-23',
    notes: 'Paid via Paytm',
    created_at: '2026-08-23T15:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-6',
    name: 'Vikas Patel',
    phone: '9820667890',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-24',
    notes: 'Paid via UPI',
    created_at: '2026-08-24T16:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-7',
    name: 'Kunal Shinde',
    phone: '9820778901',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 4000,
    payment_mode: 'UPI/Online',
    payment_date: '2026-08-25',
    notes: 'Transferred',
    created_at: '2026-08-25T17:00:00.000Z',
    is_active: true,
  },
  {
    id: 'mem-8',
    name: 'Pratik Mane',
    phone: '9820889012',
    status: 'Confirmed',
    expected_contribution: 4000,
    amount_paid: 0,
    payment_mode: 'UPI/Online',
    notes: 'Will pay by Friday',
    created_at: '2026-08-25T18:00:00.000Z',
    is_active: true,
  },
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    expense_number: 'EXP-0001',
    title: 'Hotel Imperial Grand (Advance)',
    category: 'Hotel',
    amount: 8000,
    payment_mode: 'UPI/Online',
    date: '2026-08-24',
    paid_by_name: 'Rahul Sharma',
    source: 'trip_fund',
    notes: '2 Quad rooms booked for 2 nights',
    created_at: '2026-08-24T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-2',
    expense_number: 'EXP-0002',
    title: 'Train Tickets - Avantika Express',
    category: 'Travel',
    amount: 7000,
    payment_mode: 'UPI/Online',
    date: '2026-08-22',
    paid_by_name: 'Akash Verma',
    source: 'trip_fund',
    notes: '3AC 8 confirmed berths from Mumbai Central',
    created_at: '2026-08-22T12:00:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-3',
    expense_number: 'EXP-0003',
    title: 'Mahakaleshwar VIP Darshan & Protocol Passes',
    category: 'Darshan',
    amount: 2000,
    payment_mode: 'UPI/Online',
    date: '2026-08-25',
    paid_by_name: 'Rahul Sharma',
    source: 'trip_fund',
    notes: 'Official shrine board receipt received',
    created_at: '2026-08-25T14:00:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-4',
    expense_number: 'EXP-0004',
    title: 'Breakfast & Snacks on Train',
    category: 'Food',
    amount: 1500,
    payment_mode: 'UPI/Online',
    date: '2026-08-26',
    paid_by_name: 'Aman Gupta',
    source: 'trip_fund',
    notes: 'Pantry tea, coffee, cutlets, breakfast',
    created_at: '2026-08-26T09:00:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-5',
    expense_number: 'EXP-0005',
    title: 'Fuel & Highway Toll (Aman Paid Personally)',
    category: 'Fuel',
    amount: 2000,
    payment_mode: 'UPI/Online',
    date: '2026-08-25',
    paid_by_name: 'Aman Gupta',
    source: 'personal',
    is_reimbursed: false,
    notes: 'Aman swiped personal credit card at petrol pump. Trip needs to reimburse.',
    created_at: '2026-08-25T16:00:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-6',
    expense_number: 'EXP-0006',
    title: 'Kal Bhairav Prasad & Offerings',
    category: 'Puja',
    amount: 1000,
    payment_mode: 'Cash',
    date: '2026-08-26',
    paid_by_name: 'Rohit Joshi',
    source: 'trip_fund',
    notes: 'Prasad baskets and sacred offerings',
    created_at: '2026-08-26T15:30:00.000Z',
    is_active: true,
  },
  {
    id: 'exp-7',
    expense_number: 'EXP-0007',
    title: 'Auto Cabs local hire (Sameer Paid Personally)',
    category: 'Auto/Cab',
    amount: 1500,
    payment_mode: 'Cash',
    date: '2026-08-26',
    paid_by_name: 'Sameer Khan',
    source: 'personal',
    is_reimbursed: false,
    notes: '2 large Autos hired for full day temple circuit',
    created_at: '2026-08-26T18:00:00.000Z',
    is_active: true,
  },
];

export const DEFAULT_ITINERARY: ItineraryItem[] = [
  {
    id: 'itin-1',
    day_number: 1,
    date: '2026-09-18',
    time_label: '09:30 PM',
    title: 'Board Avantika Superfast Express',
    location: 'Mumbai Central (MMCT)',
    map_url: 'https://maps.google.com/?q=Mumbai+Central+Railway+Station',
    description: 'Gather at Platform 1 near Coach B3 by 08:45 PM with ID cards.',
    notes: 'Train 12962 departs sharp at 09:35 PM.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-2',
    day_number: 2,
    date: '2026-09-19',
    time_label: '07:15 AM',
    title: 'Arrive Ujjain Junction & Check-in',
    location: 'Hotel Imperial Grand, Station Road',
    map_url: 'https://maps.google.com/?q=Ujjain+Junction+Railway+Station',
    description: 'Fresh up and change into traditional traditional dhotis/kurta.',
    notes: 'Early check-in confirmed by reception.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-3',
    day_number: 2,
    date: '2026-09-19',
    time_label: '08:30 AM',
    title: 'Authentic Ujjain Breakfast',
    location: 'Bhole Poha & Kachori Center, Tower Chowk',
    map_url: 'https://maps.google.com/?q=Tower+Chowk+Ujjain',
    description: 'Famous Indori style Usal Poha, Jalebi, and Garadu chaat.',
    notes: 'Must try the Sev Poha and spiced masala chai.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-4',
    day_number: 2,
    date: '2026-09-19',
    time_label: '10:00 AM',
    title: 'Shri Mahakaleshwar Jyotirlinga Darshan',
    location: 'Mahakaleshwar Temple Complex',
    map_url: 'https://maps.google.com/?q=Mahakaleshwar+Jyotirlinga+Ujjain',
    description: 'Entry via Gate 4 (VIP Protocol line). Jalabhishek and sanctum darshan.',
    notes: 'Phones strictly not allowed inside sanctum; keep in cloakroom.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-5',
    day_number: 2,
    date: '2026-09-19',
    time_label: '04:00 PM',
    title: 'Explore Shri Mahakal Lok Corridor',
    location: 'Mahakal Lok Complex',
    map_url: 'https://maps.google.com/?q=Mahakal+Lok+Ujjain',
    description: 'Grand corridor featuring 108 grand stambhas, Rudrasagar lake, and mural sculptures.',
    notes: 'Best photography during sunset lighting.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-6',
    day_number: 2,
    date: '2026-09-19',
    time_label: '07:00 PM',
    title: 'Maha Aarti at Ram Ghat (Shipra River)',
    location: 'Ram Ghat, Shipra River',
    map_url: 'https://maps.google.com/?q=Ram+Ghat+Ujjain',
    description: 'Evening Shipra river dip, deep-daan (floating diya lamps), and musical Aarti.',
    notes: 'Spectacular sight with thousands of lamps.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-7',
    day_number: 3,
    date: '2026-09-20',
    time_label: '03:30 AM',
    title: 'Divine Bhasma Aarti (Early Morning)',
    location: 'Mahakaleshwar Sanctum',
    map_url: 'https://maps.google.com/?q=Mahakaleshwar+Temple+Ujjain',
    description: 'World-renowned Bhasma Aarti with fresh sacred ash.',
    notes: 'Strict dress code: Traditional unstitched white Dhoti & Angavastram for boys.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'itin-8',
    day_number: 3,
    date: '2026-09-20',
    time_label: '11:00 AM',
    title: 'Kal Bhairav & Harsiddhi Mata Temple',
    location: 'Kal Bhairav Mandir, Bhairavgarh',
    map_url: 'https://maps.google.com/?q=Kal+Bhairav+Temple+Ujjain',
    description: 'Ancient temple where deity accepts liquid offerings. Followed by Shaktipeeth Harsiddhi Deepstambh.',
    notes: 'Auto cabs booked for return journey.',
    is_completed: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
];

export const DEFAULT_TRAVEL: TravelDetail[] = [
  {
    id: 'trv-1',
    type: 'outbound',
    mode: 'Train (Avantika SF Express - 12962)',
    title: 'Mumbai Central ➔ Ujjain Junction',
    booking_ref: 'PNR 241-8930124 (Coach B3)',
    departure_station: 'Mumbai Central (MMCT)',
    arrival_station: 'Ujjain Jn (UJN)',
    departure_time: '18 Sep, 09:35 PM',
    arrival_time: '19 Sep, 07:15 AM',
    notes: '8 Berths confirmed. Carry original Aadhaar cards.',
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'trv-2',
    type: 'return',
    mode: 'Train (Avantika Express - 12961)',
    title: 'Ujjain Junction ➔ Mumbai Central',
    booking_ref: 'PNR 243-9821098 (Coach B2)',
    departure_station: 'Ujjain Jn (UJN)',
    arrival_station: 'Mumbai Central (MMCT)',
    departure_time: '20 Sep, 07:50 PM',
    arrival_time: '21 Sep, 06:10 AM',
    notes: 'Return journey after evening dinner.',
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'trv-3',
    type: 'stay',
    mode: 'Hotel Stay (2 Quad Rooms)',
    title: 'Hotel Imperial Grand Ujjain',
    booking_ref: 'IMP-UJJ-2026-881',
    hotel_name: 'Hotel Imperial Grand',
    address: 'Near Railway Station, Freeganj, Ujjain, MP 456001',
    contact_number: '+91 734 252 8899',
    map_url: 'https://maps.google.com/?q=Hotel+Imperial+Grand+Ujjain',
    departure_time: '19 Sep Check-in (08:00 AM)',
    arrival_time: '20 Sep Check-out (05:00 PM)',
    notes: 'AC Deluxe Rooms, hot water, luggage storage available after checkout.',
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'trv-4',
    type: 'local',
    mode: '2 Autos on Full Day Hire',
    title: 'Local Auto Cabs (Temple Circuit)',
    booking_ref: 'Driver Mukesh: +91 94250 11223',
    contact_number: '+91 94250 11223',
    notes: 'Fixed rate ₹1,500 for full day coverage (Kal Bhairav, Mangalnath, Sandipani, Ram Ghat).',
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
];

export const DEFAULT_NOTES: TripNote[] = [
  {
    id: 'note-1',
    title: '🎒 Things to Carry Checklist',
    category: 'Packing List',
    content: 'Essential packing items for Bhasma Aarti, travel and stay.',
    is_checklist: true,
    checklist_items: [
      { id: 'c-1', text: 'Original Aadhaar / Govt Photo ID (Mandatory for entry)', checked: true },
      { id: 'c-2', text: 'Traditional White Cotton Dhoti & Angavastram (Required for Bhasma Aarti)', checked: true },
      { id: 'c-3', text: 'Kurta / Traditional wear for general temple darshan', checked: true },
      { id: 'c-4', text: 'Power banks and charging cables', checked: false },
      { id: 'c-5', text: 'Emergency medicines (Paracetamol, ORS, Digene, Band-aids)', checked: true },
      { id: 'c-6', text: 'Comfortable slip-on footwear / sandals', checked: false },
      { id: 'c-7', text: 'Small backpack / sling bag for temple visits', checked: false },
    ],
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'note-2',
    title: '📞 Important Emergency Numbers',
    category: 'Important Contacts',
    content: 'Save these numbers on your phone before boarding:\n• Mahakal Temple Control Room: 0734-2550563\n• Ujjain Police Helpline: 112 / 0734-2525100\n• Hotel Imperial Reception: +91 734 252 8899\n• Auto Driver Mukesh: +91 94250 11223\n• Railway Enquiries Ujjain: 139',
    is_checklist: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'note-3',
    title: '🍛 Famous Ujjain Street Food Spots',
    category: 'Food & Food Places',
    content: '1. Bhole Poha & Kachori (Tower Chowk) - Morning 6am to 11am\n2. Mahakal Thali & Dal Bafla at Mittal Dal Bafla (Kanthal)\n3. Bhutta Kulfi & Rabdi at Ramghat\n4. Shree Ganga Sweets - Fresh Garadu chaat & Jalebi\n5. Jain Namkeen Bhandar - Take home famous Ratlami Sev and Ujjaini Sev',
    is_checklist: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'note-4',
    title: '🛕 Mahakaleshwar & Bhasma Aarti Protocol',
    category: 'Temple & Darshan Tips',
    content: '• Report at Gate 4 by 03:00 AM sharp with printed pass and original Aadhaar.\n• Men must wear only traditional Dhoti and Kurta/Angavastram (No jeans, trousers, or leather belts inside).\n• Leather items (belts, wallets) and mobile phones strictly prohibited inside the sanctum sanctorum.\n• Keep phone in hotel or temple locker prior to queue.',
    is_checklist: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
  {
    id: 'note-5',
    title: '📜 Trip Rules for the Boys',
    category: 'Trip Rules',
    content: '1. All major group expenses must be paid from the Common Trip Fund.\n2. If someone pays personally, immediately log the expense with Source = Personal so you get reimbursed.\n3. Be punctual for early morning Darshan schedules.\n4. Stay together in crowds and keep location sharing on WhatsApp active.',
    is_checklist: false,
    created_at: '2026-08-20T10:00:00.000Z',
    is_active: true,
  },
];

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

  /* ── Itinerary ────────────────────────────────────── */
  static getItinerary(): ItineraryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITINERARY);
      if (!data) return DEFAULT_ITINERARY;
      return JSON.parse(data);
    } catch {
      return DEFAULT_ITINERARY;
    }
  }

  static saveItinerary(itinerary: ItineraryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(itinerary));
  }

  /* ── Travel Details ───────────────────────────────── */
  static getTravel(): TravelDetail[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAVEL);
      if (!data) return DEFAULT_TRAVEL;
      return JSON.parse(data);
    } catch {
      return DEFAULT_TRAVEL;
    }
  }

  static saveTravel(travel: TravelDetail[]): void {
    localStorage.setItem(STORAGE_KEYS.TRAVEL, JSON.stringify(travel));
  }

  /* ── Notes ────────────────────────────────────────── */
  static getNotes(): TripNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!data) return DEFAULT_NOTES;
      return JSON.parse(data);
    } catch {
      return DEFAULT_NOTES;
    }
  }

  static saveNotes(notes: TripNote[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
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

    // Available cash balance = Actual collected - expenses drawn from common trip fund
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
      pendingCollection,
      collectionProgressPercent,
      totalTripFundExpenses,
      totalPersonalExpenses,
      totalExpenses,
      availableBalance,
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
    csv += 'Name,Phone,Status,Expected (INR),Paid (INR),Payment Mode,Payment Date,Notes\n';
    members.forEach((m) => {
      csv += `"${m.name.replace(/"/g, '""')}","${m.phone}","${m.status}",${m.expected_contribution},${m.amount_paid},"${m.payment_mode}","${m.payment_date || ''}","${(m.notes || '').replace(/"/g, '""')}"\n`;
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
    localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(DEFAULT_ITINERARY));
    localStorage.setItem(STORAGE_KEYS.TRAVEL, JSON.stringify(DEFAULT_TRAVEL));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
  }
}
