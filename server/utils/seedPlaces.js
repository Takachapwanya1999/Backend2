import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Place from '../models/Place.js';
import User from '../models/User.js';

dotenv.config();

const ownerEmail = process.env.SEED_OWNER_EMAIL || 'alice.local@example.com';

const places = [
  // Cape Town
  {
    title: 'Sea Point Ocean View Apartment',
    description: 'Modern 2-bedroom apartment with stunning ocean views, walking distance to promenade.',
    address: 'Sea Point, Cape Town, South Africa',
    location: {
      type: 'Point',
      coordinates: [18.388, -33.915],
      city: 'Cape Town', state: 'Western Cape', country: 'South Africa',
      formattedAddress: 'Sea Point, Cape Town, Western Cape, South Africa'
    },
    photos: ['/assets/view.png'],
    price: 120,
    currency: 'USD',
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    amenities: ['wifi','kitchen','parking','ocean_view','balcony'],
    propertyType: 'apartment',
    roomType: 'entire_place',
    status: 'active'
  },
  {
    title: 'Table Mountain Garden Cottage',
    description: 'Cozy cottage at the foot of Table Mountain with beautiful garden and BBQ area.',
    address: 'Rondebosch, Cape Town, South Africa',
    location: {
      type: 'Point',
      coordinates: [18.476, -33.958],
      city: 'Cape Town', state: 'Western Cape', country: 'South Africa',
      formattedAddress: 'Rondebosch, Cape Town, Western Cape, South Africa'
    },
    photos: ['/assets/manage.png'],
    price: 85,
    currency: 'USD',
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: ['wifi','garden','bbq_grill','parking'],
    propertyType: 'cottage',
    roomType: 'entire_place',
    status: 'active'
  },
  // Pretoria
  {
    title: 'Pretoria City Loft near Union Buildings',
    description: 'Stylish loft apartment close to landmarks and restaurants.',
    address: 'Arcadia, Pretoria, South Africa',
    location: {
      type: 'Point',
      coordinates: [28.217, -25.746],
      city: 'Pretoria', state: 'Gauteng', country: 'South Africa',
      formattedAddress: 'Arcadia, Pretoria, Gauteng, South Africa'
    },
    photos: ['/assets/search.png'],
    price: 70,
    currency: 'USD',
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['wifi','air_conditioning','parking','city_view'],
    propertyType: 'loft',
    roomType: 'entire_place',
    status: 'active'
  },
  {
    title: 'Lynnwood Family Home with Pool',
    description: 'Spacious family house with private pool and garden.',
    address: 'Lynnwood, Pretoria, South Africa',
    location: {
      type: 'Point',
      coordinates: [28.270, -25.770],
      city: 'Pretoria', state: 'Gauteng', country: 'South Africa',
      formattedAddress: 'Lynnwood, Pretoria, Gauteng, South Africa'
    },
    photos: ['/assets/hero.png'],
    price: 150,
    currency: 'USD',
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    amenities: ['wifi','kitchen','parking','pool','garden'],
    propertyType: 'house',
    roomType: 'entire_place',
    status: 'active'
  },
  // Limpopo
  {
    title: 'Bushveld Chalet near Kruger Gate',
    description: 'Tranquil chalet experience with wildlife sounds at night.',
    address: 'Phalaborwa, Limpopo, South Africa',
    location: {
      type: 'Point',
      coordinates: [31.141, -23.942],
      city: 'Phalaborwa', state: 'Limpopo', country: 'South Africa',
      formattedAddress: 'Phalaborwa, Limpopo, South Africa'
    },
    photos: ['/assets/book.png'],
    price: 95,
    currency: 'USD',
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    amenities: ['parking','air_conditioning','bbq_grill','garden'],
    propertyType: 'chalet',
    roomType: 'entire_place',
    status: 'active'
  },
  {
    title: 'Tzaneen Mountain View Cabin',
    description: 'Cozy wooden cabin with mountain views and hiking trails nearby.',
    address: 'Tzaneen, Limpopo, South Africa',
    location: {
      type: 'Point',
      coordinates: [30.162, -23.832],
      city: 'Tzaneen', state: 'Limpopo', country: 'South Africa',
      formattedAddress: 'Tzaneen, Limpopo, South Africa'
    },
    photos: ['/assets/view.png'],
    price: 80,
    currency: 'USD',
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: ['parking','balcony','mountain_view'],
    propertyType: 'cabin',
    roomType: 'entire_place',
    status: 'active'
  },
  // Mpumalanga
  {
    title: 'Sabie River Riverside Cottage',
    description: 'Riverside stay with easy access to Panorama Route.',
    address: 'Hazyview, Mpumalanga, South Africa',
    location: {
      type: 'Point',
      coordinates: [31.128, -25.041],
      city: 'Hazyview', state: 'Mpumalanga', country: 'South Africa',
      formattedAddress: 'Hazyview, Mpumalanga, South Africa'
    },
    photos: ['/assets/manage.png'],
    price: 110,
    currency: 'USD',
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
  amenities: ['wifi','parking','garden','bbq_grill','lake_view'],
    propertyType: 'cottage',
    roomType: 'entire_place',
    status: 'active'
  },
  {
    title: 'Nelspruit City Apartment',
    description: 'Convenient city apartment perfect for business travelers.',
    address: 'Mbombela (Nelspruit), Mpumalanga, South Africa',
    location: {
      type: 'Point',
      coordinates: [30.980, -25.475],
      city: 'Mbombela', state: 'Mpumalanga', country: 'South Africa',
      formattedAddress: 'Mbombela, Mpumalanga, South Africa'
    },
    photos: ['/assets/search.png'],
    price: 65,
    currency: 'USD',
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['wifi','air_conditioning','parking'],
    propertyType: 'apartment',
    roomType: 'entire_place',
    status: 'active'
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      owner = await User.create({ name: 'Seed Owner', email: ownerEmail, password: 'secret123', isVerified: true });
    }

    const docs = places.map(p => ({ ...p, owner: owner._id }));
    await Place.insertMany(docs);

    await mongoose.disconnect();
    console.log('Seeded places successfully');
    process.exit(0);
  } catch (e) {
    console.error('Seeding failed', e);
    process.exit(1);
  }
}

run();
