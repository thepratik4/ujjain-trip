import React, { useState } from 'react';
import {
  StickyNote,
  PlusCircle,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  ListTodo,
  Tag,
  Phone,
  Bookmark,
} from 'lucide-react';
import { TripNote, NoteCategory, ChecklistItem } from '../types';

interface NotesViewProps {
  notes: TripNote[];
  onOpenAddNote: () => void;
  onEditNote: (note: TripNote) => void;
  onDeleteNote: (note: TripNote) => void;
  onToggleChecklistItem: (noteId: string, itemId: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Packing List': { bg: 'bg-amber-100', text: 'text-amber-900' },
  'Important Contacts': { bg: 'bg-rose-100', text: 'text-rose-900' },
  Documents: { bg: 'bg-blue-100', text: 'text-blue-900' },
  'Food & Food Places': { bg: 'bg-orange-100', text: 'text-orange-900' },
  'Temple & Darshan Tips': { bg: 'bg-purple-100', text: 'text-purple-900' },
  'Trip Rules': { bg: 'bg-emerald-100', text: 'text-emerald-900' },
  General: { bg: 'bg-slate-100', text: 'text-slate-900' },
};

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onOpenAddNote,
  onEditNote,
  onDeleteNote,
  onToggleChecklistItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | NoteCategory>('All');

  const filteredNotes = notes.filter((n) => {
    if (n.is_active === false) return false;
    if (activeCategory !== 'All' && n.category !== activeCategory) return false;
    return true;
  });

  const categories = [
    'All',
    'Packing List',
    'Important Contacts',
    'Documents',
    'Food & Food Places',
    'Temple & Darshan Tips',
    'Trip Rules',
    'General',
  ] as const;

  return (
    <div className="space-y-4 pb-24 animate-fadeup">
      {/* ── 1. Header & Add Action ───────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Trip Notes & Lists
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Packing checklists, emergency contacts & food spots
          </p>
        </div>

        <button
          onClick={onOpenAddNote}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {/* ── 2. Category Filter Pills ──────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all border cursor-pointer ${
              activeCategory === cat
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── 3. Notes Grid ─────────────────────────────── */}
      {filteredNotes.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 space-y-2">
          <StickyNote className="w-10 h-10 mx-auto opacity-30 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700">No notes in this category</h4>
          <p className="text-xs text-slate-400">Click "Add Note" to create a new shared list</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const color = CATEGORY_COLORS[note.category] || {
              bg: 'bg-slate-100',
              text: 'text-slate-900',
            };

            return (
              <div
                key={note.id}
                className="card p-5 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Category badge & Actions */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${color.bg} ${color.text}`}
                    >
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditNote(note)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                        title="Edit Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{note.title}</h3>

                  {/* Content: Checklist or Text */}
                  {note.is_checklist && note.checklist_items ? (
                    <div className="space-y-1.5 mt-2">
                      {note.checklist_items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onToggleChecklistItem(note.id, item.id)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-xs select-none"
                        >
                          {item.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={`truncate ${
                              item.checked ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      {note.content}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
