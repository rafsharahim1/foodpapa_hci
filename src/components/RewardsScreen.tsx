import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';

interface RewardsScreenProps {
  onBack: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  const { t } = useTranslation();
  const currentPoints = 850;
  const nextTierPoints = 1000;
  const progress = (currentPoints / nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-purple-600 to-purple-800 text-white px-6 py-8">
        <AccessibleBackButton 
          onClick={onBack} 
          label={t('back')}
          variant="light"
        />
        
        <h1 className="text-3xl mb-2 mt-4">{t('yourRewards')}</h1>
        <p className="text-purple-100 text-xl">{t('points')}</p>
      </header>

      <main className="px-6 py-6 -mt-6">
        {/* Points Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">🎉</span>
            <p className="text-gray-600 text-xl mb-2">{t('points')}</p>
            <p className="text-purple-700 text-5xl mb-4">{currentPoints}</p>
            
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-purple-900 text-lg">
                = Rs. {currentPoints / 10}
              </p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{nextTierPoints} {t('points')}</span>
              <span className="text-purple-700">{nextTierPoints - currentPoints}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-800 h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <AccessibleButton
            variant="primary"
            fullWidth
          >
            {t('redeemRewards')}
          </AccessibleButton>
        </div>

        {/* How Cashback Works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            {t('howCanWeHelp')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">1️⃣</span>
              <div>
                <p className="text-gray-900 text-lg mb-1">{t('points')}</p>
                <p className="text-gray-600">5% {t('discount')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">2️⃣</span>
              <div>
                <p className="text-gray-900 text-lg mb-1">{t('points')}</p>
                <p className="text-gray-600">100 {t('points')} = Rs. 10</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">3️⃣</span>
              <div>
                <p className="text-gray-900 text-lg mb-1">{t('redeemRewards')}</p>
                <p className="text-gray-600">{t('available')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tier System */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4">{t('yourRewards')}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100">
              <span className="text-4xl">🥈</span>
              <div className="flex-1">
                <p className="text-gray-900 text-lg">Silver</p>
                <p className="text-gray-600">0-500 {t('points')} • 5%</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border-2 border-purple-300">
              <span className="text-4xl">🥇</span>
              <div className="flex-1">
                <p className="text-purple-900 text-lg">Gold</p>
                <p className="text-purple-700">501-1000 {t('points')} • 7%</p>
              </div>
              <span className="text-2xl text-purple-700">✓</span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <span className="text-4xl">💎</span>
              <div className="flex-1">
                <p className="text-gray-900 text-lg">Platinum</p>
                <p className="text-gray-600">1001+ {t('points')} • 10%</p>
              </div>
              <span className="text-gray-600">🔒</span>
            </div>
          </div>
        </div>

        {/* Recent Rewards Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4">{t('orderHistory')}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">+</span>
                <div>
                  <p className="text-gray-900 text-lg">Pizza Heaven</p>
                  <p className="text-gray-600 text-sm">2:30 PM</p>
                </div>
              </div>
              <span className="text-green-600 text-xl">+200</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">−</span>
                <div>
                  <p className="text-gray-900 text-lg">{t('discount')}</p>
                  <p className="text-gray-600 text-sm">{t('orderId')}</p>
                </div>
              </div>
              <span className="text-purple-700 text-xl">−150</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">+</span>
                <div>
                  <p className="text-gray-900 text-lg">Spice Paradise</p>
                  <p className="text-gray-600 text-sm">2 {t('time')}</p>
                </div>
              </div>
              <span className="text-green-600 text-xl">+350</span>
            </div>
          </div>
        </div>

        {/* Voice Feedback */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
          <p className="text-purple-900 text-lg">
            🔊 {currentPoints} {t('points')} = Rs. {currentPoints / 10}
          </p>
        </div>
      </main>
    </div>
  );
}
