import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { FloatingCartButton } from './FloatingCartButton';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface MenuScreenProps {
  onAddToCart: () => void;
  onBack: () => void;
}

export function MenuScreen({ onAddToCart, onBack }: MenuScreenProps) {
  const { t } = useTranslation();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [showCartFeedback, setShowCartFeedback] = useState(false);
  
  const menuItems = [
    {
      id: 1,
      nameKey: 'margheritaPizza',
      descKey: 'freshMozzarella',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyMzg0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: '₹399'
    },
    {
      id: 2,
      nameKey: 'pepperoniPizza',
      descKey: 'doublePepperoni',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyMzg0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: '₹449'
    },
    {
      id: 3,
      nameKey: 'veggieSupreme',
      descKey: 'mixedVeggies',
      image: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyMzg0NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      price: '₹379'
    }
  ];
  
  const handleAddToCart = (itemId: number) => {
    setAddedItems(new Set(addedItems).add(itemId));
    setCartCount(prev => prev + 1);
    setShowCartFeedback(true);
    setTimeout(() => setShowCartFeedback(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <AccessibleBackButton onClick={onBack} />
          
          <img
            src="https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Pizza Heaven"
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
          
          <h1 className="text-gray-900 text-2xl mb-2">{t('pizzaHeaven')}</h1>
          <p className="text-gray-600 mb-2">{t('italian')}, {t('pizza')}</p>
          
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">📍 1.8 {t('km')}</span>
            <span className="flex items-center gap-2">🕒 20-30 {t('min')}</span>
          </div>
        </div>
      </header>
      
      {/* Menu Items */}
      <main className="px-6 py-6">
        <h2 className="text-gray-900 text-xl mb-4">{t('menu')}</h2>
        
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={item.image}
                  alt={t(item.nameKey as any)}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg text-gray-900 mb-1">{t(item.nameKey as any)}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{t(item.descKey as any)}</p>
                  <p className="text-purple-700 text-xl">{item.price}</p>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                {addedItems.has(item.id) ? (
                  <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-center min-h-[56px] flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span className="text-lg">{t('added')}</span>
                  </div>
                ) : (
                  <AccessibleButton
                    variant="success"
                    fullWidth
                    onClick={() => handleAddToCart(item.id)}
                  >
                    {t('addToCart')}
                  </AccessibleButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={cartCount}
        onClick={onAddToCart}
      />

      {/* Cart Feedback Toast */}
      {showCartFeedback && (
        <div className="fixed bottom-28 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-lg">{t('added')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
