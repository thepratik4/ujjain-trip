# Ujjain Boys Trip Management System 🛕

A modern, mobile-first web application designed for a group of friends travelling together to manage a **Common Trip Fund**, track shared and personal expenses with reimbursement reconciliation, plan day-by-day darshan itineraries, save travel bookings, and organize packing lists.

---

## 🌟 Core Concepts

- 💰 **Common Trip Fund Model**: Every confirmed member contributes a fixed upfront amount (e.g. ₹4,000 × 8 confirmed boys = ₹32,000 expected fund). Group expenses are drawn directly from this common pool.
- ⚡ **Real-Time Financial Calculations**:
  - `Expected Fund = Confirmed Members × Contribution Per Person`
  - `Available Balance = Actual Collected − Fund Expenses`
- 🤝 **Personal Payment Reconciliation**: When a member pays out-of-pocket (`source = 'personal'`), the app tracks the reimbursement due to them without corrupting the common pool.
- 📅 **Day-by-Day Itinerary**: Chronological timeline for Bhasma Aarti, Mahakal Lok, Kal Bhairav darshan, Ram Ghat Maha Aarti, and food spots with Google Maps links.
- 🚆 **Travel & Stay Tracker**: Train PNRs, coach & berth allocations, hotel address & reception contacts, and local cab driver details.
- 🎒 **Notes & Checklists**: Interactive packing checklist, emergency numbers, and temple protocols.
- ☁️ **Supabase Sync & Offline-First**: Real-time multi-device cloud synchronization with zero-config `localStorage` offline fallback.

---

## 🛠️ Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **(Optional) Configure Supabase Credentials:**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
