import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { API_URL } from '../lib/api';

import AccountNav from '../components/ui/AccountNav';
import InfoCard from '../components/ui/InfoCard';
import Spinner from '../components/ui/Spinner';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const res = await fetch(`${API_URL}/places/user/my-places`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          setPlaces(data.data?.places || []);
        } catch (apiError) {
          console.log('API Error, using mock data:', apiError.message);
          // Fallback to mock data if API fails
          setTimeout(() => {
            setPlaces([
              {
                _id: '1',
                title: 'My Cozy Apartment',
                address: 'Downtown, City Center',
                photos: ['/assets/hero.png'],
                description: 'A beautiful apartment in the heart of the city'
              },
              {
                _id: '2',
                title: 'Beachfront Villa',
                address: 'Coastal Area, Seaside',
                photos: ['/assets/hero.png'],
                description: 'Stunning villa with ocean views'
              }
            ]);
          }, 500);
        }
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setLoading(false);
      }
    };
    getPlaces();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center ">
        <Link
          className="inline-flex gap-1 rounded-full bg-primary py-2 px-6 text-white"
          to={'/account/places/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mx-4 mt-4">
        {places.length > 0 &&
          places.map((place) => <InfoCard place={place} key={place._id} />)}
      </div>
    </div>
  );
};

export default PlacesPage;
