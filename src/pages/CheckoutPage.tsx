
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShoppingBag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useShop } from '@/context/ShopContext';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/utils/stripe';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 5.99,
    estimatedDelivery: '5-7 business days'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12.99,
    estimatedDelivery: '2-3 business days'
  }
];

// Define the checkout steps
enum CheckoutStep {
  INFORMATION = 1,
  SHIPPING = 2,
  PAYMENT = 3,
  REVIEW = 4
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, cartTotal, clearCart } = useShop();
  const { cart } = state;
  
  // Form states
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.INFORMATION);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'local'>('stripe');
  
  // Make sure cart is not empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name as keyof CustomerInfo]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<CustomerInfo> = {};
    let isValid = true;
    
    // Required fields
    const requiredFields: Array<keyof CustomerInfo> = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'country'];
    
    requiredFields.forEach(field => {
      if (!customerInfo[field]) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });
    
    // Email validation
    if (customerInfo.email && !/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleNextStep = () => {
    if (currentStep === CheckoutStep.INFORMATION) {
      if (!validateForm()) {
        toast({
          title: "Form validation failed",
          description: "Please check the form for errors.",
          variant: "destructive"
        });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, CheckoutStep.REVIEW) as CheckoutStep);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, CheckoutStep.INFORMATION) as CheckoutStep);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'stripe') {
        // Prepare cart items for Stripe
        const items = cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price * 100, // Convert to cents for Stripe
          quantity: item.quantity
        }));

        const session = await createCheckoutSession(items, customerInfo.email);
        
        // For a real implementation, redirect to Stripe checkout
        // window.location.href = session.url;
        
        // For this demo, we'll simulate a successful checkout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear the cart
        clearCart();
        
        // Navigate to the order confirmation page
        navigate('/order-confirmed', { 
          state: { 
            orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
            customerInfo,
            orderItems: cart,
            shippingMethod: shippingMethods.find(m => m.id === selectedShippingMethod),
            paymentMethod: paymentMethod,
            orderTotal: cartTotal + (shippingMethods.find(m => m.id === selectedShippingMethod)?.price || 0)
          }
        });
      } else {
        // For PayPal or local payment methods
        // Here we would implement the specific payment gateway integration
        // For now, let's simulate a successful checkout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        clearCart();
        
        navigate('/order-confirmed', { 
          state: { 
            orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
            customerInfo,
            orderItems: cart,
            shippingMethod: shippingMethods.find(m => m.id === selectedShippingMethod),
            paymentMethod: paymentMethod,
            orderTotal: cartTotal + (shippingMethods.find(m => m.id === selectedShippingMethod)?.price || 0)
          }
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculate order total
  const shippingCost = shippingMethods.find(m => m.id === selectedShippingMethod)?.price || 0;
  const orderTotal = cartTotal + shippingCost;

  // Step indicators component
  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= CheckoutStep.INFORMATION ? 'bg-navy-700 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
          <div className={`h-1 w-12 ${currentStep > CheckoutStep.INFORMATION ? 'bg-navy-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= CheckoutStep.SHIPPING ? 'bg-navy-700 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
          <div className={`h-1 w-12 ${currentStep > CheckoutStep.SHIPPING ? 'bg-navy-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= CheckoutStep.PAYMENT ? 'bg-navy-700 text-white' : 'bg-gray-200 text-gray-400'}`}>3</div>
          <div className={`h-1 w-12 ${currentStep > CheckoutStep.PAYMENT ? 'bg-navy-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= CheckoutStep.REVIEW ? 'bg-navy-700 text-white' : 'bg-gray-200 text-gray-400'}`}>4</div>
        </div>
      </div>
      <div className="flex justify-between text-xs mt-2 px-2">
        <div className="text-center w-20">Information</div>
        <div className="text-center w-20">Shipping</div>
        <div className="text-center w-20">Payment</div>
        <div className="text-center w-20">Review</div>
      </div>
    </div>
  );
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-navy-700 hover:text-navy-900"
            aria-label="Back to cart"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to cart
          </button>
          <h1 className="text-3xl font-bold text-navy-900 ml-4">Checkout</h1>
        </div>
        
        <StepIndicator />
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Customer & Shipping Info */}
            <div className="lg:w-2/3">
              {/* Customer Information Step */}
              {currentStep === CheckoutStep.INFORMATION && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-navy-900 mb-6">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleCustomerInfoChange}
                      className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={customerInfo.state}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={customerInfo.zipCode}
                        onChange={handleCustomerInfoChange}
                        className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500 ${
                          formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={customerInfo.country}
                        onChange={handleCustomerInfoChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-navy-500"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Shipping Method Step */}
              {currentStep === CheckoutStep.SHIPPING && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-navy-900 mb-6">Shipping Method</h2>
                  
                  <div className="space-y-4">
                    {shippingMethods.map(method => (
                      <label
                        key={method.id}
                        className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                          selectedShippingMethod === method.id 
                            ? 'border-navy-700 bg-navy-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={selectedShippingMethod === method.id}
                            onChange={() => setSelectedShippingMethod(method.id)}
                            className="mt-1"
                          />
                          <div className="ml-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{method.name}</span>
                              <span className="font-medium">${method.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Payment Information Step */}
              {currentStep === CheckoutStep.PAYMENT && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-navy-900 mb-6">Payment Information</h2>
                  
                  {/* Payment method selection */}
                  <div className="space-y-4 mb-6">
                    <label
                      className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'stripe' ? 'border-navy-700 bg-navy-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="stripe"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Credit Card (Stripe)</span>
                            <CreditCard className="text-navy-700 h-5 w-5" />
                          </div>
                          <p className="text-sm text-gray-600">Pay securely with credit or debit card</p>
                        </div>
                      </div>
                    </label>
                    
                    <label
                      className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'paypal' ? 'border-navy-700 bg-navy-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <span className="font-medium">PayPal</span>
                          <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                        </div>
                      </div>
                    </label>
                    
                    <label
                      className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'local' ? 'border-navy-700 bg-navy-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="local"
                          checked={paymentMethod === 'local'}
                          onChange={() => setPaymentMethod('local')}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <span className="font-medium">Mobile Money</span>
                          <p className="text-sm text-gray-600">Pay with M-Pesa or Airtel Money</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {/* Payment information based on selected method */}
                  {paymentMethod === 'stripe' && (
                    <div className="flex items-center mb-4 py-2 px-4 bg-gray-50 border border-gray-200 rounded-md">
                      <CreditCard className="text-navy-700 mr-3" />
                      <p>Payment will be processed securely with Stripe</p>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="flex items-center mb-4 py-2 px-4 bg-gray-50 border border-gray-200 rounded-md">
                      <p>You will be redirected to PayPal to complete your payment</p>
                    </div>
                  )}
                  
                  {paymentMethod === 'local' && (
                    <div className="flex items-center mb-4 py-2 px-4 bg-gray-50 border border-gray-200 rounded-md">
                      <p>You will receive payment instructions on your phone</p>
                    </div>
                  )}
                  
                  <div className="flex items-start bg-yellow-50 p-4 border border-yellow-200 rounded-md">
                    <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-700">Test Mode</p>
                      <p className="text-sm text-yellow-600">
                        This is a demo store. No actual payment will be processed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Review Order Step */}
              {currentStep === CheckoutStep.REVIEW && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-navy-900 mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    {/* Customer Information Summary */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-navy-800">Customer Information</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(CheckoutStep.INFORMATION)}
                          className="text-sm text-navy-600"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                        <p>{customerInfo.email}</p>
                        {customerInfo.phone && <p>{customerInfo.phone}</p>}
                      </div>
                    </div>
                    
                    {/* Shipping Information Summary */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-navy-800">Shipping Address</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(CheckoutStep.INFORMATION)}
                          className="text-sm text-navy-600"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p>{customerInfo.address}</p>
                        <p>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                        <p>{customerInfo.country}</p>
                      </div>
                    </div>
                    
                    {/* Shipping Method Summary */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-navy-800">Shipping Method</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(CheckoutStep.SHIPPING)}
                          className="text-sm text-navy-600"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm">
                        {shippingMethods.find(m => m.id === selectedShippingMethod)?.name} - 
                        ${shippingMethods.find(m => m.id === selectedShippingMethod)?.price.toFixed(2)}
                        <p className="text-gray-500">
                          Estimated delivery: {shippingMethods.find(m => m.id === selectedShippingMethod)?.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                    
                    {/* Payment Method Summary */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-navy-800">Payment Method</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(CheckoutStep.PAYMENT)}
                          className="text-sm text-navy-600"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm flex items-center">
                        {paymentMethod === 'stripe' && (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Credit Card (Stripe)
                          </>
                        )}
                        {paymentMethod === 'paypal' && (
                          <>
                            <span className="mr-2">PayPal</span>
                          </>
                        )}
                        {paymentMethod === 'local' && (
                          <>
                            <span className="mr-2">Mobile Money</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Items Summary */}
                    <div className="border-t pt-4">
                      <h3 className="font-medium text-navy-800 mb-2">Order Items</h3>
                      <div className="space-y-2 max-h-60 overflow-auto">
                        {cart.map((item, index) => (
                          <div key={index} className="flex py-2 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <div className="font-medium line-clamp-1">{item.product.name}</div>
                              <div className="text-sm text-gray-600">
                                {item.size && <span className="mr-2">Size: {item.size}</span>}
                                {item.quantity > 1 && <span>Qty: {item.quantity}</span>}
                              </div>
                            </div>
                            <div className="font-medium ml-2 whitespace-nowrap">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > CheckoutStep.INFORMATION && (
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="flex items-center"
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                {currentStep < CheckoutStep.REVIEW ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center ml-auto"
                  >
                    {isProcessing ? (
                      <>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Order</span>
                        <CheckCircle2 size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Order Summary</h2>
                
                {/* Order Items */}
                <div className="max-h-64 overflow-auto mb-4 pr-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex py-3 border-b border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="font-medium line-clamp-1">{item.product.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.size && <span className="mr-2">Size: {item.size}</span>}
                          {item.quantity > 1 && <span>Qty: {item.quantity}</span>}
                        </div>
                      </div>
                      <div className="font-medium ml-2 whitespace-nowrap">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {currentStep === CheckoutStep.REVIEW && (
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 font-medium flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Order</span>
                        <ShoppingBag size={16} />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
