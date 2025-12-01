import { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { useAccessibleToast } from './AccessibleToast';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';

interface NotificationCenterProps {
  className?: string;
  onBack?: () => void;
  asFullScreen?: boolean;
}

/**
 * Notification Center Component
 * 
 * Purpose: Provides a persistent history of notifications so users
 * can review messages they may have missed.
 * 
 * Benefits for Visually Impaired:
 * - All notifications are saved and can be reviewed
 * - Screen reader announces count of unread notifications
 * 
 * Benefits for Cognitive Disabilities:
 * - Notifications don't disappear - can be read at user's pace
 * - Clear visual indicators of notification type
 * - Simple, organized list interface
 */
export function NotificationCenter({ className = '', onBack, asFullScreen = true }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [swipedNotifications, setSwipedNotifications] = useState<Set<string>>(new Set());
  const [deletingNotifications, setDeletingNotifications] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render when notifications change
  const toast = useAccessibleToast();
  const { t } = useTranslation();
  const notifications = toast.getHistory();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" aria-hidden="true" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('justNow');
    if (minutes < 60) return `${minutes}${t('minutesAgo')}`;
    if (hours < 24) return `${hours}${t('hoursAgo')}`;
    return `${days}${t('daysAgo')}`;
  };

  const handleSwipeStart = (notificationId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLElement;
    
    target.setAttribute('data-start-x', touch.clientX.toString());
    target.setAttribute('data-start-y', touch.clientY.toString());
  };

  const handleSwipeMove = (notificationId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLElement;
    const startX = parseFloat(target.getAttribute('data-start-x') || '0');
    const startY = parseFloat(target.getAttribute('data-start-y') || '0');
    
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    // Only swipe horizontally if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      target.style.transform = `translateX(${deltaX}px)`;
      target.style.transition = 'none';
      
      // Show delete indicator when swiped far enough
      if (Math.abs(deltaX) > 80) {
        setSwipedNotifications(prev => new Set(prev).add(notificationId));
      } else {
        setSwipedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    }
  };

  const handleSwipeEnd = (notificationId: string, e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    const startX = parseFloat(target.getAttribute('data-start-x') || '0');
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    
    target.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    
    // Delete if swiped more than 100px in either direction
    if (Math.abs(deltaX) > 100) {
      handleDeleteNotification(notificationId, target);
    } else {
      // Reset position
      target.style.transform = 'translateX(0)';
      setSwipedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleDeleteNotification = (notificationId: string, element?: HTMLElement) => {
    setDeletingNotifications(prev => new Set(prev).add(notificationId));
    
    // Animate out
    if (element) {
      element.style.transform = 'translateX(-100%)';
      element.style.opacity = '0';
    }
    
    // Remove from array after animation
    setTimeout(() => {
      toast.deleteNotification(notificationId);
      setDeletingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      setSwipedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      setRefreshKey(prev => prev + 1); // Force re-render
    }, 300);
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    
    // Clear all notifications
    toast.clearAllNotifications();
    setRefreshKey(prev => prev + 1); // Force re-render
    
    toast.success(t('allNotificationsCleared') || 'All notifications cleared');
  };

  // Full screen view
  if (asFullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {onBack && <AccessibleBackButton onClick={onBack} />}
            <h1 className="text-gray-900 text-2xl flex-1">{t('notifications')}</h1>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 active:bg-red-700 transition-all min-h-[44px]"
                aria-label={t('clearAllNotifications') || 'Clear all notifications'}
              >
                <Trash2 className="w-5 h-5" aria-hidden="true" />
                <span>{t('clearAll') || 'Clear All'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Notification List */}
        <div className="px-6 py-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h2 className="text-xl text-gray-900 mb-2">{t('noNotificationsYet')}</h2>
              <p className="text-gray-600">{t('notificationsDescription')}</p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {notifications.slice().reverse().map((notification, index) => (
                <li
                  key={notification.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative"
                  role="listitem"
                  onTouchStart={(e) => handleSwipeStart(notification.id, e)}
                  onTouchMove={(e) => handleSwipeMove(notification.id, e)}
                  onTouchEnd={(e) => handleSwipeEnd(notification.id, e)}
                  style={{
                    transform: 'translateX(0)',
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                  }}
                >
                  {/* Delete indicator background */}
                  <div 
                    className={`absolute inset-0 bg-red-500 flex items-center justify-end px-8 transition-opacity ${
                      swipedNotifications.has(notification.id) ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  >
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Notification content */}
                  <div className="flex gap-4 p-6 bg-white relative">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg text-gray-900 mb-1">
                        {notification.title}
                      </p>
                      {notification.description && (
                        <p className="text-gray-600 mb-3">
                          {notification.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 active:bg-red-100 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={t('deleteNotification') || 'Delete notification'}
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-red-500" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Panel view
  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all"
        aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} total)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-6 h-6" aria-hidden="true" />
        {notifications.length > 0 && (
          <div
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] min-h-[20px] flex items-center justify-center text-xs"
            role="status"
            aria-label={`${notifications.length} notifications`}
          >
            {notifications.length > 9 ? '9+' : notifications.length}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="absolute right-0 top-12 w-80 max-h-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 overflow-hidden"
            role="dialog"
            aria-label="Notification history"
            aria-modal="false"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-purple-50">
              <h2 className="text-lg">Notifications</h2>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-2 rounded-lg hover:bg-red-100 active:bg-red-200 transition-all"
                    aria-label="Clear all notifications"
                    title="Clear all"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-purple-100 transition-all"
                  aria-label="Close notification center"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200" role="list">
                  {notifications.slice().reverse().map((notification, index) => (
                    <li
                      key={notification.id}
                      className="hover:bg-gray-50 transition-all relative overflow-hidden"
                      role="listitem"
                      onTouchStart={(e) => handleSwipeStart(notification.id, e)}
                      onTouchMove={(e) => handleSwipeMove(notification.id, e)}
                      onTouchEnd={(e) => handleSwipeEnd(notification.id, e)}
                      style={{
                        transform: 'translateX(0)',
                        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                      }}
                    >
                      {/* Delete indicator background */}
                      <div 
                        className={`absolute inset-0 bg-red-500 flex items-center justify-end px-6 transition-opacity ${
                          swipedNotifications.has(notification.id) ? 'opacity-100' : 'opacity-0'
                        }`}
                        aria-hidden="true"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Notification content */}
                      <div className="flex gap-3 p-4 bg-white relative">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {notification.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="flex-shrink-0 p-1 rounded-lg hover:bg-red-50 active:bg-red-100 transition-all"
                          aria-label="Delete notification"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-500" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}