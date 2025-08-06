import React, { useState } from 'react';
import ImageModal from './ImageModal';

const ClickableImage = ({ 
  src, 
  alt = '', 
  title,
  className = '', 
  containerClassName = '',
  showClickHint = true,
  children,
  ...props 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`} {...props}>
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-400 text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative cursor-pointer group ${containerClassName}`} onClick={openModal}>
        <img 
          src={src} 
          alt={alt} 
          className={`${className} transition-transform duration-300 group-hover:scale-105`}
          onError={handleImageError}
          loading="lazy"
          {...props} 
        />
        
        {/* Click hint overlay */}
        {showClickHint && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Additional content (like icons, text overlays) */}
        {children}
      </div>
      
      <ImageModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={src}
        alt={alt}
        title={title}
      />
    </>
  );
};

export default ClickableImage;
