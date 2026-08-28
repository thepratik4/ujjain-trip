import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  TripSettings,
  Member,
  Expense,
} from '../types';
import {
  StorageService,
  DEFAULT_SETTINGS,
} from '../utils/storage';

export class DatabaseService {
  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /* ── 1. Settings ────────────────────────────────────── */
  static async getSettings(): Promise<TripSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return StorageService.getSettings();
    }

    try {
      const { data, error } = await supabase
        .from('ujjain_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error || !data) {
        return StorageService.getSettings();
      }

      const settings: TripSettings = {
        trip_name: data.trip_name || DEFAULT_SETTINGS.trip_name,
        subtitle: data.subtitle || DEFAULT_SETTINGS.subtitle,
        destination: data.destination || DEFAULT_SETTINGS.destination,
        start_date: data.start_date || DEFAULT_SETTINGS.start_date,
        end_date: data.end_date || DEFAULT_SETTINGS.end_date,
        contribution_per_person: Number(data.contribution_per_person) || DEFAULT_SETTINGS.contribution_per_person,
        currency: data.currency || DEFAULT_SETTINGS.currency,
        cover_image: data.cover_image || DEFAULT_SETTINGS.cover_image,
      };

      StorageService.saveSettings(settings);
      return settings;
    } catch {
      return StorageService.getSettings();
    }
  }

  static async saveSettings(settings: TripSettings): Promise<void> {
    StorageService.saveSettings(settings);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        await supabase.from('ujjain_settings').upsert(
          {
            id: 'default',
            trip_name: settings.trip_name,
            subtitle: settings.subtitle,
            destination: settings.destination,
            start_date: settings.start_date,
            end_date: settings.end_date,
            contribution_per_person: settings.contribution_per_person,
            currency: settings.currency,
            cover_image: settings.cover_image,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        console.error('Failed to sync settings to Supabase:', err);
      }
    }
  }

  /* ── 2. Members ─────────────────────────────────────── */
  static async getMembers(): Promise<Member[]> {
    if (!isSupabaseConfigured || !supabase) {
      return StorageService.getMembers();
    }

    try {
      const { data, error } = await supabase
        .from('ujjain_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data) {
        return StorageService.getMembers();
      }

      const members: Member[] = data
        .filter((item) => item.is_active !== false)
        .map((item) => ({
          id: item.id,
          trip_id: item.trip_id,
          name: item.name,
          phone: item.phone || '',
          status: item.status || 'Confirmed',
          expected_contribution: Number(item.expected_contribution),
          amount_paid: Number(item.amount_paid || 0),
          payment_mode: item.payment_mode || 'UPI/Online',
          payment_date: item.payment_date || undefined,
          notes: item.notes || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || item.created_at || new Date().toISOString(),
          is_active: item.is_active ?? true,
        }));

      StorageService.saveMembers(members);
      return members;
    } catch (err) {
      console.error('Supabase getMembers fallback to local:', err);
      return StorageService.getMembers();
    }
  }

  static async saveMember(member: Member): Promise<Member> {
    const members = StorageService.getMembers();
    const index = members.findIndex((m) => m.id === member.id);
    const updatedMember: Member = {
      ...member,
      is_active: member.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      members[index] = updatedMember;
    } else {
      members.push(updatedMember);
    }
    StorageService.saveMembers(members);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        const payload: Record<string, any> = {
          id: updatedMember.id,
          trip_id: 'default',
          name: updatedMember.name,
          phone: updatedMember.phone || null,
          status: updatedMember.status,
          expected_contribution: updatedMember.expected_contribution,
          amount_paid: updatedMember.amount_paid,
          payment_mode: updatedMember.payment_mode,
          payment_date: updatedMember.payment_date || null,
          notes: updatedMember.notes || null,
          is_active: updatedMember.is_active,
          created_at: updatedMember.created_at,
          updated_at: updatedMember.updated_at,
        };
        await supabase.from('ujjain_members').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to upsert member to Supabase:', err);
      }
    }

    return updatedMember;
  }

  static async deleteMember(id: string): Promise<void> {
    const members = StorageService.getMembers().filter((m) => m.id !== id);
    StorageService.saveMembers(members);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        await supabase.from('ujjain_members').update({ is_active: false }).eq('id', id);
      } catch (err) {
        console.error('Failed to soft delete member in Supabase:', err);
      }
    }
  }

  /* ── 3. Expenses ────────────────────────────────────── */
  static async getExpenses(): Promise<Expense[]> {
    if (!isSupabaseConfigured || !supabase) {
      return StorageService.getExpenses();
    }

    try {
      const { data, error } = await supabase
        .from('ujjain_expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error || !data) {
        return StorageService.getExpenses();
      }

      const expenses: Expense[] = data
        .filter((item) => item.is_active !== false)
        .map((item) => ({
          id: item.id,
          trip_id: item.trip_id,
          expense_number: item.expense_number,
          title: item.title,
          category: item.category,
          amount: Number(item.amount),
          payment_mode: item.payment_mode,
          date: item.date,
          paid_by_member_id: item.paid_by_member_id || undefined,
          paid_by_name: item.paid_by_name,
          source: item.source || 'trip_fund',
          is_reimbursed: Boolean(item.is_reimbursed),
          bill_image: item.bill_image || '',
          notes: item.notes || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || item.created_at || new Date().toISOString(),
          is_active: item.is_active ?? true,
        }));

      StorageService.saveExpenses(expenses);
      return expenses;
    } catch (err) {
      console.error('Supabase getExpenses fallback:', err);
      return StorageService.getExpenses();
    }
  }

  static async saveExpense(expense: Expense): Promise<Expense> {
    const expenses = StorageService.getExpenses();
    const index = expenses.findIndex((e) => e.id === expense.id);
    const updatedExpense: Expense = {
      ...expense,
      is_active: expense.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      expenses[index] = updatedExpense;
    } else {
      expenses.unshift(updatedExpense);
    }
    StorageService.saveExpenses(expenses);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        const payload: Record<string, any> = {
          id: updatedExpense.id,
          trip_id: 'default',
          expense_number: updatedExpense.expense_number,
          title: updatedExpense.title,
          category: updatedExpense.category,
          amount: updatedExpense.amount,
          payment_mode: updatedExpense.payment_mode,
          date: updatedExpense.date,
          paid_by_member_id: updatedExpense.paid_by_member_id || null,
          paid_by_name: updatedExpense.paid_by_name,
          source: updatedExpense.source,
          is_reimbursed: Boolean(updatedExpense.is_reimbursed),
          bill_image: updatedExpense.bill_image || null,
          notes: updatedExpense.notes || null,
          is_active: updatedExpense.is_active,
          created_at: updatedExpense.created_at,
          updated_at: updatedExpense.updated_at,
        };
        await supabase.from('ujjain_expenses').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to upsert expense to Supabase:', err);
      }
    }

    return updatedExpense;
  }

  static async toggleReimbursement(expenseId: string, isReimbursed: boolean): Promise<void> {
    const expenses = StorageService.getExpenses().map((e) =>
      e.id === expenseId ? { ...e, is_reimbursed: isReimbursed, updated_at: new Date().toISOString() } : e
    );
    StorageService.saveExpenses(expenses);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        await supabase.from('ujjain_expenses').update({ is_reimbursed: isReimbursed }).eq('id', expenseId);
      } catch (err) {
        console.error('Failed to toggle reimbursement in Supabase:', err);
      }
    }
  }

  static async deleteExpense(id: string): Promise<void> {
    const expenses = StorageService.getExpenses().filter((e) => e.id !== id);
    StorageService.saveExpenses(expenses);

    if (isSupabaseConfigured && supabase && this.isOnline()) {
      try {
        await supabase.from('ujjain_expenses').update({ is_active: false }).eq('id', id);
      } catch (err) {
        console.error('Failed to soft delete expense in Supabase:', err);
      }
    }
  }

  /* ── 4. Image Upload Helper ─────────────────────────── */
  static async uploadBillImage(file: File): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `bill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `trip-bills/${fileName}`;

      const { error } = await supabase.storage
        .from('ujjain-bills')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase Storage Upload Error:', error);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from('ujjain-bills')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Upload bill failed:', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /* ── 5. Realtime Channel Subscription ───────────────── */
  static subscribeToRealtime(onSync: () => void) {
    if (!isSupabaseConfigured || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel('ujjain_trip_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ujjain_members' }, () => onSync())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ujjain_expenses' }, () => onSync())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ujjain_settings' }, () => onSync())
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('⚡ Connected to Ujjain Trip Realtime Sync');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
