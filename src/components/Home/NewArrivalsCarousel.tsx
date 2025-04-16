
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/Product/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from '@/context/ShopContext';

interface NewArrivalsCarouselProps {
  products: Product[];
}

const NewArrivalsCarousel: React.FC<NewArrivalsCarouselProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy-900 text-center md:text-left">New Arrivals</h2>
      
      <div className="relative px-4 md:px-10">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
        
        <div className="flex justify-center mt-6 md:hidden space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              document.querySelector('[data-carousel-prev]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              );
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              document.querySelector('[data-carousel-next]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              );
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsCarousel;
