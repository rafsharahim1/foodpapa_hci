import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';

interface ProfileScreenProps {
  onNavigateToOrders: () => void;
  onNavigateToRewards: () => void;
  onNavigateToSettings: () => void;
  onNavigateToHelp: () => void;
  onBack: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  isLoggedIn: boolean;
  userName: string;
  userPhone: string;
  onNavigateToSavedPlaces?: () => void;
  onNavigateToPayment?: () => void;
  onNavigateToLanguage?: () => void;
}

export function ProfileScreen({ 
  onNavigateToOrders, 
  onNavigateToRewards,
  onNavigateToSettings,
  onNavigateToHelp,
  onBack,
  onSignIn,
  onSignOut,
  isLoggedIn,
  userName,
  userPhone,
  onNavigateToSavedPlaces,
  onNavigateToPayment,
  onNavigateToLanguage
}: ProfileScreenProps) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-purple-600 to-purple-800 text-white px-6 py-8" role="banner">
        <AccessibleBackButton onClick={onBack} label={t('home')} variant="light" />
        
        <div className="flex items-center gap-4 mt-4">
          <div 
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl"
            role="img"
            aria-label={isLoggedIn ? "User profile picture" : "Guest user icon"}
          >
            <span aria-hidden="true">{isLoggedIn ? '👨' : '👤'}</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{userName}</h1>
            {!isLoggedIn ? (
              <button 
                onClick={onSignIn}
                className="text-purple-100 underline text-lg min-h-[44px]"
                aria-label="Sign in to save your data and preferences"
              >
                {t('signInWithPhone')}
              </button>
            ) : (
              <p className="text-purple-100 text-lg" aria-label={`Phone number: +92 ${userPhone}`}>
                +92 {userPhone}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 py-6 -mt-6" role="main">
        {/* Quick Stats */}
        <section 
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          aria-label="Account statistics"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4">
              <span className="text-4xl block mb-2" aria-hidden="true">📦</span>
              <p className="text-3xl text-purple-700 mb-1" aria-label="3 total orders">3</p>
              <p className="text-gray-600">{t('pastOrders')}</p>
            </div>
            
            <div className="p-4">
              <span className="text-4xl block mb-2" aria-hidden="true">🎁</span>
              <p className="text-3xl text-purple-700 mb-1" aria-label="850 reward points">850</p>
              <p className="text-gray-600">{t('points')}</p>
            </div>
          </div>
        </section>

        {/* Main Menu Options */}
        <nav aria-label="Profile menu options">
          <div className="space-y-4">
            <button
              onClick={onNavigateToOrders}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              aria-label="My Orders - View past and current orders"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0" aria-hidden="true">
                📦
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-xl text-gray-900 mb-1">{t('orderHistory')}</p>
                <p className="text-gray-600">{t('pastOrders')}</p>
              </div>
              
              <span className="text-3xl text-gray-600" aria-hidden="true">→</span>
            </button>

            <button
              onClick={onNavigateToRewards}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              aria-label="My Rewards - 850 points available"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0" aria-hidden="true">
                🎁
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-xl text-gray-900 mb-1">{t('yourRewards')}</p>
                <p className="text-gray-600">850 {t('points')}</p>
              </div>
              
              <span className="text-3xl text-gray-600" aria-hidden="true">→</span>
            </button>

            <button
              onClick={onNavigateToSettings}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              aria-label="Settings - Adjust text size, colors, and accessibility options"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0" aria-hidden="true">
                ⚙️
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-xl text-gray-900 mb-1">{t('settings')}</p>
                <p className="text-gray-600">{t('textSize')}, {t('colorMode')}</p>
              </div>
              
              <span className="text-3xl text-gray-600" aria-hidden="true">→</span>
            </button>

            <button
              onClick={onNavigateToHelp}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              aria-label="Help and Support - FAQs, contact us, and feedback"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0" aria-hidden="true">
                💬
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-xl text-gray-900 mb-1">{t('help')}</p>
                <p className="text-gray-600">{t('liveChat')}, {t('faq')}</p>
              </div>
              
              <span className="text-3xl text-gray-600" aria-hidden="true">→</span>
            </button>
          </div>
        </nav>

        {/* Additional Options */}
        <nav aria-label="Additional account options" className="mt-8">
          <div className="space-y-4">
            <button 
              className="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between"
              aria-label="Manage saved addresses"
              onClick={onNavigateToSavedPlaces}
            >
              <span className="text-lg text-gray-900">{t('savedPlaces')}</span>
              <span className="text-2xl text-gray-600" aria-hidden="true">→</span>
            </button>

            <button 
              className="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between"
              aria-label="Manage payment methods"
              onClick={onNavigateToPayment}
            >
              <span className="text-lg text-gray-900">{t('paymentMethod')}</span>
              <span className="text-2xl text-gray-600" aria-hidden="true">→</span>
            </button>

            <button 
              className="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between"
              aria-label="Change language settings"
              onClick={onNavigateToLanguage}
            >
              <span className="text-lg text-gray-900">{t('language')}</span>
              <span className="text-2xl text-gray-600" aria-hidden="true">→</span>
            </button>
          </div>
        </nav>

        {/* Sign Out Button - Only show when logged in */}
        {isLoggedIn && (
          <div className="mt-8">
            <AccessibleButton
              variant="outlined"
              fullWidth
              onClick={onSignOut}
              icon={<span className="text-2xl" aria-hidden="true">🚪</span>}
              ariaLabel="Sign out of your account"
            >
              {t('logout')}
            </AccessibleButton>
          </div>
        )}

        {/* Version Info */}
        <div className="mt-8 text-center pb-6" role="contentinfo">
          <p className="text-gray-600">FoodPapa Version 2.0</p>
          <p className="text-gray-600">Accessibility-First Edition</p>
        </div>
      </main>
    </div>
  );
}