import React, { useState, useEffect } from 'react';
import { X, Train, Hotel, Car, CheckCircle2, Phone, MapPin, ExternalLink } from 'lucide-react';
import { TravelDetail, TravelType } from '../types';

interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (detail: TravelDetail) => void;
  editingDetail?: TravelDetail | null;
}

export const TravelModal: React.FC<TravelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDetail,
}) => {
  const [type, setType] = useState<TravelType>('outbound');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingDetail) {
        setType(editingDetail.type);
        setTitle(editingDetail.title);
        setMode(editingDetail.mode || '');
        setBookingRef(editingDetail.booking_ref || '');
        setDepartureStation(editingDetail.departure_station || '');
        setArrivalStation(editingDetail.arrival_station || '');
        setDepartureTime(editingDetail.departure_time || '');
        setArrivalTime(editingDetail.arrival_time || '');
        setHotelName(editingDetail.hotel_name || '');
        setAddress(editingDetail.address || '');
        setContactNumber(editingDetail.contact_number || '');
        setMapUrl(editingDetail.map_url || '');
        setNotes(editingDetail.notes || '');
      } else {
        setType('outbound');
        setTitle('');
        setMode('Train (Avantika Express - 12962)');
        setBookingRef('');
        setDepartureStation('Mumbai Central (MMCT)');
        setArrivalStation('Ujjain Jn (UJN)');
        setDepartureTime('18 Sep, 09:35 PM');
        setArrivalTime('19 Sep, 07:15 AM');
        setHotelName('');
        setAddress('');
        setContactNumber('');
        setMapUrl('');
        setNotes('');
      }
      setTitleError('');
    }
  }, [isOpen, editingDetail]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    const saved: TravelDetail = {
      id: editingDetail ? editingDetail.id : `trv-${Date.now()}`,
      type,
      title: title.trim(),
      mode: mode.trim() || undefined,
      booking_ref: bookingRef.trim() || undefined,
      departure_station: departureStation.trim() || undefined,
      arrival_station: arrivalStation.trim() || undefined,
      departure_time: departureTime.trim() || undefined,
      arrival_time: arrivalTime.trim() || undefined,
      hotel_name: hotelName.trim() || undefined,
      address: address.trim() || undefined,
      contact_number: contactNumber.trim() || undefined,
      map_url: mapUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      created_at: editingDetail ? editingDetail.created_at : new Date().toISOString(),
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
            {type === 'stay' ? <Hotel className="w-5 h-5" /> : <Train className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingDetail ? 'Edit Travel / Stay' : 'Add Travel / Stay'}
            </h3>
            <p className="text-xs text-slate-500">Train tickets, hotel vouchers & driver contacts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Travel Section Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'outbound', label: 'Outbound' },
                { id: 'return', label: 'Return' },
                { id: 'stay', label: 'Hotel' },
                { id: 'local', label: 'Local Cab' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id as TravelType)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    type === t.id
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder={
                type === 'stay'
                  ? 'e.g. Hotel Imperial Grand (2 Quad Rooms)'
                  : 'e.g. Mumbai Central ➔ Ujjain Jn'
              }
              className="input-field w-full px-3.5 py-2.5 text-sm"
              autoFocus
            />
            {titleError && <p className="text-xs text-rose-600 font-semibold mt-1">{titleError}</p>}
          </div>

          {/* Mode & Booking Ref */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mode / Vehicle
              </label>
              <input
                type="text"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                placeholder="e.g. Train / Bus / Cab"
                className="input-field w-full px-3 py-2 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Booking / PNR Ref
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="PNR / Ticket No"
                className="input-field w-full px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Journey Specific Fields */}
          {type !== 'stay' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Departure Station
                  </label>
                  <input
                    type="text"
                    value={departureStation}
                    onChange={(e) => setDepartureStation(e.target.value)}
                    placeholder="e.g. Mumbai Central"
                    className="input-field w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Arrival Station
                  </label>
                  <input
                    type="text"
                    value={arrivalStation}
                    onChange={(e) => setArrivalStation(e.target.value)}
                    placeholder="e.g. Ujjain Junction"
                    className="input-field w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="18 Sep, 09:35 PM"
                    className="input-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    placeholder="19 Sep, 07:15 AM"
                    className="input-field w-full px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
            </>
          )}

          {/* Hotel Specific Fields */}
          {type === 'stay' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="e.g. Hotel Imperial Grand"
                  className="input-field w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Near Railway Station, Freeganj, Ujjain"
                  className="input-field w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Check-In Time
                  </label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="19 Sep, 08:00 AM"
                    className="input-field w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Check-Out Time
                  </label>
                  <input
                    type="text"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    placeholder="20 Sep, 05:00 PM"
                    className="input-field w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* Contact & Map Link */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98200..."
                className="input-field w-full px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Maps Link
              </label>
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="input-field w-full px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Coach B3 Berths 21-28 / Carry original Aadhaar"
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
              <span>{editingDetail ? 'Save Changes' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
