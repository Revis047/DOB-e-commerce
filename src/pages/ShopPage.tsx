
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import ProductGrid from '@/components/Product/ProductGrid';
import { products, categories, getProductsByCategory } from '@/data/products';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryId ? [categoryId] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState('newest');
  
  const categoryName = categoryId 
    ? categories.find(c => c.id === categoryId)?.name 
    : 'All Products';
  
  // Apply filters when dependencies change
  useEffect(() => {
    let result = [...products];
    
    // Filter by category if selected
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Assuming newer items have higher IDs
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategories, priceRange, sortOption, categoryId]);
  
  // Update selected categories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      setSelectedCategories([categoryId]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryId]);
  
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };
  
  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSortOption('newest');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">{categoryName || 'Shop'}</h1>
          <p className="text-gray-600 mt-2">
            {filteredProducts.length} products
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Filter & Sort</span>
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="pb-6">
                <h3 className="font-medium text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="rounded text-navy-700 focus:ring-navy-500"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="py-6 border-t border-gray-200">
                <h3 className="font-medium text-lg mb-4">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-navy-700 hover:text-navy-900 font-medium flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-auto p-4 animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filter & Sort</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mobile-sort"
                      checked={sortOption === 'newest'}
                      onChange={() => setSortOption('newest')}
                      className="text-navy-700"
                    />
                    <span>Newest First</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mobile-sort"
                      checked={sortOption === 'price-low'}
                      onChange={() => setSortOption('price-low')}
                      className="text-navy-700"
                    />
                    <span>Price: Low to High</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mobile-sort"
                      checked={sortOption === 'price-high'}
                      onChange={() => setSortOption('price-high')}
                      className="text-navy-700"
                    />
                    <span>Price: High to Low</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="rounded text-navy-700"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full mb-4"
                  />
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-gray-300 rounded-md font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 bg-navy-800 text-white rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Product Grid & Sort - Desktop */}
          <div className="flex-1">
            {/* Sort Options - Desktop */}
            <div className="hidden lg:flex justify-end mb-6">
              <div className="relative inline-block">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-navy-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Products */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16">
                <SlidersHorizontal size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-navy-700 font-medium hover:text-navy-900"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
