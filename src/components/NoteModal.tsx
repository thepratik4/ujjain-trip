import React, { useState, useEffect } from 'react';
import { X, StickyNote, CheckCircle2, ListTodo, Plus, Trash2 } from 'lucide-react';
import { TripNote, NoteCategory, ChecklistItem } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: TripNote) => void;
  editingNote?: TripNote | null;
}

const CATEGORIES: NoteCategory[] = [
  'Packing List',
  'Important Contacts',
  'Documents',
  'Food & Food Places',
  'Temple & Darshan Tips',
  'Trip Rules',
  'General',
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNote,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoteCategory>('General');
  const [content, setContent] = useState('');
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        setTitle(editingNote.title);
        setCategory(editingNote.category);
        setContent(editingNote.content || '');
        setIsChecklist(Boolean(editingNote.is_checklist));
        setChecklistItems(editingNote.checklist_items || []);
      } else {
        setTitle('');
        setCategory('General');
        setContent('');
        setIsChecklist(false);
        setChecklistItems([]);
      }
      setNewItemText('');
      setTitleError('');
    }
  }, [isOpen, editingNote]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newItemText.trim()) return;
    setChecklistItems([
      ...checklistItems,
      { id: `chk-${Date.now()}`, text: newItemText.trim(), checked: false },
    ]);
    setNewItemText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    const saved: TripNote = {
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      is_checklist: isChecklist,
      checklist_items: isChecklist ? checklistItems : undefined,
      created_at: editingNote ? editingNote.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    onSave(saved);
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
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingNote ? 'Edit Trip Note' : 'Add Trip Note / Checklist'}
            </h3>
            <p className="text-xs text-slate-500">Packing list, contacts, food spots & tips</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="input-field w-full px-3 py-2.5 text-xs font-bold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Note Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. 🎒 Boys Packing List"
              className="input-field w-full px-3.5 py-2.5 text-sm"
              autoFocus
            />
            {titleError && <p className="text-xs text-rose-600 font-semibold mt-1">{titleError}</p>}
          </div>

          {/* Note Type Toggle (Text vs Checklist) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Format
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsChecklist(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    !isChecklist
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Text Note
                </button>
                <button
                  type="button"
                  onClick={() => setIsChecklist(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isChecklist
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  ☑️ Checklist
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Mode */}
          {isChecklist ? (
            <div className="space-y-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  placeholder="Add item (e.g. Power bank / Dhoti)..."
                  className="input-field flex-1 px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="p-2 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {checklistItems.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <span className="truncate text-slate-800">{item.text}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Regular Text Content */
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Content / Notes
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Type your notes, recommendations, temple timings or rules..."
                className="input-field w-full px-3.5 py-2.5 text-xs leading-relaxed"
              />
            </div>
          )}

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
              <span>{editingNote ? 'Save Changes' : 'Add Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
