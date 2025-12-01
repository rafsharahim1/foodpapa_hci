import { Home, ShoppingCart, User, Gift, Bell } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface BottomNavBarProps {
  currentScreen: string;
  onNavigateToHome: () => void;
  onNavigateToCart: () => void;
  onNavigateToProfile: () => void;
  onNavigateToRewards: () => void;
  onNavigateToNotifications: () => void;
  cartCount?: number;
  notificationCount?: number;
}

export function BottomNavBar({
  currentScreen,
  onNavigateToHome,
  onNavigateToCart,
  onNavigateToProfile,
  onNavigateToRewards,
  onNavigateToNotifications,
  cartCount = 0,
  notificationCount = 0
}: BottomNavBarProps) {
  const { t } = useTranslation();
  const isActive = (screen: string) => currentScreen === screen;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-purple-700 z-50 shadow-2xl"
      role="navigation"
      aria-label={t('home')}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-3">
        {/* Home */}
        <button
          onClick={onNavigateToHome}
          className={`flex flex-col items-center justify-center min-w-[70px] min-h-[64px] rounded-xl transition-all ${
            isActive('home')
              ? 'bg-purple-700 text-white'
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}
          aria-label={t('home')}
          aria-current={isActive('home') ? 'page' : undefined}
        >
          <Home className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-xs mt-1">{t('home')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={onNavigateToCart}
          className={`flex flex-col items-center justify-center min-w-[70px] min-h-[64px] rounded-xl transition-all relative ${
            isActive('cart') || isActive('multicart')
              ? 'bg-purple-700 text-white'
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}
          aria-label={`${t('cart')}${cartCount > 0 ? ` (${cartCount} ${t('itemsInCart')})` : ''}`}
          aria-current={isActive('cart') || isActive('multicart') ? 'page' : undefined}
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
            {cartCount > 0 && (
              <div 
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full min-w-[24px] min-h-[24px] flex items-center justify-center text-xs font-bold border-2 border-white"
                aria-label={`${cartCount} ${t('itemsInCart')}`}
                role="status"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </div>
            )}
          </div>
          <span className="text-xs mt-1">{t('cart')}</span>
        </button>

        {/* Rewards */}
        <button
          onClick={onNavigateToRewards}
          className={`flex flex-col items-center justify-center min-w-[70px] min-h-[64px] rounded-xl transition-all ${
            isActive('rewards')
              ? 'bg-purple-700 text-white'
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}
          aria-label={t('rewards')}
          aria-current={isActive('rewards') ? 'page' : undefined}
        >
          <Gift className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-xs mt-1">{t('rewards')}</span>
        </button>

        {/* Notifications */}
        {onNavigateToNotifications && (
          <button
            onClick={onNavigateToNotifications}
            className={`flex flex-col items-center justify-center min-w-[70px] min-h-[64px] rounded-xl transition-all relative ${
              isActive('notifications')
                ? 'bg-purple-700 text-white'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
            }`}
            aria-label={t('notifications')}
            aria-current={isActive('notifications') ? 'page' : undefined}
          >
            <div className="relative">
              <Bell className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
              {notificationCount > 0 && (
                <div 
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full min-w-[24px] min-h-[24px] flex items-center justify-center text-xs font-bold border-2 border-white"
                  aria-label={`${notificationCount} ${t('newNotifications')}`}
                  role="status"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              )}
            </div>
            <span className="text-xs mt-1">{t('alerts')}</span>
          </button>
        )}

        {/* Profile */}
        <button
          onClick={onNavigateToProfile}
          className={`flex flex-col items-center justify-center min-w-[70px] min-h-[64px] rounded-xl transition-all ${
            isActive('profile')
              ? 'bg-purple-700 text-white'
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}
          aria-label={t('profile')}
          aria-current={isActive('profile') ? 'page' : undefined}
        >
          <User className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-xs mt-1">{t('profile')}</span>
        </button>
      </div>
    </nav>
  );
}