
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/context/ShopContext';

interface ProductGridProps {
  products: Product[];
  columns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, columns = 4 }) => {
  let gridCols;
  
  switch (columns) {
    case 1:
      gridCols = 'grid-cols-1';
      break;
    case 2:
      gridCols = 'grid-cols-1 sm:grid-cols-2';
      break;
    case 3:
      gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      break;
    case 5:
      gridCols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      break;
    case 6:
      gridCols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      break;
    case 4:
    default:
      gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }
  
  return (
    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
