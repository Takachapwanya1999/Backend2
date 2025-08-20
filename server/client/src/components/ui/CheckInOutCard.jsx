import React from 'react';
import { format, isValid } from 'date-fns';

const DateBox = ({ label, date }) => {
  const d = date ? new Date(date) : null;
  const hasDate = d && isValid(d);
  return (
    <div className="flex-1">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="rounded-md bg-slate-100 p-2 text-slate-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a3 3 0 013 3v11a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h1V3a1 1 0 112 0v1zm14 7H3v9a1 1 0 001 1h16a1 1 0 001-1zM5 7h14a1 1 0 00-1-1h-1v1a1 1 0 11-2 0V6H9v1a1 1 0 11-2 0V6H6a1 1 0 00-1 1z"/>
          </svg>
        </div>
        {hasDate ? (
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold text-slate-900">
              {format(d, 'EEE, MMM d')}
            </div>
          </div>
        ) : (
          <div className="text-slate-400">Add date</div>
        )}
      </div>
    </div>
  );
};

const Row = ({ children }) => (
  <div className="flex items-center justify-between py-2">
    {children}
  </div>
);

const CheckInOutCard = ({ checkIn, checkOut, guests = 1, pricePerNight = 0, nights = 0, currencySymbol = '₹' }) => {
  const subtotal = nights > 0 ? nights * (pricePerNight || 0) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-base font-semibold text-slate-900">Your trip</div>

      <div className="mb-3 flex gap-3">
        <DateBox label="Check-in" date={checkIn} />
        <DateBox label="Checkout" date={checkOut} />
      </div>

      <Row>
        <div className="text-slate-700">Guests</div>
        <div className="text-slate-900 font-medium">{guests}</div>
      </Row>

      {nights > 0 ? (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <Row>
            <div className="text-slate-700">{nights} night{nights > 1 ? 's' : ''} × {currencySymbol}{pricePerNight}</div>
            <div className="text-slate-900 font-semibold">{currencySymbol}{subtotal}</div>
          </Row>
          <div className="text-xs text-slate-500">Total before taxes</div>
        </div>
      ) : null}
    </div>
  );
};

export default CheckInOutCard;
