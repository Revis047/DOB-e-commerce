
import { Product } from "../context/ShopContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A timeless classic white t-shirt made from 100% organic cotton. Perfect for any casual outfit.",
    category: "t-shirts",
    featured: true,
    bestSeller: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["white", "black", "gray"]
  },
  {
    id: "2",
    name: "Navy Blue Hoodie",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Stay warm and stylish with our premium navy blue hoodie. Features a kangaroo pocket and adjustable drawstrings.",
    category: "hoodies",
    newArrival: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["navy", "black", "burgundy"]
  },
  {
    id: "3",
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "These slim fit jeans offer the perfect balance of comfort and style. Made with a touch of stretch for all-day comfort.",
    category: "jeans",
    bestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["blue", "black", "gray"]
  },
  {
    id: "4",
    name: "Leather Jacket",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A classic leather jacket that never goes out of style. Made from premium quality leather with a comfortable lining.",
    category: "jackets",
    featured: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "brown"]
  },
  {
    id: "5",
    name: "Floral Summer Dress",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A beautiful floral summer dress perfect for warm days. The lightweight fabric ensures maximum comfort.",
    category: "dresses",
    newArrival: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["floral-blue", "floral-pink"]
  },
  {
    id: "6",
    name: "Casual Sneakers",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Versatile casual sneakers that go with everything. Features a cushioned insole for all-day comfort.",
    category: "shoes",
    bestSeller: true,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["white", "black", "red"]
  },
  {
    id: "7",
    name: "Winter Parka",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Stay warm in the coldest weather with our insulated winter parka. Water-resistant outer layer with a cozy inner lining.",
    category: "jackets",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["green", "black", "navy"]
  },
  {
    id: "8",
    name: "Formal Shirt",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A crisp formal shirt perfect for business meetings or special occasions. Easy-care fabric that resists wrinkles.",
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "blue", "pink"]
  },
  {
    id: "9",
    name: "Yoga Pants",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Comfortable and flexible yoga pants made from moisture-wicking fabric. Perfect for workouts or casual wear.",
    category: "activewear",
    newArrival: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["black", "gray", "navy"]
  },
  {
    id: "10",
    name: "Wool Sweater",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A warm and cozy wool sweater for the cold season. Features a classic design that never goes out of style.",
    category: "sweaters",
    bestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["gray", "navy", "burgundy"]
  },
  {
    id: "11",
    name: "Leather Belt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "A high-quality leather belt that adds the perfect finishing touch to any outfit. Available in multiple sizes.",
    category: "accessories",
    sizes: ["85cm", "90cm", "95cm", "100cm"],
    colors: ["black", "brown"]
  },
  {
    id: "12",
    name: "Summer Hat",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Protect yourself from the sun with this stylish summer hat. Lightweight and breathable with UPF protection.",
    category: "accessories",
    newArrival: true,
    sizes: ["S-M", "L-XL"],
    colors: ["beige", "white", "black"]
  }
];

export const categories = [
  { id: "t-shirts", name: "T-Shirts", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "hoodies", name: "Hoodies & Sweatshirts", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "jeans", name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "jackets", name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "dresses", name: "Dresses", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "shoes", name: "Shoes", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "activewear", name: "Activewear", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" }
];

// Helper function to get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

// Helper function to get product by ID
export const getProductById = (productId: string): Product | undefined => {
  return products.find(product => product.id === productId);
};

// Helper function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

// Helper function to get best selling products
export const getBestSellerProducts = (): Product[] => {
  return products.filter(product => product.bestSeller);
};

// Helper function to get new arrival products
export const getNewArrivalProducts = (): Product[] => {
  return products.filter(product => product.newArrival);
};

// Helper function to get related products (products in same category)
export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};
