import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface CartScreenProps {
  onCheckout: () => void;
  onBack: () => void;
}

export function CartScreen({ onCheckout, onBack }: CartScreenProps) {
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState<Record<number, number>>({
    1: 2,
    2: 1
  });
  
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);
  
  const cartItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyMzg0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 399
    },
    {
      id: 2,
      name: 'Pepperoni Special',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyMzg0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: 449
    }
  ];
  
  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };
  
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * (quantities[item.id] || 1));
  }, 0);
  
  const delivery = 40;
  const discount = 150;
  const total = subtotal + delivery - discount;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} />
          <h1 className="text-gray-900 text-2xl">{t('myCart')}</h1>
        </div>
      </header>
      
      {/* Cart Items */}
      <main className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-4 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-purple-700 text-xl">Rs. {item.price}</p>
                </div>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="min-w-[44px] min-h-[44px] bg-white rounded-lg text-xl flex items-center justify-center hover:bg-gray-100"
                  >
                    −
                  </button>
                  
                  <span className="text-xl min-w-[40px] text-center">{quantities[item.id]}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="min-w-[44px] min-h-[44px] bg-white rounded-lg text-xl flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => setShowRemoveConfirm(item.id)}
                  className="text-red-600 underline text-lg min-h-[44px] px-4"
                >
                  {t('remove')}
                </button>
              </div>
              
              {/* Remove Confirmation */}
              {showRemoveConfirm === item.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <p className="text-gray-900 mb-4">{t('remove')} {item.name}?</p>
                  <div className="flex gap-3">
                    <AccessibleButton
                      variant="primary"
                      fullWidth
                      onClick={() => setShowRemoveConfirm(null)}
                    >
                      {t('no')}
                    </AccessibleButton>
                    
                    <AccessibleButton
                      variant="outlined"
                      fullWidth
                      onClick={() => setShowRemoveConfirm(null)}
                      className="!border-red-600 !text-red-600 hover:!bg-red-50"
                    >
                      {t('yes')}
                    </AccessibleButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bill Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4">{t('orderSummary')}</h2>
          
          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="text-gray-900">Rs. {subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('deliveryFee')}</span>
              <span className="text-gray-900">Rs. {delivery}</span>
            </div>
            
            <div className="flex justify-between text-green-600">
              <span>{t('discount')}</span>
              <span>−Rs. {discount}</span>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-2xl">
                <span className="text-gray-900">{t('total')}</span>
                <span className="text-purple-700">Rs. {total}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 space-y-3">
        <AccessibleButton
          variant="success"
          fullWidth
          onClick={onCheckout}
        >
          {t('checkout')}
        </AccessibleButton>
        
        <AccessibleButton
          variant="outlined"
          fullWidth
          onClick={onBack}
        >
          {t('addMore')}
        </AccessibleButton>
      </div>
    </div>
  );
}
