import { VoiceSearch } from './VoiceSearch';
import { NotificationBadge } from './NotificationBadge';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { MascotIcon } from './MascotIcon';
import { LanguageToggle } from './LanguageToggle';

interface EnhancedHomeScreenProps {
  onNavigateToRestaurants: () => void;
  onNavigateToCart: (restaurantId?: string) => void;
  onNavigateToRewards: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSearch: () => void;
  onNavigateToMultiCart?: () => void;
  onNavigateToMenu?: (restaurantId: string) => void;
  cartCount: number;
  currentLocation: string;
  carts?: { id: string; restaurantName: string; items: { name: string; quantity: number }[] }[];
  onRemoveCart?: (cartId: string) => void;
  activeOrder?: { restaurantName: string; status: string; estimatedTime: string; orderId: string };
  onTrackOrder?: () => void;
}

export function EnhancedHomeScreen({ 
  onNavigateToRestaurants, 
  onNavigateToCart,
  onNavigateToRewards,
  onNavigateToProfile,
  onNavigateToSearch,
  onNavigateToMultiCart,
  onNavigateToMenu,
  cartCount,
  currentLocation,
  carts = [],
  onRemoveCart,
  activeOrder,
  onTrackOrder
}: EnhancedHomeScreenProps) {
  const { t } = useTranslation();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [isListening, setIsListening] = useState(false);
  const [listeningState, setListeningState] = useState<'listening' | 'understanding' | 'opening'>('listening');
  const [recognizedText, setRecognizedText] = useState('');
  const [isOrderWidgetVisible, setIsOrderWidgetVisible] = useState(true);
  
  const handleVoiceSearch = () => {
    setIsListening(true);
    setListeningState('listening');
    setRecognizedText('');
    
    // Simulate listening for 2 seconds
    setTimeout(() => {
      setListeningState('understanding');
      setRecognizedText('I want biryani from Kolachi');
      
      // Simulate understanding for 2 seconds
      setTimeout(() => {
        setListeningState('opening');
        
        // Navigate to Kolachi after 1.5 seconds
        setTimeout(() => {
          setIsListening(false);
          if (onNavigateToMenu) {
            onNavigateToMenu('restaurant-1'); // Kolachi Restaurant
          }
        }, 1500);
      }, 2000);
    }, 2000);
  };
  
  const categories = [
    { 
      name: 'biryani', 
      image: 'https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZXxlbnwxfHx8fDE3NjI1MDc1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'bbq', 
      image: 'https://images.unsplash.com/photo-1702741168115-cd3d9a682972?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjI1OTIxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'pizza', 
      image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc2MjUxOTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'desserts', 
      image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjI1MjM4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'chinese', 
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjI0OTY3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'burgers', 
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllc3xlbnwxfHx8fDE3NjI1MjkzMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'sushi', 
      image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJvbGxzfGVufDF8fHx8MTc2MjU1ODM1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'pasta', 
      image: 'https://images.unsplash.com/photo-1703258581842-31608ecd6528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW58ZW58MXx8fHwxNzYyNTAyNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'kebabs', 
      image: 'https://images.unsplash.com/photo-1626323109252-0adb3b46692b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZWJhYiUyMHNrZXdlcnN8ZW58MXx8fHwxNzYyNTMxNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'seafood', 
      image: 'https://images.unsplash.com/photo-1758972572427-fc3d4193bbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcHJhd25zfGVufDF8fHx8MTc2MjU5MjE3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'salads', 
      image: 'https://images.unsplash.com/photo-1692780941266-96892bb6c9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHl8ZW58MXx8fHwxNzYyNDczODIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { 
      name: 'wraps', 
      image: 'https://images.unsplash.com/photo-1705131187470-9458824c0d79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMHdyYXB8ZW58MXx8fHwxNzYyNDk2MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const featuredRestaurants = [
    {
      id: 'restaurant-1',
      nameKey: 'kolachiRestaurant',
      image: 'https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '2.1 ' + t('km'),
      rating: '4.5',
      time: '25-35 ' + t('min'),
      discount: '15% ' + t('off'),
      cuisine: `${t('pakistani')}, ${t('bbq')}`,
      status: 'top-rated'
    },
    {
      id: 'restaurant-2',
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '3.5 ' + t('km'),
      rating: '4.7',
      time: '30-40 ' + t('min'),
      discount: '20% ' + t('off'),
      cuisine: `${t('bbq')}, ${t('karahi')}, ${t('desi')}`,
      status: 'top-rated'
    },
    {
      id: 'restaurant-3',
      nameKey: 'studentBiryani',
      image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '1.2 ' + t('km'),
      rating: '4.3',
      time: '15-25 ' + t('min'),
      discount: null,
      cuisine: `${t('biryani')}, ${t('fastFood')}`,
      status: 'fast-delivery'
    },
    {
      id: 'restaurant-4',
      nameKey: 'spiceParadise',
      image: 'https://images.unsplash.com/photo-1700324638718-dade543770fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9hc3QlMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '4.2 ' + t('km'),
      rating: '4.8',
      time: '35-45 ' + t('min'),
      discount: '25% ' + t('off'),
      cuisine: `${t('desi')}, ${t('chinese')}`,
      status: 'top-rated'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <MascotIcon className="h-12 w-12" />
          <div data-tutorial-id="language-toggle">
            <LanguageToggle variant="compact" />
          </div>
        </div>
        
        {/* Delivery/Pickup Toggle */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setDeliveryMode('delivery')}
            className={`flex-1 min-h-[56px] rounded-xl transition-all ${
              deliveryMode === 'delivery'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🚚</span>
              <span className="text-lg">{t('delivery')}</span>
            </span>
          </button>
          
          <button
            onClick={() => setDeliveryMode('pickup')}
            className={`flex-1 min-h-[56px] rounded-xl transition-all ${
              deliveryMode === 'pickup'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏪</span>
              <span className="text-lg">{t('pickup')}</span>
            </span>
          </button>
        </div>
        
        {/* Location Bar */}
        <button className="w-full mb-4 text-left">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200">
            <span className="text-2xl">📍</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">{t('deliveringTo')}</p>
              <p className="text-gray-900 truncate">{currentLocation}</p>
            </div>
            <span className="text-purple-700">{t('changeLocation')}</span>
          </div>
        </button>
        
        {/* Search Bar */}
        <button 
          onClick={onNavigateToSearch}
          className="w-full text-left"
          data-tutorial-id="search-button"
        >
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200">
            <span className="text-2xl">🔍</span>
            <span className="text-gray-600 text-lg">{t('searchFoodRestaurant')}</span>
          </div>
        </button>
      </header>
      
      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Deals Banner */}
        <button 
          onClick={onNavigateToRestaurants}
          className="w-full mb-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl mb-1">🎉 {t('dealsNearYou')}</p>
              <p className="text-purple-100">{t('upTo50Off')}</p>
            </div>
            <span className="text-3xl">→</span>
          </div>
        </button>

        {/* Voice Search Button */}
        <div className="mb-6" data-tutorial-id="voice-guide">
          <button
            onClick={handleVoiceSearch}
            className="w-full min-h-[72px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-2xl px-6 py-4 transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              {/* Animated Microphone Icon with Ripple Effect */}
              <div className="relative">
                {/* Ripple Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-purple-300 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                </div>
                
                {/* Microphone Icon */}
                <div className="relative w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <span className="text-3xl">🎙️</span>
                </div>
              </div>
              
              {/* Text */}
              <div className="flex-1 text-left">
                <p className="text-xl text-gray-900">{t('voiceSearchTitle')}</p>
                <p className="text-gray-600">{t('tapToSpeakOrder')}</p>
              </div>
              
              {/* Sound Wave Animation */}
              <div className="flex items-center gap-1">
                <div className="w-1 bg-purple-600 rounded-full animate-pulse" style={{ height: '12px', animationDelay: '0ms', animationDuration: '600ms' }}></div>
                <div className="w-1 bg-purple-600 rounded-full animate-pulse" style={{ height: '20px', animationDelay: '100ms', animationDuration: '600ms' }}></div>
                <div className="w-1 bg-purple-600 rounded-full animate-pulse" style={{ height: '16px', animationDelay: '200ms', animationDuration: '600ms' }}></div>
                <div className="w-1 bg-purple-600 rounded-full animate-pulse" style={{ height: '24px', animationDelay: '300ms', animationDuration: '600ms' }}></div>
                <div className="w-1 bg-purple-600 rounded-full animate-pulse" style={{ height: '14px', animationDelay: '400ms', animationDuration: '600ms' }}></div>
              </div>
            </div>
          </button>
        </div>
        
        {/* Active Order Tracking Widget - Expandable */}
        {activeOrder && isOrderWidgetVisible && (
          <div className="mb-6">
            <div className="bg-white border-2 border-purple-300 rounded-2xl overflow-hidden shadow-lg">
              {/* Collapsed View - Always Visible */}
              <button
                onClick={() => {
                  const widget = document.getElementById('order-widget-expanded');
                  if (widget) {
                    widget.classList.toggle('hidden');
                  }
                }}
                className="w-full px-5 py-4 flex items-center justify-between min-h-[72px] hover:bg-purple-50 transition-all active:bg-purple-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-gray-600">{t('activeOrder')}</p>
                    <p className="text-lg text-gray-900">
                      {activeOrder.restaurantName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-700 text-sm">{t('tapToExpand')}</span>
                    <span className="text-xl">▼</span>
                  </div>
                </div>
              </button>
              
              {/* Expanded View - Hidden by default */}
              <div id="order-widget-expanded" className="hidden border-t-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="px-5 py-5 space-y-4">
                  {/* Order Status */}
                  <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">📦</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{t('orderStatus')}</p>
                        <p className="text-xl text-purple-700">{activeOrder.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⏱️</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{t('estimatedTime')}</p>
                        <p className="text-xl text-gray-900">{activeOrder.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order ID */}
                  <div className="bg-white rounded-xl px-4 py-3 border-2 border-gray-200">
                    <p className="text-sm text-gray-600">{t('orderId')}</p>
                    <p className="text-lg text-gray-900">#{activeOrder.orderId}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={onTrackOrder}
                      className="flex-1 min-h-[56px] bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="text-2xl">🗺️</span>
                      <span className="text-lg">{t('trackLive')}</span>
                    </button>
                    
                    <button
                      onClick={() => setIsOrderWidgetVisible(false)}
                      className="min-w-[56px] min-h-[56px] bg-gray-200 hover:bg-gray-300 active:bg-gray-300 text-gray-700 rounded-xl transition-all flex items-center justify-center"
                      aria-label="Hide widget"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('orderProgress')}</span>
                      <span className="text-sm text-purple-700">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-full rounded-full transition-all" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Categories */}
        <section className="mb-8" data-tutorial-id="categories">
          <h2 className="text-gray-900 text-xl mb-4">{t('browseByCategory')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={onNavigateToRestaurants}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-700 min-h-[140px]"
              >
                <div className="relative h-24 w-full">
                  <img
                    src={category.image}
                    alt={t(category.name as any)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
                </div>
                <div className="p-4">
                  <span className="text-lg text-gray-900 font-medium">{t(category.name as any)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
        
        {/* Featured Restaurants */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 text-xl">{t('featuredRestaurants')}</h2>
            <button 
              onClick={onNavigateToRestaurants}
              className="text-purple-700 underline"
            >
              {t('seeAll')}
            </button>
          </div>
          
          <div className="space-y-4" data-tutorial-id="restaurants">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.nameKey}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => onNavigateToMenu && onNavigateToMenu(restaurant.id)}
                  className="w-full text-left"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.nameKey}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl text-gray-900">{t(restaurant.nameKey)}</h3>
                      {restaurant.discount && (
                        <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg whitespace-nowrap ml-2">
                          {restaurant.discount}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-2">
                        📍 {restaurant.distance}
                      </span>
                      <span className="flex items-center gap-2">
                        🕒 {restaurant.time}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-2 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button 
            className="flex flex-col items-center gap-1 min-w-[56px] py-2"
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs text-purple-700">{t('home')}</span>
          </button>
          
          <button 
            onClick={onNavigateToSearch}
            className="flex flex-col items-center gap-1 min-w-[56px] py-2"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-xs text-gray-600">{t('search')}</span>
          </button>
          
          <button 
            onClick={onNavigateToMultiCart}
            className="flex flex-col items-center gap-1 min-w-[56px] py-2 relative"
          >
            <span className="text-2xl">🛍️</span>
            <span className="text-xs text-gray-600">{t('carts')}</span>
            {carts.length > 0 && (
              <span className="absolute -top-1 right-1 w-5 h-5 bg-purple-700 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {carts.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={onNavigateToRewards}
            className="flex flex-col items-center gap-1 min-w-[56px] py-2"
          >
            <span className="text-2xl">🎁</span>
            <span className="text-xs text-gray-600">{t('rewards')}</span>
          </button>
          
          <button 
            onClick={onNavigateToProfile}
            className="flex flex-col items-center gap-1 min-w-[56px] py-2"
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs text-gray-600">{t('profile')}</span>
          </button>
        </div>
      </nav>

      {/* Voice Listening Modal */}
      {isListening && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            {/* Listening State */}
            {listeningState === 'listening' && (
              <div className="flex flex-col items-center">
                {/* Huge Pulsing Microphone */}
                <div className="relative mb-8">
                  {/* Giant Ripple Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-purple-300 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-52 h-52 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-purple-500 rounded-full animate-ping opacity-25" style={{ animationDuration: '1.5s' }}></div>
                  </div>
                  
                  {/* Giant Microphone */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                    <span className="text-7xl">🎙️</span>
                  </div>
                </div>
                
                <h3 className="text-3xl text-gray-900 mb-4 text-center">👂 {t('listening')}</h3>
                <p className="text-xl text-gray-600 text-center mb-6">{t('sayWhatYouWant')}</p>
                
                {/* Sound Wave Visualizer - BIGGER */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '24px', animationDelay: '0ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '40px', animationDelay: '100ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '32px', animationDelay: '200ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '48px', animationDelay: '300ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '36px', animationDelay: '400ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '44px', animationDelay: '500ms', animationDuration: '500ms' }}></div>
                  <div className="w-2 bg-purple-600 rounded-full animate-pulse" style={{ height: '28px', animationDelay: '600ms', animationDuration: '500ms' }}></div>
                </div>
                
                <p className="text-gray-600 text-center">{t('speakClearly')}</p>
              </div>
            )}
            
            {/* Understanding State */}
            {listeningState === 'understanding' && (
              <div className="flex flex-col items-center">
                {/* Thinking Brain Icon */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                    <span className="text-7xl">🧠</span>
                  </div>
                  {/* Sparkles around brain */}
                  <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
                  <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</div>
                </div>
                
                <h3 className="text-3xl text-gray-900 mb-4 text-center">🤔 {t('understanding')}</h3>
                
                {/* Show what was heard */}
                <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-6 mb-6 w-full">
                  <p className="text-sm text-purple-700 mb-2 text-center">{t('youSaid')}</p>
                  <p className="text-2xl text-gray-900 text-center">"{recognizedText}"</p>
                </div>
                
                {/* Loading dots */}
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                
                <p className="text-gray-600 text-center">{t('findingBestMatch')}</p>
              </div>
            )}
            
            {/* Opening Restaurant State */}
            {listeningState === 'opening' && (
              <div className="flex flex-col items-center">
                {/* Success Checkmark */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-green-300 rounded-full animate-ping opacity-30"></div>
                  </div>
                  
                  <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <span className="text-7xl">✅</span>
                  </div>
                </div>
                
                <h3 className="text-3xl text-gray-900 mb-4 text-center">🎉 Got it!</h3>
                
                {/* Restaurant Info */}
                <div className="bg-green-100 border-2 border-green-400 rounded-2xl p-6 mb-6 w-full">
                  <p className="text-xl text-gray-900 text-center mb-2">Opening</p>
                  <p className="text-3xl text-green-700 text-center">🏪 Kolachi Restaurant</p>
                </div>
                
                <p className="text-gray-600 text-center text-xl">Taking you there now...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}