
import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

const CategoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.slice(0, 4).map(category => (
        <Link 
          key={category.id} 
          to={`/category/${category.id}`}
          className="group rounded-lg overflow-hidden relative h-64 shadow-sm"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="absolute inset-0 bg-navy-900 bg-opacity-40 group-hover:bg-opacity-50 transition-colors" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-white shadow-text">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
