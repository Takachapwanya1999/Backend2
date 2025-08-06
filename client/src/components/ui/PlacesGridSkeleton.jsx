import React from 'react';

const PlaceCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-300 rounded-xl mb-3"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

const PlacesGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {[...Array(count)].map((_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PlacesGridSkeleton;
