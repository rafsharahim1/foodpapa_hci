import { AccessibleButton } from './AccessibleButton';
import { useTranslation } from '../hooks/useTranslation';

interface OrderConfirmationScreenProps {
  onGoHome: () => void;
}

export function OrderConfirmationScreen({ onGoHome }: OrderConfirmationScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">✓</span>
          </div>
          
          <h1 className="text-gray-900 text-3xl mb-4">{t('orderConfirmed')}</h1>
          
          <p className="text-gray-600 text-xl leading-relaxed mb-6">
            {t('onTheWay')}
          </p>
          
          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{t('orderId')}</span>
                <span className="text-gray-900">#12345</span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{t('estimatedTime')}</span>
                <span className="text-gray-900">25-35 {t('min')}</span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Total Paid</span>
                <span className="text-purple-700">Rs. 738</span>
              </div>
            </div>
          </div>
          
          {/* Rewards */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl">🎉</span>
              <h2 className="text-purple-900 text-2xl">{t('yourRewards')}!</h2>
            </div>
            
            <p className="text-purple-800 text-xl">
              +200 points added to your account
            </p>
            
            <p className="text-purple-700 mt-2">
              Use points for discounts on future orders
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <AccessibleButton
            variant="success"
            fullWidth
          >
            Track My Order
          </AccessibleButton>
          
          <AccessibleButton
            variant="outlined"
            fullWidth
            onClick={onGoHome}
          >
            Order Again
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
