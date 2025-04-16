
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Summer Collection 2025',
    subtitle: 'Refresh your wardrobe with our latest summer essentials',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ctaText: 'Shop Now',
    ctaLink: '/shop'
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Check out our freshest styles hot off the press',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ctaText: 'Discover',
    ctaLink: '/category/new-arrivals'
  },
  {
    id: '3',
    title: 'Accessories Collection',
    subtitle: 'Complete your look with our premium accessories',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ctaText: 'Browse',
    ctaLink: '/category/accessories'
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <div className="relative overflow-hidden h-[500px] sm:h-[600px] md:h-[700px] group">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-6 text-center text-white">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
                <Link 
                  to={slide.ctaLink}
                  className="btn-primary inline-block text-lg px-8 py-3 rounded-lg"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
