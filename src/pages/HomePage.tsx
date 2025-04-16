import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroBanner from '@/components/Home/HeroBanner';
import CategoryGrid from '@/components/Home/CategoryGrid';
import ProductCarousel from '@/components/Product/ProductCarousel';
import NewArrivalsCarousel from '@/components/Home/NewArrivalsCarousel';
import { getBestSellerProducts, getNewArrivalProducts, getFeaturedProducts } from '@/data/products';

const HomePage: React.FC = () => {
  const bestSellers = getBestSellerProducts();
  const newArrivals = getNewArrivalProducts();
  const featuredProducts = getFeaturedProducts();
  
  return (
    <MainLayout>
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">Shop By Category</h2>
          <CategoryGrid />
        </div>
      </section>
      
      {/* New Arrivals - Using Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <NewArrivalsCarousel products={newArrivals} />
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Best Sellers"
            products={bestSellers}
          />
        </div>
      </section>
      
      {/* About Brand */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-4">About PixelCart</h2>
              <p className="text-gray-600 mb-6">
                PixelCart is a contemporary fashion brand for the modern individual. Founded in 2023, we're committed to creating high-quality, responsibly-sourced products that stand the test of time.
              </p>
              <p className="text-gray-600 mb-6">
                Our designs blend timeless style with modern sensibilities, offering versatile pieces that can be dressed up or down for any occasion.
              </p>
              <button className="btn-outline">Learn More</button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="About PixelCart" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Featured Products"
            products={featuredProducts}
          />
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-200">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md focus:outline-none text-navy-900"
              required
            />
            <button
              type="submit"
              className="bg-sand-300 text-navy-900 font-medium px-6 py-3 rounded-r-md hover:bg-sand-400 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
