import React from 'react';
import { getCategoryPopularAmenities } from '../../utils/categories';

const CategoryHeader = ({ category, resultsCount, loading }) => {
  if (!category || !category.id) return null;

  const amenities = getCategoryPopularAmenities(category.id);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Category Icon and Title */}
            <div className="flex items-center mb-4">
              <div className="text-6xl mr-4">{category.icon}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {category.name} Properties
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  {loading ? (
                    <span>Loading properties...</span>
                  ) : (
                    <span>{resultsCount} properties available</span>
                  )}
                  <span className="mx-2">•</span>
                  <span>Avg ${category.avgPrice}/night</span>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">What to expect:</h3>
              <div className="flex flex-wrap gap-2">
                {category.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Amenities */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Popular amenities:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenities.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="hidden lg:block ml-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-[240px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Price</span>
                  <span className="text-lg font-bold text-gray-900">${category.avgPrice}/night</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Properties</span>
                  <span className="text-lg font-bold text-gray-900">{category.propertyCount}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Price Range</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">${Math.round(category.avgPrice * 0.6)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Luxury</span>
                    <span className="font-medium">${Math.round(category.avgPrice * 1.8)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
