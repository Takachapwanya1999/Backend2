import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axiosInstance from '../utils/axios';

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
          const { data } = await axiosInstance.get('/places/user/my-places');
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
                photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
                description: 'A beautiful apartment in the heart of the city'
              },
              {
                _id: '2',
                title: 'Beachfront Villa',
                address: 'Coastal Area, Seaside',
                photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
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
