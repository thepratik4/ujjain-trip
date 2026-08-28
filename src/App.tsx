import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TripSettings,
  Member,
  Expense,
  FinancialSummary,
} from './types';
import { StorageService } from './utils/storage';
import { DatabaseService } from './services/db';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { MembersView } from './components/MembersView';
import { MemberModal } from './components/MemberModal';
import { ExpensesView } from './components/ExpensesView';
import { ExpenseModal } from './components/ExpenseModal';
import { SettingsView } from './components/SettingsView';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BillImageModal } from './components/BillImageModal';
import { generateTripFinancialReportPDF } from './utils/pdfGenerator';

export default function App() {
  const [settings, setSettings] = useState<TripSettings>(StorageService.getSettings());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [activeBillUrl, setActiveBillUrl] = useState<string | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Calculate live financial summary
  const summary: FinancialSummary = useMemo(() => {
    return StorageService.getFinancialSummary(members, expenses, settings);
  }, [members, expenses, settings]);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedSettings, fetchedMembers, fetchedExpenses] = await Promise.all([
        DatabaseService.getSettings(),
        DatabaseService.getMembers(),
        DatabaseService.getExpenses(),
      ]);

      setSettings(fetchedSettings);
      setMembers(fetchedMembers);
      setExpenses(fetchedExpenses);
    } catch (err) {
      console.error('Failed to load trip data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = DatabaseService.subscribeToRealtime(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  /* ── Member Handlers ──────────────────────────────── */
  const handleSaveMember = async (member: Member) => {
    try {
      await DatabaseService.saveMember(member);
      setMembers((prev) => {
        const idx = prev.findIndex((m) => m.id === member.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = member;
          return next;
        }
        return [...prev, member];
      });
    } catch (err) {
      console.error('Error saving member:', err);
    }
  };

  const handleDeleteMember = (member: Member) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Member: ${member.name}`,
      message: `Are you sure you want to remove ${member.name} from the trip?`,
      confirmLabel: 'Delete Member',
      isDanger: true,
      onConfirm: async () => {
        try {
          await DatabaseService.deleteMember(member.id);
          setMembers((prev) => prev.filter((m) => m.id !== member.id));
        } catch (err) {
          console.error('Failed to delete member:', err);
        }
      },
    });
  };

  /* ── Expense Handlers ─────────────────────────────── */
  const handleSaveExpense = async (expense: Expense) => {
    try {
      await DatabaseService.saveExpense(expense);
      setExpenses((prev) => {
        const idx = prev.findIndex((e) => e.id === expense.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = expense;
          return next;
        }
        return [expense, ...prev];
      });
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const handleDeleteExpense = (expense: Expense) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Expense: ${expense.title}`,
      message: `Are you sure you want to delete this ₹${expense.amount} expense record?`,
      confirmLabel: 'Delete Expense',
      isDanger: true,
      onConfirm: async () => {
        try {
          await DatabaseService.deleteExpense(expense.id);
          setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
        } catch (err) {
          console.error('Failed to delete expense:', err);
        }
      },
    });
  };

  const handleToggleReimburse = async (expenseId: string, isReimbursed: boolean) => {
    try {
      await DatabaseService.toggleReimbursement(expenseId, isReimbursed);
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseId ? { ...e, is_reimbursed: isReimbursed } : e))
      );
    } catch (err) {
      console.error('Failed to toggle reimbursement:', err);
    }
  };

  /* ── Settings & Reset Handlers ────────────────────── */
  const handleSaveSettings = async (newSettings: TripSettings) => {
    setSettings(newSettings);
    await DatabaseService.saveSettings(newSettings);
  };

  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Demo Data',
      message: 'This will reset all members and expenses back to the default Ujjain Boys Trip demo data.',
      confirmLabel: 'Reset Data',
      isDanger: true,
      onConfirm: () => {
        StorageService.resetToDefaults();
        loadData();
      },
    });
  };

  const handleImportData = (imported: any) => {
    if (imported.settings) setSettings(imported.settings);
    if (imported.members) setMembers(imported.members);
    if (imported.expenses) setExpenses(imported.expenses);

    if (imported.settings) StorageService.saveSettings(imported.settings);
    if (imported.members) StorageService.saveMembers(imported.members);
    if (imported.expenses) StorageService.saveExpenses(imported.expenses);
  };

  const handleQuickBackup = () => {
    const doc = generateTripFinancialReportPDF(members, expenses, summary, settings);
    doc.save(`${settings.trip_name.replace(/\s+/g, '_')}_Financial_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--color-text)] flex flex-col font-sans select-none sm:select-text">
      {/* ── Header ── */}
      <Header
        settings={settings}
        summary={summary}
        onOpenSettings={() => setActiveTab('settings')}
        onQuickBackup={handleQuickBackup}
      />

      {/* ── Main Tab Content ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            settings={settings}
            summary={summary}
            members={members}
            expenses={expenses}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onOpenAddMember={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onViewBillImage={(url) => {
              setActiveBillUrl(url);
              setIsBillModalOpen(true);
            }}
          />
        )}

        {activeTab === 'members' && (
          <MembersView
            members={members}
            summary={summary}
            onOpenAddMember={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsMemberModalOpen(true);
            }}
            onDeleteMember={handleDeleteMember}
            onQuickPayMember={(m) => {
              setEditingMember(m);
              setIsMemberModalOpen(true);
            }}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            settings={settings}
            expenses={expenses}
            members={members}
            summary={summary}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onEditExpense={(e) => {
              setEditingExpense(e);
              setIsExpenseModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
            onViewBillImage={(url) => {
              setActiveBillUrl(url);
              setIsBillModalOpen(true);
            }}
            onToggleReimburse={handleToggleReimburse}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            members={members}
            expenses={expenses}
            onSaveSettings={handleSaveSettings}
            onResetData={handleResetData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* ── 3-Button Fixed Bottom Navigation Bar ── */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* ── Modals ── */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
        settings={settings}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        existingExpenses={expenses}
        members={members}
      />

      <BillImageModal
        isOpen={isBillModalOpen}
        imageUrl={activeBillUrl}
        onClose={() => {
          setIsBillModalOpen(false);
          setActiveBillUrl(null);
        }}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
