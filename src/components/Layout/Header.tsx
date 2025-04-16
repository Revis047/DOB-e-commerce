
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { categories } from '@/data/products';

const Header: React.FC = () => {
  const { cartCount } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-navy-900">
            PixelCart
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-navy-800 hover:text-navy-600 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-navy-800 hover:text-navy-600 font-medium">
              Shop
            </Link>
            {categories.slice(0, 3).map(category => (
              <Link 
                key={category.id}
                to={`/category/${category.id}`}
                className="text-navy-800 hover:text-navy-600 font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-navy-800 hover:bg-navy-50 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="p-1 text-navy-800 hover:bg-navy-50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-1 text-navy-800 hover:bg-navy-50 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-navy-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Account */}
            <Link 
              to="/account" 
              className="p-1 text-navy-800 hover:bg-navy-50 rounded-full transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-navy-800 hover:bg-navy-50 rounded-full transition-colors md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-navy-500"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 right-0 border-t border-gray-100 shadow-lg animate-slide-in">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                to="/"
                className="block py-2 text-navy-800 hover:text-navy-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop"
                className="block py-2 text-navy-800 hover:text-navy-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              {categories.map(category => (
                <Link 
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="block py-2 text-navy-800 hover:text-navy-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link 
                to="/account"
                className="block py-2 text-navy-800 hover:text-navy-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link 
                to="/wishlist"
                className="block py-2 text-navy-800 hover:text-navy-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
