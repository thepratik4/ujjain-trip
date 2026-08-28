import React, { useState, useEffect } from 'react';
import { X, CalendarDays, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { ItineraryItem, TripSettings } from '../types';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ItineraryItem) => void;
  editingItem?: ItineraryItem | null;
  settings: TripSettings;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  settings,
}) => {
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [date, setDate] = useState<string>(settings.start_date || '2026-09-18');
  const [timeLabel, setTimeLabel] = useState<string>('09:00 AM');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setDayNumber(editingItem.day_number);
        setDate(editingItem.date);
        setTimeLabel(editingItem.time_label);
        setTitle(editingItem.title);
        setLocation(editingItem.location || '');
        setMapUrl(editingItem.map_url || '');
        setDescription(editingItem.description || '');
        setNotes(editingItem.notes || '');
      } else {
        setDayNumber(1);
        setDate(settings.start_date || '2026-09-18');
        setTimeLabel('09:00 AM');
        setTitle('');
        setLocation('');
        setMapUrl('');
        setDescription('');
        setNotes('');
      }
      setTitleError('');
    }
  }, [isOpen, editingItem, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Title / Activity name is required');
      return;
    }

    const savedItem: ItineraryItem = {
      id: editingItem ? editingItem.id : `itin-${Date.now()}`,
      day_number: Number(dayNumber) || 1,
      date,
      time_label: timeLabel.trim() || '09:00 AM',
      title: title.trim(),
      location: location.trim() || undefined,
      map_url: mapUrl.trim() || undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      is_completed: editingItem ? editingItem.is_completed : false,
      created_at: editingItem ? editingItem.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    onSave(savedItem);
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
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingItem ? 'Edit Itinerary Event' : 'Add Itinerary Event'}
            </h3>
            <p className="text-xs text-slate-500">Plan darshan, food tours & temple visits</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day Number & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Day Number
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="input-field w-full px-3 py-2.5 text-xs font-bold"
              >
                <option value={1}>Day 1 (Departure / Travel)</option>
                <option value={2}>Day 2 (Ujjain Darshan)</option>
                <option value={3}>Day 3 (Bhasma Aarti & Temples)</option>
                <option value={4}>Day 4 (Return / Omkareshwar)</option>
                <option value={5}>Day 5</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Time (e.g. 05:00 AM)
              </label>
              <input
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="e.g. 04:30 AM"
                className="input-field w-full px-3.5 py-2.5 text-xs font-bold"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full px-3 py-2.5 text-xs font-medium"
            />
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Activity / Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. Shri Mahakaleshwar Bhasma Aarti"
              className="input-field w-full px-3.5 py-2.5 text-sm"
              autoFocus
            />
            {titleError && <p className="text-xs text-rose-600 font-semibold mt-1">{titleError}</p>}
          </div>

          {/* Location & Google Maps Link */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Location / Venue
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mahakaleshwar Temple Gate 4"
                  className="input-field w-full pl-9 pr-3.5 py-2.5 text-xs"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Google Maps Link (Optional)
              </label>
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="input-field w-full px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Description & Tips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description / Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Gather at lobby by 03:00 AM. Wear traditional white dhoti."
              className="input-field w-full px-3.5 py-2 text-xs"
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
              <span>{editingItem ? 'Save Changes' : 'Add Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
