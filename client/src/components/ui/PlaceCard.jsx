import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickableImage from './ClickableImage';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Handle click for sample places vs real places
  const handleClick = (e) => {
    // If it's a sample place (starts with 'sample_'), prevent navigation
    if (placeId && placeId.toString().startsWith('sample_')) {
      e.preventDefault();
      // Instead, navigate to search page or show a message
      navigate('/places');
      return;
    }
    // For real places, allow normal navigation
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Link 
      to={placeId && !placeId.toString().startsWith('sample_') ? `/place/${placeId}` : '/places'} 
      className="group"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg">
        <div className="aspect-square overflow-hidden rounded-xl">
          {photos?.[0] && !imageError ? (
            <ClickableImage
              src={photos[0]}
              alt={title}
              title={`${title || 'Property'} - ${address || 'Location'} - $${price || 0} per night`}
              className="h-full w-full object-cover"
              containerClassName="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-semibold text-gray-900">{address || 'Location not specified'}</h3>
          <p className="truncate text-sm text-gray-600">{title || 'No title'}</p>
          <div className="mt-2">
            <span className="font-semibold text-gray-900">${price || 0}</span>
            <span className="text-sm text-gray-600"> per night</span>
          </div>
          {placeId && placeId.toString().startsWith('sample_') && (
            <div className="mt-1">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Sample Listing</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
