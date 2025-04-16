
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/context/ShopContext';
import { useShop } from '@/context/ShopContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useShop();
  const { product, quantity, size, color } = item;
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(product.id, newQuantity, size, color);
  };
  
  const handleRemove = () => {
    removeFromCart(product.id, size, color);
  };
  
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Product image */}
      <Link to={`/product/${product.id}`} className="shrink-0 w-24 h-24 bg-gray-100 rounded overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </Link>
      
      {/* Product details */}
      <div className="flex flex-col sm:flex-row flex-grow ml-4 gap-2">
        <div className="flex-grow">
          <Link to={`/product/${product.id}`} className="text-navy-900 font-medium hover:text-navy-700">
            {product.name}
          </Link>
          
          {/* Product variants */}
          <div className="text-sm text-gray-600 mt-1">
            {size && <span className="mr-2">Size: {size}</span>}
            {color && <span>Color: {color}</span>}
          </div>
          
          {/* Mobile quantity and price */}
          <div className="sm:hidden flex justify-between items-center mt-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="px-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="font-medium text-navy-900">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Desktop quantity, price, and remove */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* Quantity selector */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 text-gray-500 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-gray-500 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* Price */}
          <div className="w-24 text-right font-medium text-navy-900">
            ${(product.price * quantity).toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="ml-4 p-1 text-gray-400 hover:text-gray-600"
        aria-label="Remove item"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default CartItem;
