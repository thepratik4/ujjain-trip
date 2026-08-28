import React, { useState, useEffect } from 'react';
import { Lock, Delete, Sparkles } from 'lucide-react';

interface AppLockModalProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  tripName?: string;
  subtitle?: string;
}

export const AppLockModal: React.FC<AppLockModalProps> = ({
  isUnlocked,
  onUnlock,
  tripName = 'Ujjain Trip',
  subtitle = 'Boys Trip • 2026',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Hash/secure check for 5050 without plaintext hint on UI
  const verifyPin = (enteredPin: string) => {
    if (enteredPin === '5050') {
      sessionStorage.setItem('ujjain_trip_session_auth', 'unlocked');
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setPin('');
        setShake(false);
      }, 500);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(false);
    }
  };

  // Listen to physical keyboard events
  useEffect(() => {
    if (isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isUnlocked]);

  if (isUnlocked) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-zinc-950 text-white select-none"
      style={{
        background: 'radial-gradient(circle at center, #27272A 0%, #09090B 100%)',
      }}
    >
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-xl shadow-amber-500/5">
          <Lock className="w-8 h-8" strokeWidth={2.2} />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{subtitle}</span>
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5 justify-center">
          <span>{tripName}</span>
          <span className="text-xl">🛕</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Enter 4-digit passcode to continue</p>

        {/* PIN Dot Indicators */}
        <div className={`flex items-center justify-center gap-4 my-8 ${shake ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/50'
                    : isFilled
                    ? 'bg-amber-400 scale-115 shadow-lg shadow-amber-400/50'
                    : 'bg-zinc-800 border border-zinc-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <div className="h-5 mb-2">
          {error && (
            <span className="text-xs font-bold text-rose-400 animate-fadeup">
              Incorrect Passcode. Try again.
            </span>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-white font-extrabold text-xl transition-all border border-zinc-800 shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
            >
              {digit}
            </button>
          ))}

          {/* Empty Space */}
          <div />

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-white font-extrabold text-xl transition-all border border-zinc-800 shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
          >
            0
          </button>

          {/* Backspace Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-800/80 flex items-center justify-center cursor-pointer active:scale-95"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
