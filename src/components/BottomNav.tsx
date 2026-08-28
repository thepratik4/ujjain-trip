import React from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'members' | 'expenses' | 'settings';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'members' as ActiveTab,
      label: 'Members',
      icon: Users,
    },
    {
      id: 'expenses' as ActiveTab,
      label: 'Fund & Expenses',
      icon: Wallet,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all cursor-pointer"
              style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)' }}
            >
              <div
                className="p-1.5 rounded-xl transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--color-gold-light)' : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className="text-xs mt-0.5 tracking-tight font-medium"
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
      </div>
    </nav>
  );
};
