
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import CartItem from '@/components/Cart/CartItem';
import { useShop } from '@/context/ShopContext';

const CartPage: React.FC = () => {
  const { state, cartTotal, clearCart } = useShop();
  const { cart } = state;
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  // Calculate shipping (free over $100)
  const shippingCost = cartTotal >= 100 ? 0 : 7.99;
  
  // Calculate total with shipping
  const orderTotal = cartTotal + shippingCost;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-8">Your Cart</h1>
        
        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-navy-900">
                    Cart Items ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                  <button 
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div>
                  {cart.map((item, index) => (
                    <CartItem key={index} item={item} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-navy-900 mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 
                        ? 'Free' 
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && (
                    <div className="text-xs text-gray-500 pt-1">
                      Free shipping on orders over $100
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <label htmlFor="promo" className="block text-sm font-medium mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo"
                      className="flex-grow border rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500"
                      placeholder="Enter promo code"
                    />
                    <button
                      className="bg-navy-100 border border-navy-200 text-navy-800 px-4 rounded-r-md hover:bg-navy-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="w-full py-3 bg-navy-800 text-white rounded-md font-medium hover:bg-navy-900 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </Link>
                
                <div className="mt-4">
                  <Link
                    to="/shop"
                    className="text-navy-700 hover:text-navy-900 text-sm flex items-center gap-1 justify-center"
                  >
                    <ShoppingBag size={14} />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-medium text-navy-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="btn-primary inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
