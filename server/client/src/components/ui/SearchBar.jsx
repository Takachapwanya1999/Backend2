import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ compact = false }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to places page with search parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    
    navigate(`/places?${params.toString()}`);
  };

  if (compact) {
    return (
      <div className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow bg-white">
        <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Start your search"
          className="text-sm flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl">
      <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white">
        {/* Where */}
        <div className="flex-1 px-6 py-3 border-r border-gray-200">
          <label className="block text-[11px] font-semibold text-gray-900 mb-1">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full text-sm outline-none bg-transparent placeholder-gray-500 text-gray-900"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Check in */}
        <div className="flex-1 px-6 py-3 border-r border-gray-200">
          <label className="block text-[11px] font-semibold text-gray-900 mb-1">Check in</label>
          <input
            type="date"
            className="w-full text-sm outline-none bg-transparent text-gray-700"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        {/* Check out */}
        <div className="flex-1 px-6 py-3 border-r border-gray-200">
          <label className="block text-[11px] font-semibold text-gray-900 mb-1">Check out</label>
          <input
            type="date"
            className="w-full text-sm outline-none bg-transparent text-gray-700"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        {/* Who */}
        <div className="flex-1 px-6 py-3">
          <label className="block text-[11px] font-semibold text-gray-900 mb-1">Who</label>
          <input
            type="number"
            placeholder="Add guests"
            min="1"
            className="w-full text-sm outline-none bg-transparent placeholder-gray-500 text-gray-900"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full mr-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
