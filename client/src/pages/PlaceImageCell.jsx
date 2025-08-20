import React from 'react';
import ClickableImage from '../components/ui/ClickableImage';

export function PlaceImageCell({ place, className = '' }) {
  if (!place?.photos?.length) return <span className="text-slate-400 text-xs">No Image</span>;
  return (
    <ClickableImage
      src={place.photos[0]}
      alt={place.title}
      title={place.title}
      className={`w-20 h-16 object-cover rounded-md border border-gray-700 ${className}`}
      containerClassName="inline-block align-middle"
    />
  );
}
