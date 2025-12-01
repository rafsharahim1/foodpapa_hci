import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useState } from 'react';

interface SavedPlacesScreenProps {
  onBack: () => void;
}

export function SavedPlacesScreen({ onBack }: SavedPlacesScreenProps) {
  const { t } = useTranslation();
  const [savedPlaces] = useState([
    {
      id: 1,
      label: t('home'),
      address: 'Flat 303, Blue Sky Apartments, DHA Phase 5, Karachi',
      icon: '🏠',
      isPrimary: true
    },
    {
      id: 2,
      label: t('work'),
      address: 'Office 12, IT Tower, I.I. Chundrigar Road, Karachi',
      icon: '💼',
      isPrimary: false
    },
    {
      id: 3,
      label: 'Restaurant',
      address: 'Food Street, Boat Basin, Clifton, Karachi',
      icon: '📍',
      isPrimary: false
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('savedPlaces')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Add New Address Button */}
        <AccessibleButton
          variant="primary"
          fullWidth
          icon={<span className="text-2xl">➕</span>}
          className="mb-6"
        >
          {t('addNewAddress')}
        </AccessibleButton>

        {/* Saved Places List */}
        <div className="space-y-4">
          {savedPlaces.map((place) => (
            <div
              key={place.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                place.isPrimary ? 'border-purple-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {place.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl text-gray-900">{place.label}</p>
                    {place.isPrimary && (
                      <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded">
                        {t('primary')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{place.address}</p>

                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 min-h-[48px] bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all">
                      {t('edit')}
                    </button>
                    <button className="flex-1 min-h-[48px] bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Helper Text */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
          <p className="text-gray-900 mb-2">💡 {t('quickTip')}</p>
          <p className="text-gray-600 leading-relaxed">
            {t('savedPlacesHelp')}
          </p>
        </div>
      </main>
    </div>
  );
}
