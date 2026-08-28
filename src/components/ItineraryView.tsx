import React, { useState } from 'react';
import {
  CalendarDays,
  PlusCircle,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { ItineraryItem, TripSettings } from '../types';

interface ItineraryViewProps {
  itinerary: ItineraryItem[];
  settings: TripSettings;
  onOpenAddItinerary: () => void;
  onEditItinerary: (item: ItineraryItem) => void;
  onDeleteItinerary: (item: ItineraryItem) => void;
  onToggleComplete: (item: ItineraryItem) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  settings,
  onOpenAddItinerary,
  onEditItinerary,
  onDeleteItinerary,
  onToggleComplete,
}) => {
  const [activeDayTab, setActiveDayTab] = useState<number | 'all'>('all');

  // Group items by day
  const daysMap: Record<number, ItineraryItem[]> = {};
  itinerary
    .filter((item) => item.is_active !== false)
    .forEach((item) => {
      if (!daysMap[item.day_number]) {
        daysMap[item.day_number] = [];
      }
      daysMap[item.day_number].push(item);
    });

  const availableDays = Object.keys(daysMap)
    .map(Number)
    .sort((a, b) => a - b);

  const displayedDays =
    activeDayTab === 'all'
      ? availableDays
      : availableDays.filter((d) => d === activeDayTab);

  return (
    <div className="space-y-4 pb-24 animate-fadeup">
      {/* ── 1. Header & Add Action ───────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Trip Itinerary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Day-by-day plan for Ujjain darshan, travel & food tours
          </p>
        </div>

        <button
          onClick={onOpenAddItinerary}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* ── 2. Day Filter Pills ──────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveDayTab('all')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all border cursor-pointer ${
            activeDayTab === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Days ({itinerary.length})
        </button>

        {availableDays.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDayTab(day)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all border cursor-pointer ${
              activeDayTab === day
                ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Day {day} ({daysMap[day]?.length || 0})
          </button>
        ))}
      </div>

      {/* ── 3. Day-wise Timeline Cards ───────────────── */}
      {availableDays.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 space-y-2">
          <CalendarDays className="w-10 h-10 mx-auto opacity-30 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700">No itinerary events yet</h4>
          <p className="text-xs text-slate-400">Click "Add Activity" to plan your Ujjain trip schedule</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedDays.map((dayNum) => {
            const dayItems = daysMap[dayNum] || [];
            const dayDate = dayItems[0]?.date;

            return (
              <div key={dayNum} className="space-y-3">
                {/* Day Header Banner */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 w-fit">
                  <span className="font-extrabold text-xs text-amber-900">DAY {dayNum}</span>
                  {dayDate && <span className="text-[11px] text-amber-700 font-medium">• {dayDate}</span>}
                </div>

                {/* Timeline Items */}
                <div className="space-y-3 pl-2 border-l-2 border-amber-200 ml-3">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className={`card p-4 transition-all hover:shadow-md relative ml-2 ${
                        item.is_completed ? 'bg-slate-50/80 opacity-75' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Completion Toggle */}
                          <button
                            onClick={() => onToggleComplete(item)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-all cursor-pointer shrink-0"
                            title={item.is_completed ? 'Mark uncompleted' : 'Mark completed'}
                          >
                            {item.is_completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                            )}
                          </button>

                          <div className="min-w-0">
                            {/* Time Badge & Title */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {item.time_label}
                              </span>

                              <h3
                                className={`text-sm font-bold text-slate-900 ${
                                  item.is_completed ? 'line-through text-slate-500' : ''
                                }`}
                              >
                                {item.title}
                              </h3>
                            </div>

                            {/* Location & Maps */}
                            {item.location && (
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-medium">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                  {item.location}
                                </span>

                                {item.map_url && (
                                  <a
                                    href={item.map_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold hover:underline"
                                  >
                                    <Navigation className="w-3 h-3" />
                                    <span>Maps</span>
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Description */}
                            {item.description && (
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                {item.description}
                              </p>
                            )}

                            {/* Notes */}
                            {item.notes && (
                              <p className="text-[11px] text-amber-800 font-medium mt-1.5 italic">
                                💡 {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onEditItinerary(item)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItinerary(item)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
