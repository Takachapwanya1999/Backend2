import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: '🏠' },
    { id: 'beachfront', label: 'Beachfront', icon: '🏖️' },
    { id: 'cabins', label: 'Cabins', icon: '🏕️' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'countryside', label: 'Countryside', icon: '🌾' },
    { id: 'amazing-pools', label: 'Amazing pools', icon: '🏊' },
    { id: 'islands', label: 'Islands', icon: '🏝️' },
    { id: 'lakefront', label: 'Lakefront', icon: '🏞️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'tiny-homes', label: 'Tiny homes', icon: '🏘️' },
    { id: 'mansions', label: 'Mansions', icon: '🏰' },
    { id: 'treehouses', label: 'Treehouses', icon: '🌳' }
  ];

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex flex-col items-center min-w-fit gap-2 p-2 rounded-lg transition-all ${
                activeFilter === filter.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-2xl">{filter.icon}</span>
              <span className="text-xs font-medium whitespace-nowrap">
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
