import { useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCart } from '../context/CartContext';
import { trackMazeEvent, trackMazePageView } from '../components/analytics/MazeAnalytics';

/**
 * Custom hook for tracking FoodPapa-specific events in Maze
 * 
 * Automatically tracks:
 * - Page navigation
 * - Cart actions (add, remove, clear)
 * - Order placement
 * - Accessibility feature usage
 * - Tutorial interactions
 * - Voice guide usage
 * - Language changes
 */
export function useMazeTracking(pageName: string) {
  const { settings } = useAccessibility();
  const { cart } = useCart();

  // Track page view when component mounts or pageName changes
  useEffect(() => {
    trackMazePageView(pageName, {
      language: settings.language,
      voiceGuideEnabled: settings.voiceGuide,
      colorMode: settings.colorMode,
      textSize: settings.textSize,
      timestamp: new Date().toISOString(),
    });
  }, [pageName, settings.language]);

  // Track cart changes
  useEffect(() => {
    if (cart.length > 0) {
      trackMazeEvent('cart_updated', {
        itemCount: cart.length,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        language: settings.language,
      });
    }
  }, [cart.length]);

  // Return tracking functions for manual event tracking
  const trackInteraction = (action: string, details?: Record<string, any>) => {
    trackMazeEvent(`user_interaction_${action}`, {
      page: pageName,
      language: settings.language,
      voiceGuideEnabled: settings.voiceGuide,
      ...details,
    });
  };

  const trackAccessibilityFeature = (feature: string, enabled: boolean) => {
    trackMazeEvent('accessibility_feature_toggled', {
      feature,
      enabled,
      page: pageName,
      language: settings.language,
    });
  };

  const trackVoiceUsage = (element: string, text: string) => {
    trackMazeEvent('voice_guide_used', {
      element,
      textLength: text.length,
      language: settings.language,
      page: pageName,
    });
  };

  const trackTutorialStep = (step: number, action: 'viewed' | 'completed' | 'skipped') => {
    trackMazeEvent('tutorial_interaction', {
      step,
      action,
      page: pageName,
      language: settings.language,
    });
  };

  const trackLanguageChange = (from: string, to: string) => {
    trackMazeEvent('language_changed', {
      from,
      to,
      page: pageName,
    });
  };

  const trackSearch = (query: string, resultsCount: number) => {
    trackMazeEvent('search_performed', {
      query,
      queryLength: query.length,
      resultsCount,
      language: settings.language,
      page: pageName,
    });
  };

  const trackOrderPlaced = (orderDetails: {
    totalItems: number;
    totalPrice: number;
    paymentMethod: string;
    deliveryOption: string;
  }) => {
    trackMazeEvent('order_placed', {
      ...orderDetails,
      language: settings.language,
      voiceGuideEnabled: settings.voiceGuide,
      timestamp: new Date().toISOString(),
    });
  };

  const trackCartAction = (action: 'add' | 'remove' | 'clear', itemName?: string) => {
    trackMazeEvent('cart_action', {
      action,
      itemName,
      cartSize: cart.length,
      language: settings.language,
      page: pageName,
    });
  };

  const trackButtonClick = (buttonName: string, hasVoice: boolean = false) => {
    trackMazeEvent('button_clicked', {
      buttonName,
      hasVoiceGuide: hasVoice,
      language: settings.language,
      page: pageName,
      timestamp: new Date().toISOString(),
    });
  };

  const trackSwipeGesture = (direction: 'left' | 'right' | 'up' | 'down', element: string) => {
    trackMazeEvent('swipe_gesture', {
      direction,
      element,
      page: pageName,
      language: settings.language,
    });
  };

  const trackError = (errorType: string, errorMessage: string) => {
    trackMazeEvent('error_occurred', {
      errorType,
      errorMessage,
      page: pageName,
      language: settings.language,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    trackInteraction,
    trackAccessibilityFeature,
    trackVoiceUsage,
    trackTutorialStep,
    trackLanguageChange,
    trackSearch,
    trackOrderPlaced,
    trackCartAction,
    trackButtonClick,
    trackSwipeGesture,
    trackError,
  };
}
