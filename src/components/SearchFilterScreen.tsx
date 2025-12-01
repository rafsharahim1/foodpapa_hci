import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { ScrollableFilters } from './ScrollableFilters';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface SearchFilterScreenProps {
  onBack: () => void;
  onSelectRestaurant: () => void;
}

export function SearchFilterScreen({ onBack, onSelectRestaurant }: SearchFilterScreenProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [dealsOnly, setDealsOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const areas = [
    { key: 'allAreas', value: 'all' },
    { key: 'gulshanEIqbal', value: 'gulshan-e-iqbal' },
    { key: 'clifton', value: 'clifton' },
    { key: 'dhaPhase5', value: 'dha-phase-5' },
    { key: 'saddar', value: 'saddar' }
  ];
  
  const filterOptions = [
    { key: 'fastDelivery', value: 'Fast Delivery' },
    { key: 'topRated', value: 'Top Rated' },
    { key: 'new', value: 'New' },
    { key: 'vegetarian', value: 'Vegetarian' }
  ];

  const toggleFilter = (filterValue: string) => {
    if (activeFilters.includes(filterValue)) {
      setActiveFilters(activeFilters.filter(f => f !== filterValue));
    } else {
      setActiveFilters([...activeFilters, filterValue]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setDealsOnly(false);
    setSelectedArea('all');
    setSearchQuery('');
  };

  const filterChips = filterOptions.map(filter => ({
    id: filter.value.toLowerCase().replace(' ', '-'),
    label: activeFilters.includes(filter.value) ? `${t(filter.key as any)} ✕` : t(filter.key as any),
    active: activeFilters.includes(filter.value)
  }));

  const searchResults = [
    {
      id: 1,
      nameKey: 'kolachiRestaurant',
      image: 'https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('pakistani')}, ${t('bbq')}`,
      distance: '2.1',
      area: t('gulshanEIqbal'),
      discount: '15% ' + t('off'),
      rating: '4.5'
    },
    {
      id: 2,
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('bbq')}, ${t('karahi')}, ${t('desi')}`,
      distance: '3.5',
      area: t('clifton'),
      discount: '20% ' + t('off'),
      rating: '4.7'
    },
    {
      id: 3,
      nameKey: 'studentBiryani',
      image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('biryani')}, ${t('fastFood')}`,
      distance: '1.2',
      area: t('gulshanEIqbal'),
      discount: null,
      rating: '4.3'
    },
    {
      id: 4,
      nameKey: 'javedNihari',
      image: 'https://images.unsplash.com/photo-1750190624513-020c9df74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWhhcmklMjBiZWVmfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('nihari')}, ${t('pakistani')}`,
      distance: '2.8',
      area: t('saddar'),
      discount: '10% ' + t('off'),
      rating: '4.6'
    },
    {
      id: 5,
      nameKey: 'burgerKing',
      image: 'https://images.unsplash.com/photo-1660262849063-63c52a1fa2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrYWJhYnxlbnwxfHx8fDE3NjI1OTIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('fastFood')}, ${t('burgers')}`,
      distance: '1.5',
      area: t('dhaPhase5'),
      discount: null,
      rating: '4.2'
    },
    {
      id: 6,
      nameKey: 'spiceParadise',
      image: 'https://images.unsplash.com/photo-1603073960765-e2b19d370c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBmb29kfGVufDF8fHx8MTc2MjU5MjM5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('chinese')}, ${t('desi')}`,
      distance: '3.2',
      area: t('clifton'),
      discount: '25% ' + t('off'),
      rating: '4.8'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
          <AccessibleBackButton onClick={onBack} />
          <h1 className="text-gray-900 text-2xl">{t('searchAndFilter')}</h1>
        </div>

        {/* Search Input with Voice */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus-within:border-purple-700">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchFoodOrRestaurant')}
              className="flex-1 bg-transparent text-lg outline-none"
            />
          </div>
          
          <button className="min-w-[56px] min-h-[56px] bg-purple-700 text-white rounded-xl flex items-center justify-center">
            <span className="text-2xl">🎙️</span>
          </button>
        </div>

        {/* Area Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t('searchByArea')}</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700 bg-white"
          >
            {areas.map((area) => (
              <option key={area.value} value={area.value}>
                {t(area.key as any)}
              </option>
            ))}
          </select>
        </div>

        {/* Deals Toggle */}
        <button
          onClick={() => setDealsOnly(!dealsOnly)}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
            dealsOnly ? 'border-green-600 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💸</span>
            <span className="text-lg text-gray-900">{t('showDealsOnly')}</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${
            dealsOnly ? 'bg-green-600' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-all mt-0.5 ${
              dealsOnly ? 'ml-6' : 'ml-0.5'
            }`}></div>
          </div>
        </button>
      </header>

      {/* Filter Chips */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-[240px] z-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-gray-700">{t('filters')}</span>
          {activeFilters.length > 0 && (
            <button 
              onClick={clearFilters}
              className="text-red-600 underline text-sm"
            >
              {t('clearAll')}
            </button>
          )}
        </div>
        
        <ScrollableFilters 
          filters={filterChips}
          onFilterClick={(id) => {
            const filter = filterOptions.find(f => f.value.toLowerCase().replace(' ', '-') === id);
            if (filter) toggleFilter(filter.value);
          }}
        />
      </div>

      {/* Results */}
      <main className="px-6 py-6">
        {/* Voice Feedback */}
        {searchQuery && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-900">
              🔊 {t('showing')} {searchResults.length} {searchQuery} {searchResults.length !== 1 ? t('restaurants') : t('restaurant')} {selectedArea === 'all' ? t('inAllAreas') : areas.find(a => a.value === selectedArea) ? t(areas.find(a => a.value === selectedArea)!.key as any) : selectedArea}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {searchResults.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={onSelectRestaurant}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all text-left"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.nameKey}
                  className="w-full h-48 object-cover"
                />
                {restaurant.discount && (
                  <span className="absolute top-3 right-3 bg-green-600 text-white px-4 py-2 rounded-lg text-lg">
                    {restaurant.discount}
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl text-gray-900 mb-2">{t(restaurant.nameKey as any)}</h3>
                <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">📍 {restaurant.distance} km</span>
                  <span className="flex items-center gap-2">📍 {restaurant.area}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-gray-900 text-xl mb-2">{t('noRestaurantsFound')}</h3>
            <p className="text-gray-600 mb-6">{t('tryAdjustingFilters')}</p>
            <AccessibleButton variant="outlined" onClick={clearFilters}>
              {t('clearFilters')}
            </AccessibleButton>
          </div>
        )}
      </main>
    </div>
  );
}