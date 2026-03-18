import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, count, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="flex items-center">
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${starSize} ${i < fullStars ? 'fill-current' : i === fullStars && hasHalfStar ? 'fill-current opacity-50' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="ml-2 text-sm text-gray-500">({count} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
