
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useShop } from '@/context/ShopContext';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WishlistPage: React.FC = () => {
  const { state, removeFromWishlist, addToCart } = useShop();
  const { wishlist } = state;

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
      duration: 2000,
    });
  };

  const handleMoveToCart = (productId: string) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(productId);
      toast({
        title: "Item moved to cart",
        description: `${product.name} has been moved to your cart.`,
        duration: 2000,
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-navy-900">My Wishlist</h1>
            <span className="text-navy-600 font-medium">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {wishlist.length > 0 ? (
            <div>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="hidden md:grid md:grid-cols-12 p-4 border-b text-sm font-medium text-navy-600">
                  <div className="md:col-span-6">Product</div>
                  <div className="md:col-span-2 text-center">Price</div>
                  <div className="md:col-span-4 text-right">Actions</div>
                </div>
                
                <div className="divide-y">
                  {wishlist.map((product) => (
                    <div key={product.id} className="grid grid-cols-12 p-4 gap-4 items-center">
                      {/* Product Image & Info - Mobile: Full Width, Desktop: 6 cols */}
                      <div className="col-span-12 md:col-span-6">
                        <div className="flex items-center space-x-4">
                          <Link to={`/product/${product.id}`} className="block w-20 h-20 flex-shrink-0">
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </Link>
                          <div className="flex-grow">
                            <Link 
                              to={`/product/${product.id}`}
                              className="font-medium text-navy-900 hover:text-navy-700 line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-navy-600 mt-1 capitalize">
                              {product.category.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price - Mobile: Left side with label, Desktop: 2 cols */}
                      <div className="col-span-6 md:col-span-2 md:text-center">
                        <div className="md:hidden text-sm text-navy-600">Price:</div>
                        <div className="font-medium text-navy-900">${product.price.toFixed(2)}</div>
                      </div>
                      
                      {/* Actions - Mobile: Right side, Desktop: 4 cols */}
                      <div className="col-span-6 md:col-span-4 flex justify-end space-x-2">
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMoveToCart(product.id)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingCart size={16} />
                          <span className="hidden sm:inline">Add to Cart</span>
                        </Button>
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          className="text-gray-500"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <Link to="/shop">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
                {wishlist.length > 0 && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      wishlist.forEach(item => removeFromWishlist(item.id));
                      toast({
                        title: "Wishlist cleared",
                        description: "All items have been removed from your wishlist.",
                        duration: 2000,
                      });
                    }}
                  >
                    Clear Wishlist
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Heart size={48} className="text-navy-300" />
              </div>
              <h2 className="text-xl font-medium text-navy-900 mb-2">Your wishlist is empty</h2>
              <p className="text-navy-600 mb-6">
                Items added to your wishlist will appear here. Start exploring and save items you love!
              </p>
              <Link to="/shop">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
