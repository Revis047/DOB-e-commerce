
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import ProductCarousel from '@/components/Product/ProductCarousel';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useShop } from '@/context/ShopContext';
import { toast } from "@/hooks/use-toast";

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, addToRecentlyViewed } = useShop();
  
  const product = productId ? getProductById(productId) : undefined;
  const relatedProducts = productId ? getRelatedProducts(productId) : [];
  
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  
  // Redirect if product not found
  useEffect(() => {
    if (productId && !product) {
      navigate('/shop', { replace: true });
    }
  }, [product, productId, navigate]);
  
  // Add to recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);
  
  if (!product) {
    return null; // Or show a loading state
  }
  
  // Product images (using the main image and placeholder variations for demo)
  const productImages = [
    product.image,
    // Using the same image multiple times for demo purposes
    // In a real app, each product would have multiple images
    product.image,
    product.image
  ];
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
      duration: 3000,
    });
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100">
              <img
                src={productImages[currentImage]}
                alt={product.name}
                className="w-full object-cover aspect-square"
              />
              
              {/* Image Navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-24 h-24 rounded-md overflow-hidden ${
                    index === currentImage ? 'ring-2 ring-navy-700' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-medium text-navy-900 mb-4">${product.price.toFixed(2)}</p>
            
            {/* Product Description */}
            <div className="prose mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size 
                          ? 'border-navy-700 bg-navy-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md inline-block">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-navy-800 text-white rounded-md hover:bg-navy-900 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="py-3 px-6 border border-navy-200 rounded-md hover:bg-navy-50 transition-colors flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                Wishlist
              </button>
            </div>
            
            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium">Category:</span>
                  <span className="text-gray-600 capitalize">{product.category.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium">Product ID:</span>
                  <span className="text-gray-600">{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <ProductCarousel
              title="You May Also Like"
              products={relatedProducts}
            />
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
