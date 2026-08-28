-- ==============================================================================
-- Ujjain Boys Trip Management System - Supabase Schema
-- ==============================================================================

-- 1. Trip Settings Table
CREATE TABLE IF NOT EXISTS trip_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  trip_name TEXT NOT NULL DEFAULT 'Ujjain Trip',
  subtitle TEXT DEFAULT 'Boys Trip • 2026',
  destination TEXT DEFAULT 'Ujjain, Madhya Pradesh',
  start_date DATE DEFAULT '2026-09-18',
  end_date DATE DEFAULT '2026-09-21',
  contribution_per_person NUMERIC NOT NULL DEFAULT 4000,
  currency TEXT DEFAULT '₹',
  cover_image TEXT,
  passcode_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trip Members Table
CREATE TABLE IF NOT EXISTS trip_members (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed', -- 'Confirmed' | 'Maybe' | 'Not Going'
  expected_contribution NUMERIC NOT NULL DEFAULT 4000,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  payment_mode TEXT DEFAULT 'UPI/Online', -- 'UPI/Online' | 'Cash'
  payment_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Trip Expenses Table
CREATE TABLE IF NOT EXISTS trip_expenses (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  expense_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Travel' | 'Hotel' | 'Food' | 'Snacks' | 'Fuel' | 'Auto/Cab' | 'Darshan' | 'Puja' | 'Tickets' | 'Shopping' | 'Entertainment' | 'Miscellaneous'
  amount NUMERIC NOT NULL,
  payment_mode TEXT DEFAULT 'UPI/Online',
  date DATE NOT NULL,
  paid_by_member_id TEXT,
  paid_by_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'trip_fund', -- 'trip_fund' | 'personal'
  is_reimbursed BOOLEAN DEFAULT false,
  bill_image TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Trip Itinerary Table
CREATE TABLE IF NOT EXISTS trip_itinerary (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  day_number INTEGER NOT NULL DEFAULT 1,
  date DATE NOT NULL,
  time_label TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  map_url TEXT,
  description TEXT,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Trip Travel Details Table
CREATE TABLE IF NOT EXISTS trip_travel (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  type TEXT NOT NULL, -- 'outbound' | 'return' | 'stay' | 'local'
  mode TEXT,
  title TEXT NOT NULL,
  booking_ref TEXT,
  departure_station TEXT,
  arrival_station TEXT,
  departure_time TEXT,
  arrival_time TEXT,
  hotel_name TEXT,
  address TEXT,
  contact_number TEXT,
  map_url TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Trip Notes & Checklists Table
CREATE TABLE IF NOT EXISTS trip_notes (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  is_checklist BOOLEAN DEFAULT false,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and Realtime (Permissive policy for public client access)
ALTER TABLE trip_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_travel ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read/Write Settings" ON trip_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Members" ON trip_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Expenses" ON trip_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Itinerary" ON trip_itinerary FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Travel" ON trip_travel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Notes" ON trip_notes FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Settings Row
INSERT INTO trip_settings (id, trip_name, subtitle, destination, start_date, end_date, contribution_per_person)
VALUES ('default', 'Ujjain Trip', 'Boys Trip • 2026', 'Ujjain, Madhya Pradesh', '2026-09-18', '2026-09-21', 4000)
ON CONFLICT (id) DO NOTHING;
