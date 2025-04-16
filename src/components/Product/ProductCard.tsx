
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useShop, Product } from '@/context/ShopContext';
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToWishlist } = useShop();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToWishlist(product);
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
      duration: 2000,
    });
  };
  
  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        {product.newArrival && (
          <span className="product-card-badge bg-navy-700">New</span>
        )}
        {product.bestSeller && !product.newArrival && (
          <span className="product-card-badge bg-amber-600">Best Seller</span>
        )}
        
        {/* Quick Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-3 px-2 flex justify-center space-x-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button 
            onClick={handleAddToCart}
            className="p-2 bg-navy-800 hover:bg-navy-900 text-white rounded-full transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            onClick={handleAddToWishlist}
            className="p-2 bg-white hover:bg-gray-100 text-navy-800 border border-navy-200 rounded-full transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="product-card-content">
        <h3 className="font-medium text-navy-900 line-clamp-1">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-navy-700 font-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
