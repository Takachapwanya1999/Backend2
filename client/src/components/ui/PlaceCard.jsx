import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickableImage from './ClickableImage';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price, rating } = place;
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
      <div className="relative overflow-hidden rounded-xl bg-slate-800 shadow-lg transition-all hover:shadow-xl border border-slate-700">
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
            <div className="flex h-full w-full items-center justify-center bg-slate-700">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-400 text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
                <div className="p-4 bg-slate-800">
          <h3 className="font-semibold text-slate-100 mb-1 line-clamp-1" title={title}>
            {title}
          </h3>
          
          <div className="flex items-center text-slate-300 text-sm mb-2">
            <svg 
              className="w-4 h-4 mr-1 text-slate-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="line-clamp-1" title={address}>{address}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-slate-100">
              <span className="font-semibold">${price}</span>
              <span className="text-slate-300 text-sm ml-1">/ night</span>
            </div>
            
            {/* Rating display if available */}
            {rating && (
              <div className="flex items-center text-slate-300 text-sm">
                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
