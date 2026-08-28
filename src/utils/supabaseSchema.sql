-- ==============================================================================
-- UJJAIN BOYS TRIP MANAGEMENT SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Tables prefixed with "ujjain_" to prevent collision with other apps in the same DB
-- ==============================================================================

-- 1. Ujjain Trip Settings Table
CREATE TABLE IF NOT EXISTS ujjain_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  trip_name TEXT NOT NULL DEFAULT 'Ujjain Trip',
  subtitle TEXT DEFAULT 'Boys Trip • 2026',
  destination TEXT DEFAULT 'Ujjain, Madhya Pradesh',
  start_date TEXT DEFAULT '2026-09-18',
  end_date TEXT DEFAULT '2026-09-21',
  contribution_per_person NUMERIC NOT NULL DEFAULT 4000,
  currency TEXT DEFAULT '₹',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row if not exists
INSERT INTO ujjain_settings (id, trip_name, subtitle, destination, start_date, end_date, contribution_per_person)
VALUES ('default', 'Ujjain Trip', 'Boys Trip • 2026', 'Ujjain, Madhya Pradesh', '2026-09-18', '2026-09-21', 4000)
ON CONFLICT (id) DO NOTHING;


-- 2. Ujjain Trip Members Table
CREATE TABLE IF NOT EXISTS ujjain_members (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed', -- 'Confirmed', 'Maybe', 'Not Going'
  expected_contribution NUMERIC NOT NULL DEFAULT 4000,
  amount_paid NUMERIC NOT NULL DEFAULT 4000,
  payment_mode TEXT DEFAULT 'UPI/Online', -- 'UPI/Online', 'Cash'
  payment_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ujjain_members_active ON ujjain_members(is_active);


-- 3. Ujjain Trip Expenses Table
CREATE TABLE IF NOT EXISTS ujjain_expenses (
  id TEXT PRIMARY KEY,
  trip_id TEXT DEFAULT 'default',
  expense_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Travel', 'Hotel', 'Food', 'Snacks', 'Fuel', 'Auto/Cab', 'Darshan', 'Puja', 'Tickets', 'Shopping', 'Entertainment', 'Miscellaneous'
  amount NUMERIC NOT NULL,
  payment_mode TEXT DEFAULT 'UPI/Online',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  paid_by_member_id TEXT,
  paid_by_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'trip_fund', -- 'trip_fund', 'personal'
  is_reimbursed BOOLEAN DEFAULT FALSE,
  bill_image TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ujjain_expenses_date ON ujjain_expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_ujjain_expenses_source ON ujjain_expenses(source);


-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY & OPEN ANON POLICIES
-- ==============================================================================
ALTER TABLE ujjain_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ujjain_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ujjain_expenses ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access with Supabase anon key
DROP POLICY IF EXISTS "Public access on ujjain_settings" ON ujjain_settings;
CREATE POLICY "Public access on ujjain_settings" ON ujjain_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on ujjain_members" ON ujjain_members;
CREATE POLICY "Public access on ujjain_members" ON ujjain_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on ujjain_expenses" ON ujjain_expenses;
CREATE POLICY "Public access on ujjain_expenses" ON ujjain_expenses FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- ENABLE REALTIME REPLICATION
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE ujjain_settings, ujjain_members, ujjain_expenses;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;
