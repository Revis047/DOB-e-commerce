
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface ShopState {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
}

type ShopAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; size?: string; color?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: { product: Product } }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: { productId: string } }
  | { type: 'ADD_TO_RECENTLY_VIEWED'; payload: { product: Product } };

interface ShopContextProps {
  state: ShopState;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  addToRecentlyViewed: (product: Product) => void;
  cartTotal: number;
  cartCount: number;
}

// Initial state
const initialState: ShopState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
};

// Load state from localStorage
const loadState = (): ShopState => {
  try {
    const serializedState = localStorage.getItem('shopState');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return initialState;
  }
};

// Reducer function
const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, size, color } = action.payload;
      
      // Check if the item already exists in the cart
      const existingItemIndex = state.cart.findIndex(
        item => 
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        
        return { ...state, cart: updatedCart };
      } else {
        // Add new item to cart
        return { 
          ...state, 
          cart: [...state.cart, { product, quantity, size, color }] 
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const { productId, size, color } = action.payload;
      const updatedCart = state.cart.filter(
        item => 
          !(item.product.id === productId && 
            item.size === size && 
            item.color === color)
      );
      
      return { ...state, cart: updatedCart };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity, size, color } = action.payload;
      
      if (quantity <= 0) {
        return shopReducer(state, { 
          type: 'REMOVE_FROM_CART', 
          payload: { productId, size, color } 
        });
      }
      
      const updatedCart = state.cart.map(item => 
        (item.product.id === productId && 
         item.size === size && 
         item.color === color)
          ? { ...item, quantity }
          : item
      );
      
      return { ...state, cart: updatedCart };
    }
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
      
    case 'ADD_TO_WISHLIST': {
      const { product } = action.payload;
      
      if (state.wishlist.some(item => item.id === product.id)) {
        return state;
      }
      
      return { 
        ...state, 
        wishlist: [...state.wishlist, product] 
      };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const { productId } = action.payload;
      const updatedWishlist = state.wishlist.filter(
        item => item.id !== productId
      );
      
      return { ...state, wishlist: updatedWishlist };
    }
    
    case 'ADD_TO_RECENTLY_VIEWED': {
      const { product } = action.payload;
      
      // Remove the product if it already exists in the list
      const filteredRecent = state.recentlyViewed.filter(
        item => item.id !== product.id
      );
      
      // Add the new product to the beginning and limit to 10 items
      const updatedRecentlyViewed = [
        product, 
        ...filteredRecent
      ].slice(0, 10);
      
      return { 
        ...state, 
        recentlyViewed: updatedRecentlyViewed 
      };
    }
    
    default:
      return state;
  }
};

// Context
const ShopContext = createContext<ShopContextProps | undefined>(undefined);

// Provider component
export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, loadState());
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shopState', JSON.stringify(state));
    } catch (err) {
      console.error('Error saving state:', err);
    }
  }, [state]);
  
  // Calculate cart total
  const cartTotal = state.cart.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
  
  // Calculate cart item count
  const cartCount = state.cart.reduce(
    (count, item) => count + item.quantity, 
    0
  );
  
  // Context methods
  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity, size, color } 
    });
  };
  
  const removeFromCart = (productId: string, size?: string, color?: string) => {
    dispatch({ 
      type: 'REMOVE_FROM_CART', 
      payload: { productId, size, color } 
    });
  };
  
  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { productId, quantity, size, color } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const addToWishlist = (product: Product) => {
    dispatch({ 
      type: 'ADD_TO_WISHLIST', 
      payload: { product } 
    });
  };
  
  const removeFromWishlist = (productId: string) => {
    dispatch({ 
      type: 'REMOVE_FROM_WISHLIST', 
      payload: { productId } 
    });
  };
  
  const addToRecentlyViewed = (product: Product) => {
    dispatch({ 
      type: 'ADD_TO_RECENTLY_VIEWED', 
      payload: { product } 
    });
  };
  
  const value = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    addToRecentlyViewed,
    cartTotal,
    cartCount
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
