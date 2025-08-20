import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaceCard from '../components/ui/PlaceCard';
import SearchBar from '../components/ui/SearchBar';
// ...existing code...
import BookingCard from '../components/ui/BookingCard';

const SearchPage = () => {
  return (
    <div>
      <h2>Booking Results</h2>
      <BookingCard />
    </div>
  );
};

export default SearchPage;
