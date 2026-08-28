import React, { useState, useEffect } from 'react';
import {
  X,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  Loader2,
  Camera,
  CreditCard,
  Banknote,
  User,
  Wallet,
  HandCoins,
} from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseSource, PaymentMode, Member } from '../types';
import { DatabaseService } from '../services/db';
import { StorageService } from '../utils/storage';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  editingExpense?: Expense | null;
  existingExpenses?: Expense[];
  members: Member[];
}

const CATEGORIES: { label: ExpenseCategory; icon: string }[] = [
  { label: 'Travel', icon: '🚆' },
  { label: 'Hotel', icon: '🏨' },
  { label: 'Food', icon: '🍛' },
  { label: 'Snacks', icon: '☕' },
  { label: 'Fuel', icon: '⛽' },
  { label: 'Auto/Cab', icon: '🛺' },
  { label: 'Darshan', icon: '🛕' },
  { label: 'Puja', icon: '🪔' },
  { label: 'Tickets', icon: '🎟️' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Entertainment', icon: '🎉' },
  { label: 'Miscellaneous', icon: '📦' },
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  existingExpenses = [],
  members,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI/Online');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState<ExpenseSource>('trip_fund');
  const [paidByName, setPaidByName] = useState<string>('');
  const [paidByMemberId, setPaidByMemberId] = useState<string>('');
  const [billImage, setBillImage] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [paidByError, setPaidByError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsUploading(false);
      if (editingExpense) {
        setTitle(editingExpense.title);
        setCategory(editingExpense.category);
        setAmount(String(editingExpense.amount));
        setPaymentMode(editingExpense.payment_mode || 'UPI/Online');
        setDate(editingExpense.date);
        setSource(editingExpense.source || 'trip_fund');
        setPaidByName(editingExpense.paid_by_name);
        setPaidByMemberId(editingExpense.paid_by_member_id || '');
        setBillImage(editingExpense.bill_image || '');
        setNotes(editingExpense.notes || '');
      } else {
        setTitle('');
        setCategory('Food');
        setAmount('');
        setPaymentMode('UPI/Online');
        setDate(new Date().toISOString().split('T')[0]);
        setSource('trip_fund');
        const defaultPayer = members.find((m) => m.status === 'Confirmed') || members[0];
        setPaidByName(defaultPayer ? defaultPayer.name : 'Group');
        setPaidByMemberId(defaultPayer ? defaultPayer.id : '');
        setBillImage('');
        setNotes('');
      }
      setTitleError('');
      setAmountError('');
      setPaidByError('');
    }
  }, [isOpen, editingExpense, members]);

  if (!isOpen) return null;

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setPaidByMemberId(selectedId);
    const m = members.find((mem) => mem.id === selectedId);
    if (m) {
      setPaidByName(m.name);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await DatabaseService.uploadBillImage(file);
      setBillImage(url);
    } catch (err) {
      console.error('Failed to upload bill photo:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!title.trim()) {
      setTitleError('Expense title is required');
      hasError = true;
    } else {
      setTitleError('');
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('Amount must be greater than 0');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (!paidByName.trim()) {
      setPaidByError('Specify who paid');
      hasError = true;
    } else {
      setPaidByError('');
    }

    if (hasError) return;

    const savedExpense: Expense = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
      expense_number: editingExpense
        ? editingExpense.expense_number
        : StorageService.getNextExpenseNumber(existingExpenses),
      title: title.trim(),
      category,
      amount: numAmount,
      payment_mode: paymentMode,
      date,
      paid_by_name: paidByName.trim(),
      paid_by_member_id: paidByMemberId || undefined,
      source,
      is_reimbursed: editingExpense ? editingExpense.is_reimbursed : false,
      bill_image: billImage || undefined,
      notes: notes.trim() || undefined,
      created_at: editingExpense ? editingExpense.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    onSave(savedExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeup">
      <div
        className="w-full max-w-lg rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingExpense ? 'Edit Trip Expense' : 'Add Trip Expense'}
            </h3>
            <p className="text-xs text-slate-500">Record a payment from fund or out-of-pocket</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Selector: Trip Fund vs Personal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Payment Source *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('trip_fund')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  source === 'trip_fund'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Common Trip Fund</span>
              </button>

              <button
                type="button"
                onClick={() => setSource('personal')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  source === 'personal'
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HandCoins className="w-4 h-4" />
                <span>Personal (Reimburse)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {source === 'trip_fund'
                ? '🏛️ Deducted from common collected cash balance.'
                : '👤 Paid personally by a member; flags as a reimbursement due to them.'}
            </p>
          </div>

          {/* Expense Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Expense Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. Mahakal Lok VIP Passes / Train Tickets / Poha Breakfast"
              className="input-field w-full px-3.5 py-2.5 text-sm"
              autoFocus
            />
            {titleError && <p className="text-xs text-rose-600 font-semibold mt-1">{titleError}</p>}
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    category === cat.label
                      ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (amountError) setAmountError('');
                }}
                min="1"
                placeholder="₹ 0"
                className="input-field w-full px-3.5 py-2.5 text-sm font-extrabold text-slate-900"
              />
              {amountError && <p className="text-xs text-rose-600 font-semibold mt-1">{amountError}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field w-full px-3 py-2.5 text-xs font-medium"
              />
            </div>
          </div>

          {/* Paid By Member & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Paid By Who? *
              </label>
              {members.length > 0 ? (
                <select
                  value={paidByMemberId}
                  onChange={handleMemberSelect}
                  className="input-field w-full px-3 py-2.5 text-xs font-semibold"
                >
                  <option value="">-- Select Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.status})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={paidByName}
                  onChange={(e) => setPaidByName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="input-field w-full px-3 py-2 text-xs"
                />
              )}
              {paidByError && <p className="text-xs text-rose-600 font-semibold mt-1">{paidByError}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI/Online')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                    paymentMode === 'UPI/Online'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Cash')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                    paymentMode === 'Cash'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bill Photo Attachment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Bill / Receipt Photo (Optional)
            </label>

            {billImage ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={billImage}
                  alt="Bill preview"
                  className="w-12 h-12 object-cover rounded-xl border border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    Receipt Attached
                  </span>
                  <span className="text-[10px] text-slate-400">Photo saved with expense</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBillImage('')}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-xs font-bold text-slate-600">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Uploading photo...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-slate-500" />
                    <span>Upload Bill / Receipt Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Notes / Description (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Swiped credit card for 20L petrol / Vendor phone number"
              className="input-field w-full px-3.5 py-2.5 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-3 rounded-2xl font-bold text-xs text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingExpense ? 'Save Changes' : 'Record Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
