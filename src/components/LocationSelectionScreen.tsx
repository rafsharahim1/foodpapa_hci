import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { AccessibleButton } from './AccessibleButton';

interface LocationSelectionScreenProps {
  onConfirm: (location: string) => void;
}

export function LocationSelectionScreen({ onConfirm }: LocationSelectionScreenProps) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<'gps' | 'manual' | 'saved'>('gps');
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [address, setAddress] = useState('');
  
  // Map background image for GPS mode
  const mapImage = 'https://images.unsplash.com/photo-1754299394817-ff347e940645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMHBpbnxlbnwxfHx8fDE3NjM0NDI1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

  // Sample areas for manual entry
  const areas = [
    'Gulshan-e-Iqbal',
    'Clifton',
    'DHA',
    'PECHS',
    'Nazimabad',
    'Saddar',
    'Korangi',
    'Malir',
  ];

  // Sample saved places
  const savedPlaces = [
    { id: 1, icon: '🏠', name: t('home'), address: '123 Main Street, Gulshan-e-Iqbal' },
    { id: 2, icon: '💼', name: t('work'), address: '456 Business Avenue, Clifton' },
  ];

  const handleConfirm = () => {
    if (selectedMode === 'gps') {
      onConfirm('123 Main Street, Gulshan-e-Iqbal');
    } else if (selectedMode === 'manual') {
      onConfirm(`${address}, ${selectedArea}`);
    } else {
      onConfirm(savedPlaces[0].address);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 py-8">
      {/* Language Toggle - Top Right */}
      <div className="flex justify-end mb-4">
        <LanguageToggle variant="pill" />
      </div>
      
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto" role="main">
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-gray-900 text-2xl mb-2">{t('setYourLocation')}</h1>
          <p className="text-gray-600">
            {t('needAddressForRestaurants')}
          </p>
        </div>

        <main className="px-6 py-6 pb-32">
          {/* Mode Selection */}
          <div className="space-y-4 mb-8">
            {/* GPS Option */}
            <button
              onClick={() => {
                setSelectedMode('gps');
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                selectedMode === 'gps'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">📍</span>
                <div className="flex-1">
                  <p className="text-xl text-gray-900 mb-1">{t('useCurrentLocation')}</p>
                  <p className="text-gray-600">{t('automaticDetection')}</p>
                </div>
                {selectedMode === 'gps' && (
                  <span className="text-2xl text-purple-700">✓</span>
                )}
              </div>
            </button>

            {/* Manual Entry */}
            <button
              onClick={() => {
                setSelectedMode('manual');
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                selectedMode === 'manual'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">✏️</span>
                <div className="flex-1">
                  <p className="text-xl text-gray-900 mb-1">{t('typeAddressManually')}</p>
                  <p className="text-gray-600">{t('enterYourDeliveryAddress')}</p>
                </div>
                {selectedMode === 'manual' && (
                  <span className="text-2xl text-purple-700">✓</span>
                )}
              </div>
            </button>

            {/* Saved Places */}
            <button
              onClick={() => {
                setSelectedMode('saved');
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                selectedMode === 'saved'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">⭐</span>
                <div className="flex-1">
                  <p className="text-xl text-gray-900 mb-1">{t('chooseFromSavedPlaces')}</p>
                  <p className="text-gray-600">{t('selectHomeOrWork')}</p>
                </div>
                {selectedMode === 'saved' && (
                  <span className="text-2xl text-purple-700">✓</span>
                )}
              </div>
            </button>
          </div>

          {/* Mode-Specific Content */}
          {selectedMode === 'gps' && (
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                {/* Google Maps background image */}
                <img
                  src={mapImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden="true"
                />
                
                {/* Overlay content */}
                <div className="text-center relative z-10 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl">
                  <span className="text-6xl mb-2 block">📍</span>
                  <p className="text-gray-900 font-medium">{t('detectingYourLocation')}</p>
                </div>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-800 mb-2">📍 {t('confirmLocation')}</p>
                <p className="text-gray-900">123 Main Street, Gulshan-e-Iqbal</p>
              </div>

              <AccessibleButton
                variant="success"
                fullWidth
                onClick={() => setLocationConfirmed(true)}
              >
                {t('confirmLocation')} ✓
              </AccessibleButton>
            </div>
          )}

          {selectedMode === 'manual' && (
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">{t('selectArea')}</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700 bg-white"
                  >
                    <option value="">{t('chooseYourArea')}</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">{t('streetAddress')}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('enterHouseNumber')}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
                  />
                </div>

                <AccessibleButton
                  variant="success"
                  fullWidth
                  onClick={() => setLocationConfirmed(true)}
                  disabled={!address || !selectedArea}
                >
                  {t('confirmAddress')} ✓
                </AccessibleButton>
              </div>
            </div>
          )}

          {selectedMode === 'saved' && (
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="space-y-3 mb-6">
                {savedPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => setLocationConfirmed(true)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-700 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{place.icon}</span>
                      <div className="flex-1">
                        <p className="text-lg text-gray-900">{place.name}</p>
                        <p className="text-gray-600">{place.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Feedback */}
          {locationConfirmed && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center mb-6">
              <span className="text-4xl mb-3 block">✓</span>
              <p className="text-purple-900 text-xl">{t('addressHasBeenSet')}</p>
            </div>
          )}
        </main>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg max-w-md mx-auto">
          <AccessibleButton
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={!locationConfirmed}
          >
            {t('continueToHome')}
          </AccessibleButton>
        </div>
      </main>
    </div>
  );
}
