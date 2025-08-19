import React, { useState } from 'react';
import ImageModal from './ImageModal';

const ClickableImage = ({ 
  src, 
  alt = '', 
  title,
  className = '', 
  containerClassName = '',
  showClickHint = true,
  disableProxy = false,
  fallbackSrc = '/assets/view.png',
  children,
  ...props 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    // Only switch to fallback once to avoid loops if fallback also fails
    if (!imageError) setImageError(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isExternal = typeof src === 'string' && /^(https?:)?\/\//.test(src);
  const useProxy = (import.meta?.env?.VITE_USE_IMAGE_PROXY === 'true');
  const blockExternal = (import.meta?.env?.VITE_BLOCK_EXTERNAL_IMAGES === 'true') || import.meta?.env?.MODE === 'development';
  let chosen = src;
  if (isExternal) {
    if (blockExternal) {
      chosen = fallbackSrc;
    } else if (useProxy && !disableProxy) {
      chosen = `/api/proxy-image?url=${encodeURIComponent(src)}`;
    }
  }
  const effectiveSrc = imageError ? fallbackSrc : chosen;

  return (
    <>
      <div className={`relative cursor-pointer group ${containerClassName}`} onClick={openModal}>
        <img 
          src={effectiveSrc} 
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
  imageSrc={effectiveSrc}
        alt={alt}
        title={title}
      />
    </>
  );
};

export default ClickableImage;
