import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessibility } from '../context/AccessibilityContext';

interface OrderTrackingScreenProps {
  onBack: () => void;
  onViewRewards: () => void;
}

export function OrderTrackingScreen({ onBack, onViewRewards }: OrderTrackingScreenProps) {
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  
  const orderSteps = [
    { id: 1, label: t('orderPlaced'), time: '2:30 PM', completed: true },
    { id: 2, label: t('preparing'), time: '2:35 PM', completed: true },
    { id: 3, label: t('onTheWay'), time: '2:55 PM', completed: true },
    { id: 4, label: t('delivered'), time: '3:15 PM', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('home')} />
          <h1 className="text-gray-900 text-2xl">{t('trackOrder')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">✓</span>
          </div>
          
          <h2 className="text-gray-900 text-2xl mb-3">{t('orderConfirmed')}</h2>
          
          {/* Restaurant Name - Prominent Display */}
          <div className="bg-purple-700 text-white rounded-2xl p-5 mb-4">
            <p className="text-sm mb-1 text-purple-200">{t('deliveringTo')}</p>
            <p className="text-2xl">🍕 {t('pizzaHeaven')}</p>
          </div>

          <p className="text-gray-600 text-xl mb-4">
            {t('onTheWay')}
          </p>

          <div className="bg-purple-50 rounded-2xl p-4 mb-4">
            <p className="text-purple-900 text-lg">
              {t('orderId')} #12345
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-green-800 text-xl">
              🕒 {t('estimatedTime')}: 25-35 {t('min')}
            </p>
          </div>
        </div>

        {/* Live Map */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 text-xl mb-4">{t('trackLive')}</h3>
          
          <div className="bg-gray-100 rounded-xl h-64 mb-4 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-3 block">🗺️</span>
              <p className="text-gray-600 text-lg">2.3 {t('km')}</p>
            </div>
          </div>

          {/* Voice Track Button */}
          <AccessibleButton
            variant="secondary"
            fullWidth
            icon={<span className="text-2xl">🔊</span>}
          >
            {t('trackOrder')}
          </AccessibleButton>
        </div>

        {/* Driver Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 text-xl mb-4">{t('delivery')}</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
              👨
            </div>
            
            <div className="flex-1">
              <p className="text-gray-900 text-xl">Ahmed Khan</p>
              <p className="text-gray-600">⭐ 4.8 {t('rating')}</p>
            </div>
          </div>

          <AccessibleButton
            variant="outlined"
            fullWidth
            icon={<span className="text-2xl">📞</span>}
          >
            {t('contactUs')}
          </AccessibleButton>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 text-xl mb-6">{t('orderProgress')}</h3>
          
          <div className="space-y-6">
            {orderSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Progress Circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    step.completed 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? '✓' : '○'}
                  </div>
                  
                  {index < orderSteps.length - 1 && (
                    <div className={`w-1 h-12 ${
                      step.completed ? 'bg-green-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 pb-6">
                  <p className={`text-xl mb-1 ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-gray-600">{step.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Voice Narration */}
          <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <p className="text-purple-900 text-center">
              🔊 {t('preparing')}
            </p>
          </div>
        </div>

        {/* Rewards Banner */}
        <button
          onClick={onViewRewards}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-6 text-left mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl mb-2">🎉 {t('yourRewards')}!</p>
              <p className="text-purple-100 text-lg">+200 {t('points')}</p>
            </div>
            <span className="text-3xl">→</span>
          </div>
        </button>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-900 text-xl mb-4">{t('orderSummary')}</h3>
          
          <div className="space-y-3 text-lg mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">2 {t('items')}</span>
              <span className="text-gray-900">₨848</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('delivery')}</span>
              <span className="text-gray-900">₨40</span>
            </div>
            
            <div className="flex justify-between text-green-600">
              <span>{t('discount')}</span>
              <span>−₨150</span>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex justify-between text-2xl">
                <span className="text-gray-900">{t('total')}</span>
                <span className="text-purple-700">₨738</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}