import React, { useState } from 'react';
import {
  Train,
  Hotel,
  Car,
  PlusCircle,
  Phone,
  Navigation,
  Copy,
  Check,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';
import { TravelDetail, TravelType } from '../types';

interface TravelViewProps {
  travelList: TravelDetail[];
  onOpenAddTravel: () => void;
  onEditTravel: (item: TravelDetail) => void;
  onDeleteTravel: (item: TravelDetail) => void;
}

export const TravelView: React.FC<TravelViewProps> = ({
  travelList,
  onOpenAddTravel,
  onEditTravel,
  onDeleteTravel,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const outbound = travelList.filter((t) => t.type === 'outbound' && t.is_active !== false);
  const returnTrips = travelList.filter((t) => t.type === 'return' && t.is_active !== false);
  const stays = travelList.filter((t) => t.type === 'stay' && t.is_active !== false);
  const locals = travelList.filter((t) => t.type === 'local' && t.is_active !== false);

  const renderTravelCard = (item: TravelDetail) => (
    <div key={item.id} className="card p-5 transition-all hover:shadow-md relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
            {item.type === 'stay' ? '🏨' : item.type === 'local' ? '🛺' : '🚆'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              {item.mode && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                  {item.mode}
                </span>
              )}
            </div>

            {/* PNR / Booking Ref with copy button */}
            {item.booking_ref && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {item.booking_ref}
                </span>
                <button
                  onClick={() => handleCopy(item.booking_ref!, item.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* Train / Bus Timings */}
            {(item.departure_time || item.arrival_time) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                {item.departure_time && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {item.type === 'stay' ? 'Check-In' : 'Departure'}
                    </span>
                    <span className="font-bold text-slate-800">{item.departure_time}</span>
                    {item.departure_station && (
                      <span className="text-[11px] text-slate-500 block">
                        {item.departure_station}
                      </span>
                    )}
                  </div>
                )}
                {item.arrival_time && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {item.type === 'stay' ? 'Check-Out' : 'Arrival'}
                    </span>
                    <span className="font-bold text-slate-800">{item.arrival_time}</span>
                    {item.arrival_station && (
                      <span className="text-[11px] text-slate-500 block">
                        {item.arrival_station}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hotel Address */}
            {item.address && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{item.address}</span>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <p className="text-[11px] text-slate-500 mt-2 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                💡 {item.notes}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEditTravel(item)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteTravel(item)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Bar (Call / Map) */}
      {(item.contact_number || item.map_url) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
          {item.contact_number && (
            <a
              href={`tel:${item.contact_number}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {item.contact_number}</span>
            </a>
          )}
          {item.map_url && (
            <a
              href={item.map_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Maps</span>
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fadeup">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Travel & Stay Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Train bookings, hotel vouchers, and driver contacts
          </p>
        </div>

        <button
          onClick={onOpenAddTravel}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md active:scale-97 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Travel / Hotel</span>
        </button>
      </div>

      {/* ── 1. Outbound Journey ──────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
          <Train className="w-4 h-4 text-amber-600" />
          <span>Outbound Journey (Mumbai ➔ Ujjain)</span>
        </div>
        {outbound.length === 0 ? (
          <div className="card p-5 text-center text-xs text-slate-400">
            No outbound train/bus added yet.
          </div>
        ) : (
          outbound.map(renderTravelCard)
        )}
      </div>

      {/* ── 2. Hotel / Stay ──────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
          <Hotel className="w-4 h-4 text-purple-600" />
          <span>Hotel & Accommodation</span>
        </div>
        {stays.length === 0 ? (
          <div className="card p-5 text-center text-xs text-slate-400">
            No hotel booking added yet.
          </div>
        ) : (
          stays.map(renderTravelCard)
        )}
      </div>

      {/* ── 3. Return Journey ────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
          <Train className="w-4 h-4 text-blue-600" />
          <span>Return Journey (Ujjain ➔ Mumbai)</span>
        </div>
        {returnTrips.length === 0 ? (
          <div className="card p-5 text-center text-xs text-slate-400">
            No return journey recorded yet.
          </div>
        ) : (
          returnTrips.map(renderTravelCard)
        )}
      </div>

      {/* ── 4. Local Transport / Cab Contacts ────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
          <Car className="w-4 h-4 text-emerald-600" />
          <span>Local Transport & Drivers</span>
        </div>
        {locals.length === 0 ? (
          <div className="card p-5 text-center text-xs text-slate-400">
            No local transport details added.
          </div>
        ) : (
          locals.map(renderTravelCard)
        )}
      </div>
    </div>
  );
};
