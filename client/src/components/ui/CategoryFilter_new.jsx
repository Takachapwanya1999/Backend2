import React, { useState } from 'react';
import { getAllCategories, getCategoryStats } from '../../utils/categories';

const CategoryFilter = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const categories = getAllCategories();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    onCategoryChange?.(category);
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide py-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center space-y-1 min-w-0 flex-shrink-0 group relative transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-2'
                    : 'text-gray-500 hover:text-gray-700 pb-4'
                }`}
                title={category.description}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {category.icon}
                </span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {category.name}
                </span>
                
                {/* Enhanced tooltip on hover */}
                <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                  <div className="font-medium mb-1">{category.description}</div>
                  <div className="flex items-center space-x-4 text-gray-300">
                    <span>Avg ${stats.avgPrice}/night</span>
                    <span>•</span>
                    <span>{stats.propertyCount} places</span>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>

                {/* Active indicator */}
                {activeCategory === category.id && (
                  <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
