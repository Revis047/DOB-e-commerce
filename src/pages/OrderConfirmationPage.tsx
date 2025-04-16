
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from location state
  const orderData = location.state;
  
  // Redirect to home if there's no order data
  if (!orderData) {
    // In a real application, you might want to check for order data in a more persistent store
    // like context or localStorage before redirecting
    React.useEffect(() => {
      navigate('/', { replace: true });
    }, [navigate]);
    
    return null;
  }
  
  const { orderId, customerInfo, orderItems, shippingMethod, orderTotal } = orderData;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Order Confirmed!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>
          
          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-navy-900">Order #{orderId}</h2>
                <p className="text-gray-600">
                  Placed on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="bg-green-100 text-green-800 font-medium text-sm py-1 px-3 rounded-full">
                Processing
              </div>
            </div>
            
            {/* Shipping Info */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="font-semibold mb-3 flex items-center">
                <Package size={18} className="mr-2" />
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Shipping Address</h4>
                  <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                  <p>{customerInfo.address}</p>
                  <p>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                  <p>{customerInfo.country}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Shipping Method</h4>
                  <p>{shippingMethod.name}</p>
                  <p className="text-sm text-gray-600">{shippingMethod.description}</p>
                  
                  <div className="mt-3 flex items-center text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span className="text-sm">
                      Estimated delivery: {shippingMethod.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="font-semibold mb-4">Order Items</h3>
              
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="font-medium">{item.product.name}</div>
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
            
            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(orderTotal - shippingMethod.price).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shippingMethod.price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-1">
                If you have any questions about your order, please contact our customer support.
              </p>
              <Link to="/contact" className="text-navy-700 hover:text-navy-900 text-sm font-medium">
                Contact Support
              </Link>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="btn-primary sm:px-8 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </Link>
            
            <Link
              to="/account"
              className="btn-outline sm:px-8 flex items-center justify-center gap-2"
            >
              <span>View All Orders</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmationPage;
