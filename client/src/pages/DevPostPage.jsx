import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../lib/api';
import { UserContext } from '@/providers/UserProvider';

const DevPostPage = () => {
  const { user } = useContext(UserContext);

  // Minimal Place form state
  const [place, setPlace] = useState({
    title: 'Sample Place',
    description: 'Nice place for testing.',
    address: '123 Test St, Harare',
    photos: 'https://picsum.photos/seed/1/800/600,https://picsum.photos/seed/2/800/600',
    price: 100,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    propertyType: 'apartment',
    roomType: 'entire_place',
    amenities: 'wifi,kitchen',
    status: 'active'
  });

  const [createdPlaceId, setCreatedPlaceId] = useState('');

  // Minimal Booking form state
  const [booking, setBooking] = useState({
    placeId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'credit_card'
  });

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required.');
    try {
      const payload = {
        title: place.title,
        description: place.description,
        address: place.address,
        photos: place.photos.split(',').map((s) => s.trim()).filter(Boolean),
        price: Number(place.price),
        maxGuests: Number(place.maxGuests),
        bedrooms: Number(place.bedrooms),
        beds: Number(place.beds),
        bathrooms: Number(place.bathrooms),
        propertyType: place.propertyType,
        roomType: place.roomType,
        amenities: place.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        status: place.status,
      };
      const res = await fetch(`${API_URL}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Create place failed');
      const data = await res.json();
      const id = data?.data?.place?._id;
      setCreatedPlaceId(id || '');
      toast.success(`Place created${id ? ' #' + id : ''}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      toast.error(`Create place failed: ${msg}`);
      console.error(err);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login required.');
    if (!booking.placeId) return toast.error('Place ID required.');
    try {
      const payload = {
        place: booking.placeId,
        checkIn: new Date(booking.checkIn).toISOString(),
        checkOut: new Date(booking.checkOut).toISOString(),
        guests: Number(booking.guests),
        payment: { method: booking.paymentMethod },
      };
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Create booking failed');
      const data = await res.json();
      const id = data?.data?.booking?._id;
      toast.success(`Booking created${id ? ' #' + id : ''}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      toast.error(`Create booking failed: ${msg}`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Dev POST Tester</h1>
      {!user && (
        <div className="mb-4 text-yellow-400">You must be logged in to create places or bookings.</div>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">Create Place</h2>
        <form onSubmit={handleCreatePlace} className="grid gap-3">
          <input value={place.title} onChange={(e)=>setPlace({...place,title:e.target.value})} placeholder="Title" />
          <textarea value={place.description} onChange={(e)=>setPlace({...place,description:e.target.value})} placeholder="Description" />
          <input value={place.address} onChange={(e)=>setPlace({...place,address:e.target.value})} placeholder="Address" />
          <input value={place.photos} onChange={(e)=>setPlace({...place,photos:e.target.value})} placeholder="Photos (comma-separated URLs)" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={place.price} onChange={(e)=>setPlace({...place,price:e.target.value})} placeholder="Price" />
            <input type="number" value={place.maxGuests} onChange={(e)=>setPlace({...place,maxGuests:e.target.value})} placeholder="Max Guests" />
            <input type="number" value={place.bedrooms} onChange={(e)=>setPlace({...place,bedrooms:e.target.value})} placeholder="Bedrooms" />
            <input type="number" value={place.beds} onChange={(e)=>setPlace({...place,beds:e.target.value})} placeholder="Beds" />
            <input type="number" value={place.bathrooms} onChange={(e)=>setPlace({...place,bathrooms:e.target.value})} placeholder="Bathrooms" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={place.propertyType} onChange={(e)=>setPlace({...place,propertyType:e.target.value})}>
              <option value="apartment">apartment</option>
              <option value="house">house</option>
              <option value="villa">villa</option>
              <option value="cottage">cottage</option>
              <option value="cabin">cabin</option>
              <option value="loft">loft</option>
              <option value="studio">studio</option>
              <option value="other">other</option>
            </select>
            <select value={place.roomType} onChange={(e)=>setPlace({...place,roomType:e.target.value})}>
              <option value="entire_place">entire_place</option>
              <option value="private_room">private_room</option>
              <option value="shared_room">shared_room</option>
            </select>
          </div>
          <input value={place.amenities} onChange={(e)=>setPlace({...place,amenities:e.target.value})} placeholder="Amenities (comma-separated)" />
          <button className="primary">Create Place</button>
          {createdPlaceId && <div className="text-sm text-green-400">Created ID: {createdPlaceId}</div>}
        </form>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Create Booking</h2>
        <form onSubmit={handleCreateBooking} className="grid gap-3">
          <input value={booking.placeId} onChange={(e)=>setBooking({...booking,placeId:e.target.value})} placeholder="Place ID (use Created ID above)" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={booking.checkIn} onChange={(e)=>setBooking({...booking,checkIn:e.target.value})} />
            <input type="date" value={booking.checkOut} onChange={(e)=>setBooking({...booking,checkOut:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min={1} value={booking.guests} onChange={(e)=>setBooking({...booking,guests:e.target.value})} placeholder="Guests" />
            <select value={booking.paymentMethod} onChange={(e)=>setBooking({...booking,paymentMethod:e.target.value})}>
              <option value="credit_card">credit_card</option>
              <option value="debit_card">debit_card</option>
              <option value="paypal">paypal</option>
              <option value="cash">cash</option>
            </select>
          </div>
          <button className="primary">Create Booking</button>
        </form>
      </section>
    </div>
  );
};

export default DevPostPage;
