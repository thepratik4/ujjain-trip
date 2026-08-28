import React from 'react';
import { AlertTriangle, X, Trash2, CheckCircle2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  isDanger = true,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirmAction = () => {
    onConfirm();
    onClose();
  };

  const accentColor = isDanger ? 'var(--color-expense)' : 'var(--color-gold)';
  const accentBg = isDanger ? 'var(--color-expense-light)' : 'var(--color-gold-light)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeup"
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 relative shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: accentBg, color: accentColor }}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3
            className="text-base font-bold leading-snug pr-6 text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {title}
          </h3>
        </div>

        <p className="text-xs leading-relaxed mb-5 text-slate-600">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAction}
            className="flex-1 py-2.5 rounded-2xl font-bold text-xs text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            style={{ backgroundColor: isDanger ? 'var(--color-expense)' : '#18181B' }}
          >
            {isDanger ? <Trash2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
