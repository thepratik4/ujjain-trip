import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TripSettings,
  Member,
  Expense,
  ItineraryItem,
  TravelDetail,
  TripNote,
  FinancialSummary,
} from './types';
import { StorageService } from './utils/storage';
import { DatabaseService } from './services/db';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { MembersView } from './components/MembersView';
import { MemberModal } from './components/MemberModal';
import { TripFundView } from './components/TripFundView';
import { ExpensesView } from './components/ExpensesView';
import { ExpenseModal } from './components/ExpenseModal';
import { ItineraryView } from './components/ItineraryView';
import { ItineraryModal } from './components/ItineraryModal';
import { TravelView } from './components/TravelView';
import { TravelModal } from './components/TravelModal';
import { NotesView } from './components/NotesView';
import { NoteModal } from './components/NoteModal';
import { SettingsView } from './components/SettingsView';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BillImageModal } from './components/BillImageModal';
import { AppLockModal } from './components/AppLockModal';
import { generateTripFinancialReportPDF } from './utils/pdfGenerator';

export default function App() {
  const [settings, setSettings] = useState<TripSettings>(StorageService.getSettings());
  const [isAppUnlocked, setIsAppUnlocked] = useState<boolean>(!settings.passcode_enabled);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [travel, setTravel] = useState<TravelDetail[]>([]);
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<ItineraryItem | null>(null);

  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [editingTravel, setEditingTravel] = useState<TravelDetail | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<TripNote | null>(null);

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
      const [fetchedSettings, fetchedMembers, fetchedExpenses, fetchedItin, fetchedTravel, fetchedNotes] =
        await Promise.all([
          DatabaseService.getSettings(),
          DatabaseService.getMembers(),
          DatabaseService.getExpenses(),
          DatabaseService.getItinerary(),
          DatabaseService.getTravel(),
          DatabaseService.getNotes(),
        ]);

      setSettings(fetchedSettings);
      setMembers(fetchedMembers);
      setExpenses(fetchedExpenses);
      setItinerary(fetchedItin);
      setTravel(fetchedTravel);
      setNotes(fetchedNotes);
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
      message: `Are you sure you want to remove ${member.name}? Enter PIN 2020 to confirm.`,
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
      message: `Are you sure you want to remove this ₹${expense.amount} expense? Enter PIN 2020 to confirm.`,
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

  /* ── Itinerary Handlers ───────────────────────────── */
  const handleSaveItinerary = async (item: ItineraryItem) => {
    try {
      await DatabaseService.saveItineraryItem(item);
      setItinerary((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [...prev, item];
      });
    } catch (err) {
      console.error('Error saving itinerary item:', err);
    }
  };

  const handleDeleteItinerary = (item: ItineraryItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Event: ${item.title}`,
      message: `Are you sure you want to remove this itinerary event? Enter PIN 2020 to confirm.`,
      confirmLabel: 'Delete Event',
      isDanger: true,
      onConfirm: async () => {
        try {
          await DatabaseService.deleteItineraryItem(item.id);
          setItinerary((prev) => prev.filter((i) => i.id !== item.id));
        } catch (err) {
          console.error('Failed to delete itinerary:', err);
        }
      },
    });
  };

  const handleToggleItineraryComplete = async (item: ItineraryItem) => {
    const updated = { ...item, is_completed: !item.is_completed };
    await handleSaveItinerary(updated);
  };

  /* ── Travel Handlers ──────────────────────────────── */
  const handleSaveTravel = async (detail: TravelDetail) => {
    try {
      await DatabaseService.saveTravelDetail(detail);
      setTravel((prev) => {
        const idx = prev.findIndex((t) => t.id === detail.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = detail;
          return next;
        }
        return [...prev, detail];
      });
    } catch (err) {
      console.error('Error saving travel detail:', err);
    }
  };

  const handleDeleteTravel = (detail: TravelDetail) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete: ${detail.title}`,
      message: `Are you sure you want to remove this travel detail? Enter PIN 2020 to confirm.`,
      confirmLabel: 'Delete Record',
      isDanger: true,
      onConfirm: async () => {
        try {
          await DatabaseService.deleteTravelDetail(detail.id);
          setTravel((prev) => prev.filter((t) => t.id !== detail.id));
        } catch (err) {
          console.error('Failed to delete travel detail:', err);
        }
      },
    });
  };

  /* ── Notes Handlers ───────────────────────────────── */
  const handleSaveNote = async (note: TripNote) => {
    try {
      await DatabaseService.saveNote(note);
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === note.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = note;
          return next;
        }
        return [note, ...prev];
      });
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDeleteNote = (note: TripNote) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Note: ${note.title}`,
      message: `Are you sure you want to remove this note? Enter PIN 2020 to confirm.`,
      confirmLabel: 'Delete Note',
      isDanger: true,
      onConfirm: async () => {
        try {
          await DatabaseService.deleteNote(note.id);
          setNotes((prev) => prev.filter((n) => n.id !== note.id));
        } catch (err) {
          console.error('Failed to delete note:', err);
        }
      },
    });
  };

  const handleToggleChecklistItem = async (noteId: string, itemId: string) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote || !targetNote.checklist_items) return;

    const updatedItems = targetNote.checklist_items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const updatedNote: TripNote = {
      ...targetNote,
      checklist_items: updatedItems,
    };

    await handleSaveNote(updatedNote);
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
      message: 'This will reset all trip data back to the default Ujjain Boys Trip demo data. Enter PIN 2020 to confirm.',
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
    if (imported.itinerary) setItinerary(imported.itinerary);
    if (imported.travel) setTravel(imported.travel);
    if (imported.notes) setNotes(imported.notes);

    if (imported.settings) StorageService.saveSettings(imported.settings);
    if (imported.members) StorageService.saveMembers(imported.members);
    if (imported.expenses) StorageService.saveExpenses(imported.expenses);
    if (imported.itinerary) StorageService.saveItinerary(imported.itinerary);
    if (imported.travel) StorageService.saveTravel(imported.travel);
    if (imported.notes) StorageService.saveNotes(imported.notes);
  };

  const handleQuickBackup = () => {
    const doc = generateTripFinancialReportPDF(members, expenses, summary, settings);
    doc.save(`${settings.trip_name.replace(/\s+/g, '_')}_Financial_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--color-text)] flex flex-col font-sans select-none sm:select-text">
      {/* ── App Lock PIN Modal ── */}
      {settings.passcode_enabled && !isAppUnlocked && (
        <AppLockModal
          isUnlocked={isAppUnlocked}
          onUnlock={() => setIsAppUnlocked(true)}
          settings={settings}
        />
      )}

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
            itinerary={itinerary}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onOpenAddMember={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            onOpenAddItinerary={() => {
              setEditingItinerary(null);
              setIsItineraryModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onViewBillImage={(url) => {
              setActiveBillUrl(url);
              setIsBillModalOpen(true);
            }}
            onToggleReimburse={handleToggleReimburse}
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

        {activeTab === 'fund' && (
          <TripFundView
            settings={settings}
            summary={summary}
            members={members}
            expenses={expenses}
            onToggleReimburse={handleToggleReimburse}
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onOpenAddMember={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
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

        {activeTab === 'itinerary' && (
          <ItineraryView
            itinerary={itinerary}
            settings={settings}
            onOpenAddItinerary={() => {
              setEditingItinerary(null);
              setIsItineraryModalOpen(true);
            }}
            onEditItinerary={(item) => {
              setEditingItinerary(item);
              setIsItineraryModalOpen(true);
            }}
            onDeleteItinerary={handleDeleteItinerary}
            onToggleComplete={handleToggleItineraryComplete}
          />
        )}

        {activeTab === 'travel' && (
          <TravelView
            travelList={travel}
            onOpenAddTravel={() => {
              setEditingTravel(null);
              setIsTravelModalOpen(true);
            }}
            onEditTravel={(item) => {
              setEditingTravel(item);
              setIsTravelModalOpen(true);
            }}
            onDeleteTravel={handleDeleteTravel}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onOpenAddNote={() => {
              setEditingNote(null);
              setIsNoteModalOpen(true);
            }}
            onEditNote={(note) => {
              setEditingNote(note);
              setIsNoteModalOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onToggleChecklistItem={handleToggleChecklistItem}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            members={members}
            expenses={expenses}
            itinerary={itinerary}
            travel={travel}
            notes={notes}
            onSaveSettings={handleSaveSettings}
            onResetData={handleResetData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* ── Fixed Bottom Navigation Bar ── */}
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

      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => {
          setIsItineraryModalOpen(false);
          setEditingItinerary(null);
        }}
        onSave={handleSaveItinerary}
        editingItem={editingItinerary}
        settings={settings}
      />

      <TravelModal
        isOpen={isTravelModalOpen}
        onClose={() => {
          setIsTravelModalOpen(false);
          setEditingTravel(null);
        }}
        onSave={handleSaveTravel}
        editingDetail={editingTravel}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
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
