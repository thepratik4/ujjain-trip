import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ReceiptText,
  CalendarDays,
  Train,
  StickyNote,
  Settings,
  MoreHorizontal,
  X,
  ChevronRight,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'members'
  | 'fund'
  | 'expenses'
  | 'itinerary'
  | 'travel'
  | 'notes'
  | 'settings';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members' as ActiveTab, label: 'Members', icon: Users },
    { id: 'fund' as ActiveTab, label: 'Trip Fund', icon: Wallet },
    { id: 'expenses' as ActiveTab, label: 'Expenses', icon: ReceiptText },
    { id: 'itinerary' as ActiveTab, label: 'Itinerary', icon: CalendarDays },
  ];

  const secondaryTabs = [
    {
      id: 'travel' as ActiveTab,
      label: 'Travel & Stay',
      desc: 'Train, hotel bookings & transport',
      icon: Train,
    },
    {
      id: 'notes' as ActiveTab,
      label: 'Notes & Packing',
      desc: 'Checklists, food spots & temple rules',
      icon: StickyNote,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Trip Settings',
      desc: 'Budget per person, backup & sync',
      icon: Settings,
    },
  ];

  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  const handleTabClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* ── More Slide-up Menu Drawer ── */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fadeup"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl p-5 pb-24 shadow-2xl space-y-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                More Trip Tools
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className="flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer"
                    style={{
                      backgroundColor: isActive ? 'var(--color-gold-light)' : 'var(--bg-subtle)',
                      border: `1.5px solid ${isActive ? 'var(--color-gold-muted)' : 'var(--color-border)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: isActive ? 'var(--color-gold)' : '#ffffff',
                          color: isActive ? '#ffffff' : 'var(--color-primary)',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className="text-sm font-bold"
                          style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text)' }}
                        >
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* Desktop / Tablet All 8 Tabs */}
        <div className="hidden md:flex max-w-4xl mx-auto px-4 py-2 items-center justify-between gap-1">
          {[...mainTabs, ...secondaryTabs].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--color-gold-light)' : 'transparent',
                  color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                  border: isActive ? '1px solid var(--color-gold-muted)' : '1px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile 5 Main Tabs + More Drawer Toggle */}
        <div className="flex md:hidden max-w-md mx-auto px-2 py-1.5 items-center justify-around">
          {mainTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer"
                style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
              >
                <div
                  className="p-1.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--color-gold-light)' : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
                </div>
                <span
                  className="text-[10px] mt-0.5 tracking-tight font-medium"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Toggle */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative"
            style={{ color: isSecondaryActive ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
          >
            <div
              className="p-1.5 rounded-xl transition-all relative"
              style={{
                backgroundColor: isSecondaryActive ? 'var(--color-gold-light)' : 'transparent',
              }}
            >
              <MoreHorizontal className="w-5 h-5" strokeWidth={isSecondaryActive ? 2.4 : 1.8} />
              {isSecondaryActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600" />
              )}
            </div>
            <span
              className="text-[10px] mt-0.5 tracking-tight font-medium"
              style={{
                fontWeight: isSecondaryActive ? 700 : 500,
                color: isSecondaryActive ? 'var(--color-gold)' : 'var(--color-text-muted)',
              }}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
