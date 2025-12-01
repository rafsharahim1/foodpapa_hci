import { AccessibleButton } from './AccessibleButton';
import { ShoppingCartIcon } from './Icons';
import { MascotIcon } from './MascotIcon';
import { BottomCartBar } from './BottomCartBar';
import { useState, useEffect } from 'react';
import { useTutorial } from '../context/TutorialContext';
import { TutorialTooltip } from './TutorialTooltip';
import { LanguageToggle } from './LanguageToggle';
import { VoiceGuide } from './VoiceGuide';

interface HomeScreenProps {
  onNavigateToRestaurants: () => void;
  onNavigateToCart: (restaurantId: string) => void;
  carts?: Array<{
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    itemCount: number;
    totalPrice: string;
  }>;
}

export function HomeScreen({ onNavigateToRestaurants, onNavigateToCart, carts = [] }: HomeScreenProps) {
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const { setCurrentScreen, isTutorialEnabled, getCurrentStepForScreen } = useTutorial();
  
  useEffect(() => {
    setCurrentScreen('home');
  }, [setCurrentScreen]);
  
  const currentTutorialStep = getCurrentStepForScreen();
  
  const handleRemoveCart = (restaurantId: string) => {
    // This would be handled by the parent component's state management
    console.log('Remove cart:', restaurantId);
  };
  
  const categories = [
    { id: 'biryani', name: 'Biryani', emoji: '🍛' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'burger', name: 'Burgers', emoji: '🍔' },
    { id: 'desserts', name: 'Desserts', emoji: '🍨' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <MascotIcon className="h-12 w-12" />
          
          <div className="flex items-center gap-3">
            {/* Language Toggle with Tutorial */}
            <div id="language-toggle" className="relative">
              <LanguageToggle />
            </div>
            
            {/* Voice Guide Toggle with Tutorial */}
            <div id="voice-guide" className="relative">
              <VoiceGuide text="">
                <button className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <span className="text-2xl">🔊</span>
                </button>
              </VoiceGuide>
            </div>
          </div>
          
          {/* Cart Icon */}
          {carts.length > 0 && (
            <button className="relative p-2">
              <ShoppingCartIcon className="w-8 h-8 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">
                {carts.reduce((total, cart) => total + cart.itemCount, 0)}
              </span>
            </button>
          )}
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
            <span className="text-lg">🚚 Delivery</span>
          </button>
          
          <button
            onClick={() => setDeliveryMode('pickup')}
            className={`flex-1 min-h-[56px] rounded-xl transition-all ${
              deliveryMode === 'pickup'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-lg">🏪 Pickup</span>
          </button>
        </div>
        
        {/* Location Bar */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Delivery Location</label>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200">
            <span className="text-2xl">📍</span>
            <select className="flex-1 bg-transparent text-lg outline-none">
              <option>123 Main Street, Downtown</option>
              <option>456 Oak Avenue, Uptown</option>
            </select>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-2 relative" id="search-button">
          <label className="block text-gray-700 mb-2">Search for Food</label>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search by restaurant or food item"
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-600"
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Categories */}
        <section className="mb-8 relative" id="categories">
          <h2 className="text-gray-900 text-xl mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={onNavigateToRestaurants}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all min-h-[100px] flex flex-col items-center justify-center gap-3"
              >
                <span className="text-4xl">{category.emoji}</span>
                <span className="text-lg text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </section>
        
        {/* Deals Section */}
        <section className="relative" id="restaurants">
          <h2 className="text-gray-900 text-xl mb-4">Deals Near You</h2>
          <div className="space-y-4">
            <button
              onClick={onNavigateToRestaurants}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1758939560393-4b7cba143cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGJpcnlhbml8ZW58MXx8fHwxNzYyNDE5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl text-gray-900">Spice Paradise</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">30% OFF</span>
                </div>
                <p className="text-gray-600">Indian Cuisine • 2.5 km</p>
                <p className="text-gray-600">Delivery: 25-35 min</p>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Cart Bar */}
      <BottomCartBar 
        carts={carts}
        onCartClick={onNavigateToCart}
        onRemoveCart={handleRemoveCart}
      />
      
      {/* Tutorial Tooltip - Single instance that handles all targets */}
      {isTutorialEnabled && <TutorialTooltip />}
    </div>
  );
}