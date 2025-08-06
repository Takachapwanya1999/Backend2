import React, { useState } from 'react';

const Image = ({ src, alt = '', className = 'rounded-xl', fallback, ...rest }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`} {...rest}>
        {fallback || (
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400 text-xs">Image unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...rest}>
          <div className="animate-pulse">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${className} ${loading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        {...rest} 
      />
    </>
  );
};

export default Image;
