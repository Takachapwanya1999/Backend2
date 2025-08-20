// Category definitions with comprehensive metadata
export const CATEGORIES = {
  ALL: {
    id: '',
    name: 'All',
    icon: '🏠',
    description: 'All available properties',
    features: ['All property types', 'Complete selection', 'Best variety'],
    avgPrice: 150,
    propertyCount: '1000+'
  },
  BEACHFRONT: {
    id: 'beachfront',
    name: 'Beachfront',
    icon: '🏖️',
    description: 'Properties near the beach with ocean access',
    features: ['Beach access', 'Ocean views', 'Water activities'],
    avgPrice: 280,
    propertyCount: '150+'
  },
  CABINS: {
    id: 'cabins',
    name: 'Cabins',
    icon: '🛖',
    description: 'Cozy wooden cabins perfect for nature retreats',
    features: ['Natural setting', 'Fireplace', 'Hiking trails'],
    avgPrice: 165,
    propertyCount: '200+'
  },
  TRENDING: {
    id: 'trending',
    name: 'Trending',
    icon: '🔥',
    description: 'Most popular and highly-rated properties',
    features: ['Top rated', 'Recently booked', 'Guest favorites'],
    avgPrice: 220,
    propertyCount: '80+'
  },
  COUNTRYSIDE: {
    id: 'countryside',
    name: 'Countryside',
    icon: '🌾',
    description: 'Rural properties surrounded by nature',
    features: ['Peaceful setting', 'Fresh air', 'Wildlife viewing'],
    avgPrice: 140,
    propertyCount: '180+'
  },
  AMAZING_POOLS: {
    id: 'amazing-pools',
    name: 'Amazing pools',
    icon: '🏊‍♂️',
    description: 'Properties with stunning swimming pools',
    features: ['Private pool', 'Pool deck', 'Pool bar'],
    avgPrice: 320,
    propertyCount: '120+'
  },
  ROOMS: {
    id: 'rooms',
    name: 'Rooms',
    icon: '🛏️',
    description: 'Private rooms in shared accommodations',
    features: ['Private room', 'Shared spaces', 'Meet locals'],
    avgPrice: 85,
    propertyCount: '300+'
  },
  TINY_HOMES: {
    id: 'tiny-homes',
    name: 'Tiny homes',
    icon: '🏠',
    description: 'Compact, efficient, and unique small homes',
    features: ['Minimalist design', 'Eco-friendly', 'Cozy space'],
    avgPrice: 95,
    propertyCount: '90+'
  },
  LAKEFRONT: {
    id: 'lakefront',
    name: 'Lakefront',
    icon: '🏞️',
    description: 'Properties with beautiful lake views',
    features: ['Lake views', 'Water sports', 'Fishing'],
    avgPrice: 195,
    propertyCount: '110+'
  },
  DESIGN: {
    id: 'design',
    name: 'Design',
    icon: '✨',
    description: 'Architecturally stunning and design-focused properties',
    features: ['Modern design', 'Unique architecture', 'Designer furnishing'],
    avgPrice: 275,
    propertyCount: '75+'
  },
  OMG: {
    id: 'omg',
    name: 'OMG!',
    icon: '😱',
    description: 'Extraordinary and unique accommodations',
    features: ['One-of-a-kind', 'Instagram worthy', 'Unique experience'],
    avgPrice: 350,
    propertyCount: '45+'
  },
  MANSIONS: {
    id: 'mansions',
    name: 'Mansions',
    icon: '🏰',
    description: 'Luxurious large properties for groups',
    features: ['Spacious rooms', 'Luxury amenities', 'Group friendly'],
    avgPrice: 450,
    propertyCount: '60+'
  },
  TREEHOUSES: {
    id: 'treehouses',
    name: 'Treehouses',
    icon: '🌳',
    description: 'Elevated accommodations in the trees',
    features: ['Tree canopy', 'Nature immersion', 'Unique perspective'],
    avgPrice: 185,
    propertyCount: '35+'
  },
  ISLANDS: {
    id: 'islands',
    name: 'Islands',
    icon: '🏝️',
    description: 'Secluded properties on private islands',
    features: ['Private island', 'Complete privacy', 'Water access'],
    avgPrice: 500,
    propertyCount: '25+'
  }
};

// Get all categories as array
export const getAllCategories = () => Object.values(CATEGORIES);

// Get category by ID
export const getCategoryById = (id) => {
  return Object.values(CATEGORIES).find(cat => cat.id === id) || CATEGORIES.ALL;
};

// Get popular categories (most commonly searched)
export const getPopularCategories = () => [
  CATEGORIES.BEACHFRONT,
  CATEGORIES.CABINS,
  CATEGORIES.TRENDING,
  CATEGORIES.AMAZING_POOLS,
  CATEGORIES.MANSIONS
];

// Get budget-friendly categories
export const getBudgetFriendlyCategories = () => [
  CATEGORIES.ROOMS,
  CATEGORIES.TINY_HOMES,
  CATEGORIES.COUNTRYSIDE,
  CATEGORIES.CABINS
];

// Get luxury categories
export const getLuxuryCategories = () => [
  CATEGORIES.MANSIONS,
  CATEGORIES.ISLANDS,
  CATEGORIES.OMG,
  CATEGORIES.AMAZING_POOLS,
  CATEGORIES.DESIGN
];

// Category filters for backend integration
export const getCategorySearchParams = (categoryId) => {
  const searchParams = {
    'beachfront': {
      amenities: 'beach_access,ocean_view',
      propertyType: 'house,villa,apartment,cottage'
    },
    'cabins': {
      propertyType: 'cabin,cottage'
    },
    'trending': {
      featured: 'true',
      sort: '-ratings.overall',
      rating: '4.5'
    },
    'countryside': {
      amenities: 'garden,mountain_view',
      propertyType: 'house,cottage,cabin'
    },
    'amazing-pools': {
      amenities: 'pool'
    },
    'rooms': {
      roomType: 'private_room'
    },
    'tiny-homes': {
      propertyType: 'studio',
      maxGuests: '3'
    },
    'lakefront': {
      amenities: 'lake_view'
    },
    'design': {
      propertyType: 'loft,villa',
      sort: '-ratings.overall',
      rating: '4.5'
    },
    'omg': {
      propertyType: 'castle,treehouse,boat'
    },
    'mansions': {
      propertyType: 'villa,house',
      minGuests: '8',
      minPrice: '200'
    },
    'treehouses': {
      propertyType: 'treehouse'
    },
    'islands': {
      amenities: 'ocean_view,beach_access',
      propertyType: 'villa,house'
    }
  };

  return searchParams[categoryId] || {};
};

// Generate category stats
export const getCategoryStats = (categoryId) => {
  const category = getCategoryById(categoryId);
  return {
    avgPrice: category.avgPrice,
    propertyCount: category.propertyCount,
    features: category.features,
    popularAmenities: getCategoryPopularAmenities(categoryId)
  };
};

// Get popular amenities for each category
export const getCategoryPopularAmenities = (categoryId) => {
  const amenities = {
    'beachfront': ['Beach access', 'Ocean view', 'Water sports', 'Beachfront dining'],
    'cabins': ['Fireplace', 'Hot tub', 'Hiking trails', 'BBQ grill'],
    'trending': ['WiFi', 'Kitchen', 'Parking', 'Air conditioning'],
    'countryside': ['Garden', 'Mountain view', 'Pet friendly', 'Peaceful setting'],
    'amazing-pools': ['Private pool', 'Pool deck', 'Outdoor dining', 'Pool bar'],
    'rooms': ['Shared kitchen', 'WiFi', 'Host interaction', 'Local tips'],
    'tiny-homes': ['Compact design', 'Eco-friendly', 'Minimalist', 'Efficient space'],
    'lakefront': ['Lake view', 'Water activities', 'Fishing', 'Boat access'],
    'design': ['Modern furnishing', 'Designer decor', 'Architectural features', 'Art collection'],
    'omg': ['Unique design', 'Instagram worthy', 'One-of-a-kind', 'Memorable experience'],
    'mansions': ['Multiple bedrooms', 'Large living areas', 'Luxury amenities', 'Event space'],
    'treehouses': ['Tree canopy views', 'Nature sounds', 'Elevated deck', 'Wildlife viewing'],
    'islands': ['Private island', 'Water access', 'Complete privacy', 'Boat transport']
  };

  return amenities[categoryId] || ['WiFi', 'Kitchen', 'Parking', 'Air conditioning'];
};

export default {
  CATEGORIES,
  getAllCategories,
  getCategoryById,
  getPopularCategories,
  getBudgetFriendlyCategories,
  getLuxuryCategories,
  getCategorySearchParams,
  getCategoryStats,
  getCategoryPopularAmenities
};
