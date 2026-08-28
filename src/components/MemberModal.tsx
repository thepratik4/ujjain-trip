import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle2, CreditCard, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Member, MemberStatus, PaymentMode, TripSettings } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  editingMember?: Member | null;
  settings: TripSettings;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMember,
  settings,
}) => {
  const defaultContribution = String(settings.contribution_per_person || 4000);

  const [name, setName] = useState('');
  const [status, setStatus] = useState<MemberStatus>('Confirmed');
  const [expectedContribution, setExpectedContribution] = useState<string>(defaultContribution);
  const [amountPaid, setAmountPaid] = useState<string>(defaultContribution);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI/Online');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        setName(editingMember.name);
        setStatus(editingMember.status);
        setExpectedContribution(String(editingMember.expected_contribution || defaultContribution));
        // If amount_paid is 0 or undefined, pre-fill with 4000 so the user gets 4000 written directly
        const initialPaid = editingMember.amount_paid > 0 ? editingMember.amount_paid : Number(defaultContribution);
        setAmountPaid(String(initialPaid));
        setPaymentMode(editingMember.payment_mode || 'UPI/Online');
        setPaymentDate(editingMember.payment_date || new Date().toISOString().split('T')[0]);
        setNotes(editingMember.notes || '');
      } else {
        setName('');
        setStatus('Confirmed');
        setExpectedContribution(defaultContribution);
        setAmountPaid(defaultContribution); // Defaults to 4000
        setPaymentMode('UPI/Online');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
      setNameError('');
      setAmountError('');
    }
  }, [isOpen, editingMember, settings, defaultContribution]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!name.trim()) {
      setNameError('Member name is required');
      hasError = true;
    } else {
      setNameError('');
    }

    const expNum = Number(expectedContribution);
    const paidNum = Number(amountPaid);

    if (isNaN(expNum) || expNum < 0) {
      setAmountError('Invalid expected contribution');
      hasError = true;
    } else if (isNaN(paidNum) || paidNum < 0) {
      setAmountError('Invalid amount paid');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (hasError) return;

    const savedMember: Member = {
      id: editingMember ? editingMember.id : `mem-${Date.now()}`,
      name: name.trim(),
      phone: '',
      status,
      expected_contribution: expNum,
      amount_paid: paidNum,
      payment_mode: paymentMode,
      payment_date: paidNum > 0 ? paymentDate : undefined,
      notes: notes.trim() || undefined,
      created_at: editingMember ? editingMember.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    onSave(savedMember);

    // Confetti celebration if member paid in full
    if (paidNum >= expNum && (!editingMember || editingMember.amount_paid < expNum)) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeup">
      <div
        className="w-full max-w-md rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
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
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingMember ? 'Edit Trip Member' : 'Add Trip Member'}
            </h3>
            <p className="text-xs text-slate-500">Record member contribution & attendance</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Member Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="e.g. Rahul Sharma"
              className="input-field w-full px-3.5 py-2.5 text-sm"
              autoFocus
            />
            {nameError && <p className="text-xs text-rose-600 font-semibold mt-1">{nameError}</p>}
          </div>

          {/* Trip Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Trip Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Confirmed', 'Maybe', 'Not Going'] as MemberStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    status === st
                      ? st === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : st === 'Maybe'
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-rose-100 text-rose-900 border-rose-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {status === 'Confirmed'
                ? '✅ Included in expected trip fund calculation.'
                : '⚠️ Excluded from expected trip fund.'}
            </p>
          </div>

          {/* Expected vs Paid Contribution */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Expected (₹)
              </label>
              <input
                type="number"
                value={expectedContribution}
                onChange={(e) => setExpectedContribution(e.target.value)}
                min="0"
                className="input-field w-full px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Paid (₹)
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                min="0"
                className="input-field w-full px-3.5 py-2.5 text-sm font-bold text-emerald-800"
              />
            </div>
          </div>
          {amountError && <p className="text-xs text-rose-600 font-semibold">{amountError}</p>}

          {/* Payment Mode & Date (Always Visible) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI/Online')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer ${
                    paymentMode === 'UPI/Online'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>UPI / Online</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Cash')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer ${
                    paymentMode === 'Cash'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="input-field w-full px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via GPay / Informs vegetarian food only"
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
              className="flex-1 py-3 rounded-2xl font-bold text-xs text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
