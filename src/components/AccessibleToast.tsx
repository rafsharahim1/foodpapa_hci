import { toast as sonnerToast } from 'sonner@2.0.3';
import { useAccessibility } from '../context/AccessibilityContext';
import { useEffect, useRef } from 'react';
import { useMultimodalFeedback } from './MultimodalFeedback';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  playSound?: boolean;
  persistent?: boolean;
}

/**
 * Accessible Toast Notification System
 * 
 * Features for Visually Impaired Users:
 * - Screen reader announcements via aria-live regions
 * - Automatic focus management for critical alerts
 * - Extended duration in accessibility mode
 * - Optional sound cues
 * 
 * Features for Cognitive Disabilities:
 * - Longer display duration (can be persistent)
 * - Clear, simple language
 * - Visual prominence in enhanced mode
 * - Notification history tracking
 */

// Store notification history
const notificationHistory: Array<{
  id: string;
  title: string;
  description?: string;
  type: string;
  timestamp: Date;
}> = [];

// Sound effects (simple beep using Web Audio API)
const playNotificationSound = (type: 'success' | 'error' | 'warning' | 'info') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different notification types
    const frequencies = {
      success: 800,  // Higher, pleasant tone
      error: 400,    // Lower, attention-grabbing
      warning: 600,  // Medium tone
      info: 700      // Neutral tone
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';

    // Fade in/out for pleasant sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // Silently fail if audio isn't supported
    console.debug('Audio notification not supported');
  }
};

// Haptic feedback (vibration)
const triggerHapticFeedback = (type: 'success' | 'error' | 'warning' | 'info') => {
  if ('vibrate' in navigator) {
    const patterns = {
      success: [100, 50, 100],       // Two short vibrations
      error: [200, 100, 200, 100, 200], // Three strong vibrations
      warning: [150, 100, 150],      // Two medium vibrations
      info: [100]                     // One short vibration
    };
    navigator.vibrate(patterns[type]);
  }
};

export function useAccessibleToast() {
  const { settings } = useAccessibility();
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const multimodal = useMultimodalFeedback();

  // Create hidden announcement region if it doesn't exist
  useEffect(() => {
    if (!announcementRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'toast-announcer';
      document.body.appendChild(announcer);
      announcementRef.current = announcer;
    }

    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  const showToast = ({
    title,
    description,
    type = 'info',
    duration,
    playSound = false,
    persistent = false
  }: ToastOptions) => {
    // Determine duration based on accessibility settings
    let toastDuration = duration;
    
    if (!toastDuration) {
      // Default durations
      const baseDuration = type === 'error' ? 6000 : 4000;
      
      // Extended duration in accessibility mode
      const isAccessibilityEnhanced = 
        settings.colorMode === 'high-contrast' || 
        settings.voiceGuide || 
        settings.simplifiedNavigation;
      
      toastDuration = isAccessibilityEnhanced ? baseDuration * 2 : baseDuration;
    }

    if (persistent) {
      toastDuration = Infinity;
    }

    // Add to notification history
    const notificationId = `toast-${Date.now()}-${Math.random()}`;
    notificationHistory.push({
      id: notificationId,
      title,
      description: description || '',
      type,
      timestamp: new Date()
    });

    // Keep only last 20 notifications
    if (notificationHistory.length > 20) {
      notificationHistory.shift();
    }

    // MULTIMODAL FEEDBACK - Provides visual + haptic + audio + voice simultaneously
    // This ensures haptic feedback is ALWAYS accompanied by visual cues, sounds, and announcements
    const announcement = `${type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : type === 'success' ? 'Success' : 'Notification'}: ${title}${description ? '. ' + description : ''}`;
    
    multimodal.provideFeedback({
      type: type as 'success' | 'error' | 'warning' | 'info',
      message: title,
      detailedMessage: announcement,
      options: {
        visual: true,  // Toast UI is visual
        haptic: true,  // Vibration (if enabled in settings)
        audio: playSound || settings.voiceGuide || type !== 'info',  // Beep sound
        voice: true    // Voice announcement
      }
    });

    // Screen reader announcement (redundant with voice but needed for screen readers without speech)
    if (announcementRef.current) {
      announcementRef.current.textContent = '';
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = announcement;
        }
      }, 100);
    }

    // Show the toast
    const toastOptions = {
      duration: toastDuration,
      className: 'accessibility-enhanced-toast',
      important: type === 'error' || type === 'warning',
    };

    switch (type) {
      case 'success':
        return sonnerToast.success(title, {
          ...(description && { description }),
          ...toastOptions,
        });
      case 'error':
        return sonnerToast.error(title, {
          ...(description && { description }),
          ...toastOptions,
        });
      case 'warning':
        return sonnerToast.warning(title, {
          ...(description && { description }),
          ...toastOptions,
        });
      default:
        return sonnerToast.info(title, {
          ...(description && { description }),
          ...toastOptions,
        });
    }
  };

  return {
    success: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      showToast({ title, description, type: 'success', ...options }),
    error: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      showToast({ title, description, type: 'error', playSound: true, ...options }),
    warning: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      showToast({ title, description, type: 'warning', playSound: true, ...options }),
    info: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      showToast({ title, description, type: 'info', ...options }),
    custom: showToast,
    getHistory: () => [...notificationHistory],
    deleteNotification: (id: string) => {
      const index = notificationHistory.findIndex(n => n.id === id);
      if (index > -1) {
        notificationHistory.splice(index, 1);
      }
    },
    clearAllNotifications: () => {
      notificationHistory.length = 0;
    },
  };
}