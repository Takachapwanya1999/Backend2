import React from 'react';
import { Link } from 'react-router-dom';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;
  
  return (
    <Link to={`/place/${placeId}`} className="group">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg">
        <div className="aspect-square overflow-hidden rounded-xl">
          {photos?.[0] ? (
            <img
              src={photos[0]}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-semibold text-gray-900">{address}</h3>
          <p className="truncate text-sm text-gray-600">{title}</p>
          <div className="mt-2">
            <span className="font-semibold text-gray-900">${price}</span>
            <span className="text-sm text-gray-600"> per night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
