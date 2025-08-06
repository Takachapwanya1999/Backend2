import React, { useEffect, useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PlaceCard from '../components/ui/PlaceCard';
import Spinner from '../components/ui/Spinner';
import FilterBar from '../components/ui/FilterBar';
import PlacesGridSkeleton from '../components/ui/PlacesGridSkeleton';

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock places data for now (replace with API call later)
  const mockPlaces = [
    {
      _id: '1',
      title: 'Cozy Apartment in City Center',
      address: 'Downtown, Mumbai',
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
      price: 2500,
      description: 'Beautiful apartment with city views'
    },
    {
      _id: '2', 
      title: 'Beach House Retreat',
      address: 'Goa Beach, India',
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500'],
      price: 4000,
      description: 'Stunning beach house with ocean views'
    },
    {
      _id: '3',
      title: 'Mountain Cabin Getaway',
      address: 'Manali, Himachal Pradesh',
      photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500'],
      price: 3500,
      description: 'Peaceful cabin surrounded by mountains'
    },
    {
      _id: '4',
      title: 'Luxury Villa with Pool',
      address: 'Bangalore, Karnataka',
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500'],
      price: 8000,
      description: 'Elegant villa with private pool and garden'
    },
    {
      _id: '5',
      title: 'Heritage Houseboat',
      address: 'Alleppey, Kerala',
      photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'],
      price: 6000,
      description: 'Traditional houseboat experience in backwaters'
    },
    {
      _id: '6',
      title: 'Modern Studio Apartment',
      address: 'Pune, Maharashtra',
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'],
      price: 2000,
      description: 'Stylish studio in tech hub location'
    }
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/places`);
          if (response.ok) {
            const data = await response.json();
            setPlaces(data.data?.places || []);
            setFilteredPlaces(data.data?.places || []);
            return;
          }
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError.message);
        }
        
        // Fallback to mock data if API fails
        setTimeout(() => {
          setPlaces(mockPlaces);
          setFilteredPlaces(mockPlaces);
        }, 800);
      } catch (error) {
        console.error('Error loading places:', error);
        setPlaces(mockPlaces);
        setFilteredPlaces(mockPlaces);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaces();
  }, []);

  // Filter places based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPlaces(places);
    } else {
      // Simple filtering logic - in real app this would be more sophisticated
      const filtered = places.filter(place => {
        switch (activeFilter) {
          case 'beachfront':
            return place.address.toLowerCase().includes('beach') || 
                   place.address.toLowerCase().includes('goa') ||
                   place.title.toLowerCase().includes('beach');
          case 'cabins':
            return place.title.toLowerCase().includes('cabin') ||
                   place.title.toLowerCase().includes('cottage');
          case 'countryside':
            return place.address.toLowerCase().includes('hills') ||
                   place.address.toLowerCase().includes('valley') ||
                   place.address.toLowerCase().includes('kerala');
          case 'amazing-pools':
            return place.description.toLowerCase().includes('pool');
          case 'trending':
            return place.price > 3000;
          default:
            return true;
        }
      });
      setFilteredPlaces(filtered);
    }
  }, [activeFilter, places]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find your next stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Search low prices on hotels, homes and much more...
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-gray-300 rounded w-64 mb-8 animate-pulse"></div>
          <PlacesGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find your next stay
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Search low prices on hotels, homes and much more...
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeFilter === 'all' ? 'Explore nearby destinations' : `${activeFilter.replace('-', ' ')} stays`}
          </h2>
          <span className="text-gray-600">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
          </span>
        </div>
        
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why choose our platform?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All properties are verified for quality and safety</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support for your needs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
