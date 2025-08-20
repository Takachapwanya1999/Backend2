import React, { useState, useEffect } from 'react';
import { API_URL } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import PlaceCard from '../components/ui/PlaceCard';
import CategoryHeader from '../components/ui/CategoryHeader';
import ClickableImage from '../components/ui/ClickableImage';

import BookingCard from '../components/ui/BookingCard';

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory.id) {
      fetchPlacesByCategory(selectedCategory);
    } else {
      setFilteredPlaces(places);
    }
  }, [selectedCategory, places]);

  const fetchPlaces = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_URL}/places`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch places');
      const data = await res.json();
      const apiPlaces = data?.data?.places || data?.places || [];
      setPlaces(apiPlaces); // Show all places
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to load places. Please try again later.');
      // Use sample data as fallback
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacesByCategory = async (category) => {
    if (!category || !category.id) {
      setFilteredPlaces(places);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      let apiPlaces = [];
      if (category.id === '') {
        // Show all places for "All" category
        const res = await fetch(`${API_URL}/places`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch places');
        const data = await res.json();
        apiPlaces = data?.data?.places || data?.places || [];
        setFilteredPlaces(apiPlaces.slice(0, 12));
      } else {
        // Use the new category endpoint
        const res = await fetch(`${API_URL}/places/category/${category.id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch category places');
        const data = await res.json();
        apiPlaces = data?.data?.places || [];
        setFilteredPlaces(apiPlaces);
      }
    } catch (error) {
      console.error('Error fetching places by category:', error);
      setError(`Failed to load ${category.name} properties. Please try again later.`);
      // Fallback to mock data for the category
      setFilteredPlaces(getMockDataForCategory(category));
    } finally {
      setLoading(false);
    }
  };
  // (Remove this early return, the actual return is much later in the file)


  const getMockDataForCategory = (category) => {
    // Generate mock data based on category type for demonstration
    const mockData = {
      'beachfront': [
        {
          _id: 'beach_1',
          title: 'Oceanfront Villa with Private Beach',
          photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=720&h=480&fit=crop'],
          description: 'Direct beach access',
          price: 320,
          address: 'Malibu, California',
          ratings: { overall: 4.9, count: 127 }
        },
        {
          _id: 'beach_2',
          title: 'Beachside Cottage with Ocean Views',
          photos: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=720&h=480&fit=crop'],
          description: '2 minutes to beach',
          price: 195,
          address: 'Cape Cod, Massachusetts',
          ratings: { overall: 4.7, count: 89 }
        }
      ],
      'cabins': [
        {
          _id: 'cabin_1',
          title: 'Rustic Mountain Cabin with Fireplace',
          photos: ['https://images.unsplash.com/photo-1605276373954-0c4a0dac5851?w=720&h=480&fit=crop'],
          description: 'Cozy retreat in the mountains with wood-burning fireplace',
          price: 145,
          address: 'Aspen, Colorado',
          ratings: { overall: 4.8, count: 156 }
        },
        {
          _id: 'cabin_2',
          title: 'Lakeside Log Cabin with Hot Tub',
          photos: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=720&h=480&fit=crop'],
          description: 'Perfect for couples getaway with private hot tub',
          price: 175,
          address: 'Lake Tahoe, California',
          ratings: { overall: 4.9, count: 203 }
        },
        {
          _id: 'cabin_3',
          title: 'Charming Forest Cottage with Garden',
          photos: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=720&h=480&fit=crop'],
          description: 'Secluded cottage surrounded by ancient trees',
          price: 125,
          address: 'Blue Ridge Mountains, Virginia',
          ratings: { overall: 4.7, count: 89 }
        },
        {
          _id: 'cabin_4',
          title: 'Alpine Chalet with Mountain Views',
          photos: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=720&h=480&fit=crop'],
          description: 'Traditional chalet with breathtaking alpine scenery',
          price: 195,
          address: 'Jackson Hole, Wyoming',
          ratings: { overall: 4.9, count: 134 }
        },
        {
          _id: 'cabin_5',
          title: 'Cozy Winter Cabin in Snow',
          photos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=720&h=480&fit=crop'],
          description: 'Perfect winter retreat with modern amenities',
          price: 165,
          address: 'Whistler, British Columbia',
          ratings: { overall: 4.8, count: 92 }
        }
      ],
      'trending': [
        {
          _id: 'trend_1',
          title: 'Modern Minimalist Loft Downtown',
          photos: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=720&h=480&fit=crop'],
          description: 'Highly rated city escape',
          price: 185,
          address: 'Brooklyn, New York',
          ratings: { overall: 4.95, count: 312 }
        },
        {
          _id: 'trend_2',
          title: 'Rooftop Penthouse with City Views',
          photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=720&h=480&fit=crop'],
          description: 'Trending penthouse with panoramic skyline views',
          price: 395,
          address: 'Manhattan, New York',
          ratings: { overall: 4.9, count: 245 }
        },
        {
          _id: 'trend_3',
          title: 'Glass House in the Hills',
          photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&h=480&fit=crop'],
          description: 'Instagram-famous glass house with mountain views',
          price: 425,
          address: 'Hollywood Hills, California',
          ratings: { overall: 4.8, count: 189 }
        }
      ],
      'amazing-pools': [
        {
          _id: 'pool_1',
          title: 'Villa with Infinity Pool & City Views',
          photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=720&h=480&fit=crop'],
          description: 'Stunning infinity pool overlooking the city',
          price: 450,
          address: 'Hollywood Hills, California',
          ratings: { overall: 4.9, count: 89 }
        },
        {
          _id: 'pool_2',
          title: 'Resort-Style Pool Villa',
          photos: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=720&h=480&fit=crop'],
          description: 'Private resort with lagoon-style pool and waterfalls',
          price: 650,
          address: 'Miami Beach, Florida',
          ratings: { overall: 4.9, count: 156 }
        },
        {
          _id: 'pool_3',
          title: 'Rooftop Pool Penthouse',
          photos: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=720&h=480&fit=crop'],
          description: 'Sky-high pool with 360-degree city views',
          price: 575,
          address: 'Las Vegas, Nevada',
          ratings: { overall: 4.8, count: 203 }
        }
      ],
      'treehouses': [
        {
          _id: 'tree_1',
          title: 'Luxury Treehouse with Panoramic Views',
          photos: ['https://images.unsplash.com/photo-1616593870412-1a5ad55a8464?w=720&h=480&fit=crop'],
          description: 'Unique elevated accommodation in ancient redwoods',
          price: 225,
          address: 'Olympic Peninsula, Washington',
          ratings: { overall: 4.8, count: 67 }
        },
        {
          _id: 'tree_2',
          title: 'Romantic Treehouse Retreat',
          photos: ['https://images.unsplash.com/photo-1520637736862-4d197d17c89a?w=720&h=480&fit=crop'],
          description: 'Cozy treehouse perfect for romantic getaways',
          price: 185,
          address: 'Mendocino County, California',
          ratings: { overall: 4.9, count: 134 }
        },
        {
          _id: 'tree_3',
          title: 'Modern Treehouse with Deck',
          photos: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=720&h=480&fit=crop'],
          description: 'Contemporary design meets nature living',
          price: 275,
          address: 'Portland, Oregon',
          ratings: { overall: 4.7, count: 89 }
        },
        {
          _id: 'tree_4',
          title: 'Forest Canopy Treehouse',
          photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=720&h=480&fit=crop'],
          description: 'Sleep among the treetops in this magical retreat',
          price: 195,
          address: 'Great Smoky Mountains, Tennessee',
          ratings: { overall: 4.8, count: 156 }
        },
        {
          _id: 'tree_5',
          title: 'Luxury Eco Treehouse',
          photos: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=720&h=480&fit=crop'],
          description: 'Sustainable luxury in the heart of the forest',
          price: 295,
          address: 'Costa Rica Rainforest',
          ratings: { overall: 4.9, count: 78 }
        }
      ],
      'countryside': [
        {
          _id: 'country_1',
          title: 'Rustic Farmhouse with Rolling Hills',
          photos: ['https://images.unsplash.com/photo-1500076656116-558758c991c1?w=720&h=480&fit=crop'],
          description: 'Peaceful countryside retreat with stunning views',
          price: 135,
          address: 'Tuscany, Italy',
          ratings: { overall: 4.8, count: 145 }
        },
        {
          _id: 'country_2',
          title: 'English Cottage with Garden',
          photos: ['https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=720&h=480&fit=crop'],
          description: 'Charming cottage surrounded by wildflower meadows',
          price: 165,
          address: 'Cotswolds, England',
          ratings: { overall: 4.9, count: 203 }
        },
        {
          _id: 'country_3',
          title: 'French Provincial Vineyard House',
          photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=720&h=480&fit=crop'],
          description: 'Wine country escape with vineyard views',
          price: 195,
          address: 'Provence, France',
          ratings: { overall: 4.7, count: 89 }
        }
      ],
      'rooms': [
        {
          _id: 'room_1',
          title: 'Cozy Private Room in Artist\'s Home',
          photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=720&h=480&fit=crop'],
          description: 'Private room with shared kitchen and garden access',
          price: 65,
          address: 'Brooklyn, New York',
          ratings: { overall: 4.6, count: 234 }
        },
        {
          _id: 'room_2',
          title: 'Modern Room in Designer Loft',
          photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=720&h=480&fit=crop'],
          description: 'Stylish room in contemporary loft with city views',
          price: 85,
          address: 'San Francisco, California',
          ratings: { overall: 4.8, count: 156 }
        },
        {
          _id: 'room_3',
          title: 'Peaceful Room near University',
          photos: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=720&h=480&fit=crop'],
          description: 'Quiet room perfect for students and travelers',
          price: 45,
          address: 'Cambridge, Massachusetts',
          ratings: { overall: 4.5, count: 98 }
        }
      ],
      'design': [
        {
          _id: 'design_1',
          title: 'Award-Winning Modern Architecture',
          photos: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=720&h=480&fit=crop'],
          description: 'Architecturally stunning home featured in design magazines',
          price: 350,
          address: 'Los Angeles, California',
          ratings: { overall: 4.9, count: 167 }
        },
        {
          _id: 'design_2',
          title: 'Minimalist Glass House',
          photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=720&h=480&fit=crop'],
          description: 'Floor-to-ceiling glass walls with mountain views',
          price: 425,
          address: 'Malibu, California',
          ratings: { overall: 4.8, count: 89 }
        },
        {
          _id: 'design_3',
          title: 'Industrial Loft with Exposed Brick',
          photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=720&h=480&fit=crop'],
          description: 'Designer loft with original industrial features',
          price: 295,
          address: 'Chicago, Illinois',
          ratings: { overall: 4.7, count: 123 }
        }
      ],
      'mansions': [
        {
          _id: 'mansion_1',
          title: 'Luxury Estate with Pool & Tennis Court',
          photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=720&h=480&fit=crop'],
          description: 'Sprawling mansion perfect for large groups and events',
          price: 850,
          address: 'Beverly Hills, California',
          ratings: { overall: 4.9, count: 78 }
        },
        {
          _id: 'mansion_2',
          title: 'Historic Victorian Mansion',
          photos: ['https://images.unsplash.com/photo-1605276373954-0c4a0dac5851?w=720&h=480&fit=crop'],
          description: 'Grand Victorian mansion with period furnishings',
          price: 675,
          address: 'Newport, Rhode Island',
          ratings: { overall: 4.8, count: 145 }
        },
        {
          _id: 'mansion_3',
          title: 'Mediterranean Villa with Wine Cellar',
          photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&h=480&fit=crop'],
          description: 'Elegant villa with private wine cellar and gardens',
          price: 725,
          address: 'Napa Valley, California',
          ratings: { overall: 4.9, count: 92 }
        }
      ],
      'lakefront': [
        {
          _id: 'lake_1',
          title: 'Lakefront Cabin with Private Dock',
          photos: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=720&h=480&fit=crop'],
          description: 'Waterfront cabin with private dock and kayaks',
          price: 185,
          address: 'Lake George, New York',
          ratings: { overall: 4.8, count: 156 }
        },
        {
          _id: 'lake_2',
          title: 'Modern Lake House with Floor-to-Ceiling Windows',
          photos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=720&h=480&fit=crop'],
          description: 'Contemporary design with panoramic lake views',
          price: 275,
          address: 'Lake Tahoe, California',
          ratings: { overall: 4.9, count: 203 }
        },
        {
          _id: 'lake_3',
          title: 'Cozy Log Cabin on Pristine Lake',
          photos: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=720&h=480&fit=crop'],
          description: 'Traditional log cabin on crystal clear mountain lake',
          price: 165,
          address: 'Glacier National Park, Montana',
          ratings: { overall: 4.7, count: 134 }
        }
      ],
      'tiny-homes': [
        {
          _id: 'tiny_1',
          title: 'Modern Tiny House on Wheels',
          photos: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=720&h=480&fit=crop'],
          description: 'Minimalist tiny house with all modern amenities',
          price: 95,
          address: 'Austin, Texas',
          ratings: { overall: 4.6, count: 189 }
        },
        {
          _id: 'tiny_2',
          title: 'Eco-Friendly Tiny Cabin',
          photos: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=720&h=480&fit=crop'],
          description: 'Sustainable tiny home in nature setting',
          price: 75,
          address: 'Portland, Oregon',
          ratings: { overall: 4.7, count: 145 }
        },
        {
          _id: 'tiny_3',
          title: 'Artist\'s Tiny Studio',
          photos: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=720&h=480&fit=crop'],
          description: 'Creative space perfect for artists and writers',
          price: 85,
          address: 'Asheville, North Carolina',
          ratings: { overall: 4.5, count: 98 }
        }
      ],
      'omg': [
        {
          _id: 'omg_1',
          title: 'Converted Fire Tower with 360° Views',
          photos: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=720&h=480&fit=crop'],
          description: 'Historic fire tower converted into unique accommodation',
          price: 285,
          address: 'Adirondack Mountains, New York',
          ratings: { overall: 4.9, count: 67 }
        },
        {
          _id: 'omg_2',
          title: 'Underground Earth House',
          photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=720&h=480&fit=crop'],
          description: 'Hobbit-style earth house built into hillside',
          price: 195,
          address: 'New Zealand',
          ratings: { overall: 4.8, count: 134 }
        },
        {
          _id: 'omg_3',
          title: 'Vintage Airstream Trailer',
          photos: ['https://images.unsplash.com/photo-1539066019411-549739427eb5?w=720&h=480&fit=crop'],
          description: 'Restored 1970s Airstream with modern interior',
          price: 125,
          address: 'Joshua Tree, California',
          ratings: { overall: 4.7, count: 156 }
        }
      ],
      'islands': [
        {
          _id: 'island_1',
          title: 'Private Island Villa',
          photos: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=720&h=480&fit=crop'],
          description: 'Exclusive private island with luxury amenities',
          price: 1250,
          address: 'Turks and Caicos',
          ratings: { overall: 4.9, count: 23 }
        },
        {
          _id: 'island_2',
          title: 'Overwater Bungalow',
          photos: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=720&h=480&fit=crop'],
          description: 'Traditional overwater bungalow with glass floor',
          price: 850,
          address: 'Bora Bora, French Polynesia',
          ratings: { overall: 4.8, count: 89 }
        },
        {
          _id: 'island_3',
          title: 'Secluded Beach House',
          photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&h=480&fit=crop'],
          description: 'Private beachfront house on tropical island',
          price: 650,
          address: 'Maldives',
          ratings: { overall: 4.9, count: 156 }
        }
      ]
    };
    
    return mockData[category.id] || [];
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Live anywhere - Property types
  const liveAnywhereCategories = [
    {
      _id: 'entire_homes',
      title: 'Entire homes',
      photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=320&h=240&fit=crop'],
      description: 'Comfortable private places, with room for friends or family.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    {
      _id: 'cabins',
      title: 'Cabins and cottages',
      photos: ['https://images.unsplash.com/photo-1605276373954-0c4a0dac5851?w=320&h=240&fit=crop'],
      description: 'Get back to nature in a beautiful setting.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,6l-4.22,5.63L7.25,8.75L5,12l4.25,6h9.5L14,6z"/>
        </svg>
      )
    },
    {
      _id: 'unique_stays',
      title: 'Unique stays',
      photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=320&h=240&fit=crop'],
      description: 'Spaces that are more than just a place to sleep.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      _id: 'pets_allowed',
      title: 'Pets allowed',
      photos: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=320&h=240&fit=crop'],
      description: 'Bring your pets along on the family vacation.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.5 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S6.83 11 6 11s-1.5.67-1.5 1.5zM9 16.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S11.33 15 10.5 15 9 15.67 9 16.5zm4.5-3c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"/>
        </svg>
      )
    },
    {
      _id: 'beachfront',
      title: 'Beachfront',
      photos: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=320&h=240&fit=crop'],
      description: 'Wake up to the sound of waves and ocean views.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2c-1.71-.53-3.12-1.74-4.02-3.32-.47-.83-1.47-1.01-2.21-.42C13.59 13.06 12.81 13.5 12 13.5s-1.59-.44-2.77-1.24c-.74-.59-1.74-.41-2.21.42C6.12 14.26 4.71 15.47 3 16v2z"/>
        </svg>
      )
    },
    {
      _id: 'countryside',
      title: 'Countryside',
      photos: ['https://images.unsplash.com/photo-1500076656116-558758c991c1?w=320&h=240&fit=crop'],
      description: 'Escape to peaceful rural settings and fresh air.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,6l-4.22,5.63L7.25,8.75L5,12l4.25,6h9.5L14,6z"/>
        </svg>
      )
    },
    {
      _id: 'treehouses',
      title: 'Treehouses',
      photos: ['https://images.unsplash.com/photo-1616593870412-1a5ad55a8464?w=320&h=240&fit=crop'],
      description: 'Unique elevated accommodations in nature.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7.5,13.5 12.5,10.5 17,8Z"/>
        </svg>
      )
    },
    {
      _id: 'luxury',
      title: 'Luxury stays',
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=320&h=240&fit=crop'],
      description: 'High-end properties with premium amenities.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5,16L3,14V9L5,7H9V5L11,3H13L15,5V7H19L21,9V14L19,16H15V19L13,21H11L9,19V16H5M11,5V7H13V5H11M15,9V11H19V9H15M5,9V11H9V9H5M11,19V17H13V19H11Z"/>
        </svg>
      )
    }
  ];

  // Sample data for inspiration section
  const inspirationPlaces = [
    {
      _id: 'sample_1',
      title: 'Cape Town',
      photos: ['https://images.unsplash.com/photo-1580500550469-0c7d99e9aef7?w=720&h=480&fit=crop'],
      description: '45 minutes away',
      price: 120,
      address: 'Cape Town, Western Cape'
    },
    {
      _id: 'sample_2',
      title: 'Hermanus',
      photos: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c7?w=720&h=480&fit=crop'],
      description: '1.5 hours away',
      price: 95,
      address: 'Hermanus, Western Cape'
    },
    {
      _id: 'sample_3',
      title: 'Stellenbosch',
      photos: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=720&h=480&fit=crop'],
      description: '1 hour away',
      price: 150,
      address: 'Stellenbosch, Western Cape'
    },
    {
      _id: 'sample_4',
      title: 'Paternoster',
      photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=720&h=480&fit=crop'],
      description: '2 hours away',
      price: 180,
      address: 'Paternoster, Western Cape'
    },
    {
      _id: 'sample_5',
      title: 'Garden Route',
      photos: ['https://images.unsplash.com/photo-1616593870412-1a5ad55a8464?w=720&h=480&fit=crop'],
      description: '3 hours away',
      price: 200,
      address: 'Garden Route, Western Cape'
    },
    {
      _id: 'sample_6',
      title: 'Drakensberg',
      photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=720&h=480&fit=crop'],
      description: '4 hours away',
      price: 130,
      address: 'Drakensberg, KwaZulu-Natal'
    },
    {
      _id: 'sample_7',
      title: 'Kruger Park',
      photos: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=720&h=480&fit=crop'],
      description: '5 hours away',
      price: 250,
      address: 'Kruger National Park, Mpumalanga'
    },
    {
      _id: 'sample_8',
      title: 'Wild Coast',
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&h=480&fit=crop'],
      description: '6 hours away',
      price: 175,
      address: 'Wild Coast, Eastern Cape'
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Things to do on your trip',
      image: 'https://images.unsplash.com/photo-1539066019411-549739427eb5?w=720&h=480&fit=crop',
      subtitle: 'Experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Things to do from home',
      image: 'https://images.unsplash.com/photo-1587829123002-f14e1b76c12b?w=720&h=480&fit=crop',
      subtitle: 'Online Experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
        </svg>
      )
    }
  ];

  // Experience categories matching Airbnb's style
  const experienceCategories = [
    {
      id: 'arts-culture',
      title: 'Arts & Culture',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'food-drink',
      title: 'Food & Drink',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
        </svg>
      )
    },
    {
      id: 'sports',
      title: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.89 19.38l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L9 5.5c-.6 0-1.1.4-1.3 1L6.5 10.5c-.3.8 0 1.7.8 2l1.5.5 1.5 5.5 1.5-.2z"/>
        </svg>
      )
    },
    {
      id: 'nature',
      title: 'Nature & Outdoors',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,6l-4.22,5.63L7.25,8.75L5,12l4.25,6h9.5L14,6z"/>
        </svg>
      )
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      id: 'wellness',
      title: 'Wellness',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=320&h=240&fit=crop',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.8 17.3l-4.2-4.1L4 14.8l5.8 5.7L22 8.3l-1.6-1.6L9.8 17.3z"/>
        </svg>
      )
    }
  ];

  // Future getaways - South African destinations
  const futureGetaways = [
    { name: 'Cape Town', location: 'South Africa' },
    { name: 'Johannesburg', location: 'South Africa' },
    { name: 'Durban', location: 'South Africa' },
    { name: 'Port Elizabeth', location: 'South Africa' },
    { name: 'Bloemfontein', location: 'South Africa' },
    { name: 'Pretoria', location: 'South Africa' },
    { name: 'East London', location: 'South Africa' },
    { name: 'Pietermaritzburg', location: 'South Africa' },
    { name: 'Polokwane', location: 'South Africa' },
    { name: 'Kimberley', location: 'South Africa' },
    { name: 'Nelspruit', location: 'South Africa' },
    { name: 'Rustenburg', location: 'South Africa' }
  ];

  // Discover more options
  const discoverOptions = [
    {
      id: 1,
      title: 'Vacation rentals',
      description: 'Book homes, cabins, beach houses, unique homes and experiences.',
      image: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5851?w=720&h=480&fit=crop'
    },
    {
      id: 2,
      title: 'Monthly stays',
      description: 'Stay for a month or longer and save.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=720&h=480&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/assets/hero.png"
              alt="Modern House Hero"
              title="Not sure where to go? Perfect."
              className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover"
              style={{display: 'block', margin: '0 auto'}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center px-4 w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight" style={{letterSpacing: '-0.02em'}}>
                Not sure where to go? Perfect.
              </h1>
              <button
                className="mt-8 px-10 py-4 bg-white text-rose-500 text-xl font-semibold rounded-full shadow hover:bg-gray-100 transition-colors"
                style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)'}}
              >
                I'm Flexible
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="pt-4">

        {/* Main Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Results Section */}
          {selectedCategory && selectedCategory.id && (
            <>
              <CategoryHeader 
                category={selectedCategory} 
                resultsCount={filteredPlaces.length} 
                loading={loading} 
              />
              
              <section className="py-8">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-xl mb-3"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredPlaces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPlaces.map((place) => (
                      <PlaceCard key={place._id} place={place} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">{selectedCategory.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {selectedCategory.name.toLowerCase()} properties found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or browse other categories
                    </p>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Show all properties
                    </button>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-800">{error}</span>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
          {/* Featured Luxury Property - Showcase */}
          <section className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Featured Luxury Stay</h2>
              <p className="text-lg text-gray-600">Experience the finest accommodations with premium amenities</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ClickableImage
                  src="/assets/luxury-airbnb.jpg"
                  alt="Luxury Airbnb Property"
                  title="Stunning Modern Villa with Ocean Views"
                  className="w-full h-96 md:h-[500px] object-cover"
                  containerClassName="rounded-2xl overflow-hidden"
                  showClickHint={true}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">4.9 (127 reviews)</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">Modern Luxury Villa</h3>
                    <p className="text-lg mb-2">Breathtaking ocean views • Private pool • Premium amenities</p>
                    <div className="flex items-center text-2xl font-bold">
                      <span>$450</span>
                      <span className="text-lg font-normal ml-1">/ night</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      View Details
                    </button>
                  </div>
                </ClickableImage>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">6</div>
                  <div className="text-sm text-gray-600">Guests</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">Pool</div>
                  <div className="text-sm text-gray-600">Private</div>
                </div>
              </div>
            </div>
          </section>

          {/* Live anywhere section */}
          <section className="py-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Live anywhere</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
              {liveAnywhereCategories.map((category) => (
                <div key={category._id} className="cursor-pointer group">
                  <div className="rounded-lg overflow-hidden mb-3 relative">
                    <ClickableImage
                      src={category.photos[0]} 
                      alt={category.title}
                      title={`${category.title} - ${category.description}`}
                      className="w-full h-32 sm:h-40 object-cover"
                      containerClassName="rounded-lg overflow-hidden"
                    >
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        <div className="text-gray-700">
                          {category.icon}
                        </div>
                      </div>
                    </ClickableImage>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </section>

                    {/* Real places from database */}
          {!selectedCategory && !loading && places.length > 0 && (
            <section className="py-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">Available places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {places.map((place) => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </div>
            </section>
          )}

          {/* Show location cards if no places found */}
          {!selectedCategory && !loading && places.length === 0 && (
            <section className="py-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">Popular Locations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { _id: 'loc1', title: 'Limpopo', address: 'Limpopo, South Africa', photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=720&h=480&fit=crop'], description: 'Explore the beauty of Limpopo', price: 0 },
                  { _id: 'loc2', title: 'Cape Town', address: 'Cape Town, South Africa', photos: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=720&h=480&fit=crop'], description: 'Discover Cape Town', price: 0 },
                  { _id: 'loc3', title: 'Durban', address: 'Durban, South Africa', photos: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?w=720&h=480&fit=crop'], description: 'Visit sunny Durban', price: 0 },
                  { _id: 'loc4', title: 'Pretoria', address: 'Pretoria, South Africa', photos: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=720&h=480&fit=crop'], description: 'Experience Pretoria', price: 0 },
                  { _id: 'loc5', title: 'Mpumalanga', address: 'Mpumalanga, South Africa', photos: ['https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=720&h=480&fit=crop'], description: 'Adventure in Mpumalanga', price: 0 },
                  { _id: 'loc6', title: 'London', address: 'London, UK', photos: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=720&h=480&fit=crop'], description: 'See the sights of London', price: 0 },
                  { _id: 'loc7', title: 'Johannesburg', address: 'Johannesburg, South Africa', photos: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=720&h=480&fit=crop'], description: 'Explore Johannesburg', price: 0 },
                  { _id: 'loc8', title: 'New York', address: 'New York, USA', photos: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=720&h=480&fit=crop'], description: 'Discover New York', price: 0 }
                ].map((place) => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </div>
            </section>
          )}

          {/* Show default content only when no category is selected */}
          {!selectedCategory && (
            <>
              {/* Inspiration for your next trip */}
              <section className="py-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Inspiration for your next trip</h2>
                {error && (
                  <div className="text-gray-600 mb-8">
                    Unable to load places from server. Showing sample destinations instead.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inspirationPlaces.map((place) => (
                    <PlaceCard key={place._id} place={place} />
                  ))}
                </div>
              </section>

              {/* Discover Airbnb Experiences */}
              <section className="py-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Discover Airbnb Experiences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="relative rounded-xl overflow-hidden cursor-pointer group">
                      <ClickableImage
                        src={experience.image} 
                        alt={experience.title}
                        title={`${experience.subtitle} - ${experience.title}`}
                        className="w-full h-80 object-cover"
                        containerClassName="rounded-xl overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        <div className="absolute top-6 left-6 text-white">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                            {experience.icon}
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-sm font-medium mb-2 uppercase tracking-wide">{experience.subtitle}</p>
                          <h3 className="text-2xl font-bold">{experience.title}</h3>
                        </div>
                      </ClickableImage>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience Categories */}
              <section className="py-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Browse experiences by category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {experienceCategories.map((category) => (
                    <div key={category.id} className="cursor-pointer group text-center">
                      <div className="rounded-lg overflow-hidden mb-3 relative">
                        <ClickableImage
                          src={category.image} 
                          alt={category.title}
                          title={`${category.title} Experiences`}
                          className="w-full h-32 sm:h-40 object-cover"
                          containerClassName="rounded-lg overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                            <div className="text-gray-700">
                              {category.icon}
                            </div>
                          </div>
                        </ClickableImage>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{category.title}</h3>
                    </div>
                  ))}
                </div>
              </section>

              {/* Discover more */}
              <section className="py-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Discover more</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discoverOptions.map((option) => (
                    <div key={option.id} className="relative rounded-xl overflow-hidden cursor-pointer group h-80">
                      <ClickableImage
                        src={option.image} 
                        alt={option.title}
                        title={`${option.title} - ${option.description}`}
                        className="w-full h-full object-cover"
                        containerClassName="rounded-xl overflow-hidden h-full"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                          <p className="text-lg">{option.description}</p>
                        </div>
                      </ClickableImage>
                    </div>
                  ))}
                </div>
              </section>

              {/* Inspiration for future getaways */}
              <section className="py-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Inspiration for future getaways</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {futureGetaways.map((destination, index) => (
                    <div key={index} className="cursor-pointer hover:underline">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{destination.name}</p>
                        <p className="text-gray-500">{destination.location}</p>
                      </div>
                    </div>
                  ))}
                  <div className="cursor-pointer hover:underline">
                    <p className="text-sm font-medium text-gray-900">Show more</p>
                  </div>
                </div>
              </section>

              {/* Categories */}
              <section className="py-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-8 text-sm">
                  <span className="text-gray-600 hover:underline cursor-pointer">Destinations for arts & culture</span>        
                  <span className="text-gray-600 hover:underline cursor-pointer">Destinations for outdoor adventure</span>     
                  <span className="text-gray-600 hover:underline cursor-pointer">Mountain cabins</span>
                  <span className="text-gray-600 hover:underline cursor-pointer">Beach destinations</span>
                  <span className="text-gray-600 hover:underline cursor-pointer">Popular destinations</span>
                  <span className="text-gray-600 hover:underline cursor-pointer">Unique Stays</span>
                </div>
              </section>
            </>
          )}

          {/* Experience Categories */}
          <section className="py-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Browse experiences by category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {experienceCategories.map((category) => (
                <div key={category.id} className="cursor-pointer group text-center">
                  <div className="rounded-lg overflow-hidden mb-3 relative">
                    <ClickableImage
                      src={category.image} 
                      alt={category.title}
                      title={`${category.title} Experiences`}
                      className="w-full h-32 sm:h-40 object-cover"
                      containerClassName="rounded-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        <div className="text-gray-700">
                          {category.icon}
                        </div>
                      </div>
                    </ClickableImage>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{category.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Discover more */}
          <section className="py-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Discover more</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverOptions.map((option) => (
                <div key={option.id} className="relative rounded-xl overflow-hidden cursor-pointer group h-80">
                  <ClickableImage
                    src={option.image} 
                    alt={option.title}
                    title={`${option.title} - ${option.description}`}
                    className="w-full h-full object-cover"
                    containerClassName="rounded-xl overflow-hidden h-full"
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                      <p className="text-lg">{option.description}</p>
                    </div>
                  </ClickableImage>
                </div>
              ))}
            </div>
          </section>

          {/* Inspiration for future getaways */}
          <section className="py-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Inspiration for future getaways</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {futureGetaways.map((destination, index) => (
                <div key={index} className="cursor-pointer hover:underline">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{destination.name}</p>
                    <p className="text-gray-500">{destination.location}</p>
                  </div>
                </div>
              ))}
              <div className="cursor-pointer hover:underline">
                <p className="text-sm font-medium text-gray-900">Show more</p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-8 text-sm">
              <span className="text-gray-600 hover:underline cursor-pointer">Destinations for arts & culture</span>        
              <span className="text-gray-600 hover:underline cursor-pointer">Destinations for outdoor adventure</span>     
              <span className="text-gray-600 hover:underline cursor-pointer">Mountain cabins</span>
              <span className="text-gray-600 hover:underline cursor-pointer">Beach destinations</span>
              <span className="text-gray-600 hover:underline cursor-pointer">Popular destinations</span>
              <span className="text-gray-600 hover:underline cursor-pointer">Unique Stays</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
