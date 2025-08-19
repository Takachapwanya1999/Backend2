import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaceCard from '../components/ui/PlaceCard';
import SearchBar from '../components/ui/SearchBar';
import axios from 'axios';
import axiosInstance from '../utils/axios';

const SearchPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPlaces();
  }, [searchParams]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = {};
      const location = searchParams.get('location');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const guests = searchParams.get('guests');
      if (location) params.location = location;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;
      if (guests) params.guests = guests;

      const { data } = await axiosInstance.get('/places/search', { params });
      let apiPlaces = data?.data?.places || data?.places || [];
  setPlaces(apiPlaces);
    } catch (error) {
      if (axios.isCancel?.(error) || `${error}`.includes('cancel')) {
        return; // ignore duplicate/canceled requests from interceptor
      }
      console.error('Error fetching places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <SearchBar />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {searchParams.get('location') ? `Stays in ${searchParams.get('location')}` : 'Places to stay'}
          </h1>
          <p className="text-gray-600">
            {places.length} {places.length === 1 ? 'stay' : 'stays'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
