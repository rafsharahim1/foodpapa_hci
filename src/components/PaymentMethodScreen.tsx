import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useState } from 'react';

interface PaymentMethodScreenProps {
  onBack: () => void;
}

export function PaymentMethodScreen({ onBack }: PaymentMethodScreenProps) {
  const { t } = useTranslation();
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'Cash',
      icon: '💵',
      description: t('cashOnDelivery'),
      isDefault: true
    },
    {
      id: 2,
      type: 'Card',
      icon: '💳',
      description: '**** **** **** 4532',
      isDefault: false,
      cardType: 'Visa'
    },
    {
      id: 3,
      type: 'JazzCash',
      icon: '📱',
      description: '+92 300 1234567',
      isDefault: false
    },
    {
      id: 4,
      type: 'EasyPaisa',
      icon: '💰',
      description: '+92 321 7654321',
      isDefault: false
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('paymentMethod')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Add New Payment Method Button */}
        <AccessibleButton
          variant="primary"
          fullWidth
          icon={<span className="text-2xl">➕</span>}
          className="mb-6"
        >
          {t('addNewCard')}
        </AccessibleButton>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                method.isDefault ? 'border-purple-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {method.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl text-gray-900">{method.type}</p>
                    {method.isDefault && (
                      <span className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full">
                        {t('default')}
                      </span>
                    )}
                    {method.cardType && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {method.cardType}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-lg mb-4">{method.description}</p>

                  <div className="flex gap-3">
                    {!method.isDefault && (
                      <button className="flex-1 min-h-[48px] bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all">
                        {t('setAsDefault')}
                      </button>
                    )}
                    <button className="flex-1 min-h-[48px] bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                      {method.isDefault ? t('edit') : t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Security Info */}
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-2xl p-5">
          <p className="text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>{t('securePayments')}</span>
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('paymentSecurityInfo')}
          </p>
        </div>

        {/* Accepted Payment Methods */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-gray-900 text-lg mb-4">{t('weAccept')}</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">💵</span>
              <span className="text-xs text-gray-600">{t('cash')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">💳</span>
              <span className="text-xs text-gray-600">Visa/Master</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">📱</span>
              <span className="text-xs text-gray-600">JazzCash</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">💰</span>
              <span className="text-xs text-gray-600">EasyPaisa</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
