import { AccessibleButton } from './AccessibleButton';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessibility } from '../context/AccessibilityContext';
import { CheckCircle, Gift } from 'lucide-react';

interface OrderSuccessScreenProps {
  onBack: () => void;
  onViewRewards: () => void;
}

export function OrderSuccessScreen({ onBack, onViewRewards }: OrderSuccessScreenProps) {
  const { t } = useTranslation();
  const { settings } = useAccessibility();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-8 py-12 ${
      settings.colorMode === 'high-contrast'
        ? 'bg-gray-900'
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      {/* Success Icon */}
      <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
        settings.colorMode === 'high-contrast'
          ? 'bg-yellow-400'
          : 'bg-green-100'
      }`}>
        <CheckCircle className={`w-20 h-20 ${
          settings.colorMode === 'high-contrast'
            ? 'text-gray-900'
            : 'text-green-600'
        }`} aria-hidden="true" />
      </div>

      {/* Success Message */}
      <h1 className={`text-3xl text-center mb-4 ${
        settings.colorMode === 'high-contrast'
          ? 'text-white'
          : 'text-gray-900'
      }`}>
        {t('orderPlacedSuccess')}!
      </h1>

      <p className={`text-xl text-center mb-8 ${
        settings.colorMode === 'high-contrast'
          ? 'text-gray-300'
          : 'text-gray-600'
      }`}>
        {t('orderConfirmationMessage')}
      </p>

      {/* Order Details Card */}
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-lg mb-8 ${
        settings.colorMode === 'high-contrast'
          ? 'bg-gray-800 border-2 border-yellow-400'
          : 'bg-white'
      }`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={settings.colorMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'}>
              {t('orderId')}
            </span>
            <span className={`${
              settings.colorMode === 'high-contrast'
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              #FP{Math.floor(Math.random() * 10000)}
            </span>
          </div>

          <div className={`h-px ${
            settings.colorMode === 'high-contrast'
              ? 'bg-gray-600'
              : 'bg-gray-200'
          }`}></div>

          <div className="flex justify-between items-center">
            <span className={settings.colorMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'}>
              {t('estimatedDelivery')}
            </span>
            <span className={`${
              settings.colorMode === 'high-contrast'
                ? 'text-yellow-400'
                : 'text-green-600'
            }`}>
              25-30 {t('minutes')}
            </span>
          </div>

          <div className={`h-px ${
            settings.colorMode === 'high-contrast'
              ? 'bg-gray-600'
              : 'bg-gray-200'
          }`}></div>

          <div className="flex justify-between items-center">
            <span className={settings.colorMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'}>
              {t('totalPaid')}
            </span>
            <span className={`text-2xl ${
              settings.colorMode === 'high-contrast'
                ? 'text-white'
                : 'text-purple-700'
            }`}>
              ₨738
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Card */}
      <div className={`w-full max-w-md rounded-2xl p-6 mb-8 ${
        settings.colorMode === 'high-contrast'
          ? 'bg-gray-800 border-2 border-yellow-400'
          : 'bg-gradient-to-r from-purple-100 to-pink-100'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <Gift className={`w-8 h-8 ${
            settings.colorMode === 'high-contrast'
              ? 'text-yellow-400'
              : 'text-purple-700'
          }`} aria-hidden="true" />
          <div>
            <h2 className={`text-xl ${
              settings.colorMode === 'high-contrast'
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              {t('rewardsEarned')}!
            </h2>
            <p className={settings.colorMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'}>
              +74 {t('points')}
            </p>
          </div>
        </div>
        
        <AccessibleButton
          variant="secondary"
          fullWidth
          icon={<Gift className="w-5 h-5" />}
          onClick={onViewRewards}
        >
          {t('viewRewards')}
        </AccessibleButton>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-4">
        <AccessibleButton
          variant="primary"
          fullWidth
          onClick={onBack}
        >
          {t('backToHome')}
        </AccessibleButton>
      </div>
    </div>
  );
}
