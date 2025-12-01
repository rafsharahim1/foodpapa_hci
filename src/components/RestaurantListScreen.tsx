import { AccessibleBackButton } from './AccessibleBackButton';
import { ScrollableFilters } from './ScrollableFilters';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface RestaurantListScreenProps {
  onSelectRestaurant: (restaurantId: string) => void;
  onBack: () => void;
}

export function RestaurantListScreen({ onSelectRestaurant, onBack }: RestaurantListScreenProps) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: t('viewAll'), active: activeFilter === 'all' },
    { id: 'deals', label: t('offers'), active: activeFilter === 'deals' },
    { id: 'fast', label: t('fastDelivery'), active: activeFilter === 'fast' },
    { id: 'rated', label: t('topRated'), active: activeFilter === 'rated' },
    { id: 'newTag', label: t('newTag'), active: activeFilter === 'new' },
    { id: 'veg', label: t('vegetarian'), active: activeFilter === 'veg' }
  ];

  const restaurants = [
    {
      id: 1,
      nameKey: 'kolachiRestaurant',
      image: 'https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('pakistani')}, ${t('bbq')}`,
      distance: '2.1',
      time: '25-35',
      discount: '15',
      rating: '4.5',
      status: 'top-rated'
    },
    {
      id: 2,
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('bbq')}, ${t('karahi')}, ${t('desi')}`,
      distance: '3.5',
      time: '30-40',
      discount: '20',
      rating: '4.7',
      status: 'top-rated'
    },
    {
      id: 3,
      nameKey: 'studentBiryani',
      image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('biryani')}, ${t('fastFood')}`,
      distance: '1.2',
      time: '15-25',
      discount: null,
      rating: '4.3',
      status: 'fast-delivery'
    },
    {
      id: 4,
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1750190624513-020c9df74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWhhcmklMjBiZWVmfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('nihari')}, ${t('pakistani')}`,
      distance: '2.8',
      time: '25-35',
      discount: '10',
      rating: '4.6',
      status: 'top-rated'
    },
    {
      id: 5,
      nameKey: 'burgerKing',
      image: 'https://images.unsplash.com/photo-1660262849063-63c52a1fa2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrYWJhYnxlbnwxfHx8fDE3NjI1OTIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('fastFood')}, ${t('burgers')}`,
      distance: '1.5',
      time: '15-20',
      discount: null,
      rating: '4.2',
      status: 'fast-delivery'
    },
    {
      id: 6,
      nameKey: 'spiceParadise',
      image: 'https://images.unsplash.com/photo-1603073960765-e2b19d370c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBmb29kfGVufDF8fHx8MTc2MjU5MjM5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('chinese')}, ${t('desi')}`,
      distance: '3.2',
      time: '30-40',
      discount: '25',
      rating: '4.8',
      status: 'top-rated'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <AccessibleBackButton onClick={onBack} />
          <h1 className="text-gray-900 text-2xl">{t('restaurants')}</h1>
        </div>

        {/* Filters */}
        <ScrollableFilters 
          filters={filters}
          onFilterChange={(filterId) => setActiveFilter(filterId)}
        />
      </div>

      {/* Restaurant List */}
      <main className="px-6 py-6 space-y-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <button
              onClick={() => onSelectRestaurant(restaurant.id.toString())}
              className="w-full text-left"
            >
              {/* Restaurant Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={restaurant.image}
                  alt={restaurant.nameKey}
                  className="w-full h-full object-cover"
                />
                {restaurant.discount && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg">
                    {restaurant.discount}% {t('off')}
                  </div>
                )}
              </div>

              {/* Restaurant Info */}
              <div className="p-4">
                <h3 className="text-xl text-gray-900 mb-2">{t(restaurant.nameKey)}</h3>
                <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>

                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <span aria-hidden="true">📍</span>
                    <span>{restaurant.distance} {t('km')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span aria-hidden="true">⏰</span>
                    <span>{restaurant.time} {t('min')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span aria-hidden="true">⭐</span>
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}