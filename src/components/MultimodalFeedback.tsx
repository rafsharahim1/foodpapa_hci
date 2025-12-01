import { useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useVoiceAnnouncement } from './VoiceGuide';

/**
 * MultimodalFeedback System
 * 
 * Ensures feedback is provided through MULTIPLE channels simultaneously:
 * - VISUAL: Icons, text, colors, animations
 * - HAPTIC: Vibrations (when enabled)
 * - AUDIO: Beeps, sounds, voice announcements
 * 
 * WCAG 2.1 Success Criterion 1.3.3 (Level A): Sensory Characteristics
 * Instructions don't rely solely on sensory characteristics like shape, size, 
 * visual location, orientation, or sound.
 */

interface FeedbackOptions {
  visual?: boolean;
  haptic?: boolean;
  audio?: boolean;
  voice?: boolean;
}

type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface MultimodalFeedbackParams {
  type: FeedbackType;
  message: string;
  detailedMessage?: string;
  options?: FeedbackOptions;
}

/**
 * Haptic Patterns
 * Different vibration patterns for different feedback types
 */
const HAPTIC_PATTERNS = {
  success: [50, 30, 50], // Double tap
  error: [100, 50, 100, 50, 100], // Triple pulse (more urgent)
  warning: [80, 40, 80], // Double medium pulse
  info: [60], // Single gentle pulse
  neutral: [40], // Single brief pulse
  tap: [10], // Quick tap for button press
  longPress: [50, 20, 50, 20, 50], // Triple pulse for long press
  swipe: [30], // Light swipe feedback
} as const;

/**
 * Audio Frequencies
 * Different beep frequencies for different feedback types
 */
const AUDIO_FREQUENCIES = {
  success: [800, 100], // High pleasant tone
  error: [200, 150], // Low warning tone
  warning: [600, 100], // Medium cautionary tone
  info: [500, 80], // Neutral informative tone
  neutral: [400, 60], // Subtle tone
} as const;

/**
 * useMultimodalFeedback Hook
 * 
 * Provides comprehensive feedback through multiple sensory channels
 */
export function useMultimodalFeedback() {
  const { settings } = useAccessibility();
  const { announce } = useVoiceAnnouncement();

  /**
   * Trigger haptic feedback (vibration)
   */
  const triggerHaptic = (pattern: number | number[]) => {
    if (!settings.hapticFeedback) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  /**
   * Play audio beep
   * Uses Web Audio API for cross-platform compatibility
   */
  const playBeep = (frequency: number, duration: number) => {
    // Don't play if user has reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Gentle fade in/out to avoid harsh sounds
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio feedback unavailable:', error);
    }
  };

  /**
   * Provide multimodal feedback
   * Combines visual, haptic, audio, and voice feedback
   */
  const provideFeedback = ({
    type,
    message,
    detailedMessage,
    options = { visual: true, haptic: true, audio: true, voice: true }
  }: MultimodalFeedbackParams) => {
    const {
      visual = true,
      haptic = true,
      audio = true,
      voice = true
    } = options;

    // 1. HAPTIC FEEDBACK (if enabled in settings)
    if (haptic && settings.hapticFeedback) {
      const pattern = HAPTIC_PATTERNS[type];
      triggerHaptic(pattern);
    }

    // 2. AUDIO FEEDBACK (beep)
    if (audio) {
      const [frequency, duration] = AUDIO_FREQUENCIES[type];
      playBeep(frequency, duration);
    }

    // 3. VOICE FEEDBACK (announcement)
    if (voice) {
      const announcement = detailedMessage || message;
      announce(announcement);
    }

    // 4. VISUAL FEEDBACK is handled by the calling component
    // (toast, dialog, inline message, etc.)
    // This ensures feedback is NEVER only haptic or only audio

    return {
      type,
      message,
      detailedMessage: detailedMessage || message,
      providedChannels: {
        visual,
        haptic: haptic && settings.hapticFeedback,
        audio,
        voice
      }
    };
  };

  /**
   * Quick feedback methods for common scenarios
   */
  const feedback = {
    success: (message: string, detailedMessage?: string, options?: FeedbackOptions) =>
      provideFeedback({ type: 'success', message, detailedMessage, options }),

    error: (message: string, detailedMessage?: string, options?: FeedbackOptions) =>
      provideFeedback({ type: 'error', message, detailedMessage, options }),

    warning: (message: string, detailedMessage?: string, options?: FeedbackOptions) =>
      provideFeedback({ type: 'warning', message, detailedMessage, options }),

    info: (message: string, detailedMessage?: string, options?: FeedbackOptions) =>
      provideFeedback({ type: 'info', message, detailedMessage, options }),

    neutral: (message: string, detailedMessage?: string, options?: FeedbackOptions) =>
      provideFeedback({ type: 'neutral', message, detailedMessage, options }),

    // Quick haptic-only feedback for interactions (still provides audio cue)
    tap: () => {
      if (settings.hapticFeedback) triggerHaptic(HAPTIC_PATTERNS.tap);
      playBeep(300, 20); // Very brief click sound
    },

    longPress: () => {
      if (settings.hapticFeedback) triggerHaptic(HAPTIC_PATTERNS.longPress);
      playBeep(400, 40);
    },

    swipe: () => {
      if (settings.hapticFeedback) triggerHaptic(HAPTIC_PATTERNS.swipe);
      playBeep(350, 25);
    }
  };

  return {
    ...feedback,
    provideFeedback,
    triggerHaptic,
    playBeep,
    isHapticEnabled: settings.hapticFeedback
  };
}

/**
 * MultimodalButton Component
 * 
 * Button that provides feedback through multiple channels when pressed
 */
interface MultimodalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  feedbackType?: FeedbackType;
  feedbackMessage?: string;
  children: React.ReactNode;
}

export function MultimodalButton({
  feedbackType = 'neutral',
  feedbackMessage,
  onClick,
  children,
  className = '',
  ...props
}: MultimodalButtonProps) {
  const { tap } = useMultimodalFeedback();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Always provide tap feedback
    tap();

    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * FeedbackIndicator Component
 * 
 * Visual indicator that shows what types of feedback are active
 * Helps users understand which sensory channels are providing feedback
 */
export function FeedbackIndicator() {
  const { settings } = useAccessibility();

  const indicators = [
    {
      active: true, // Visual always active
      icon: '👁️',
      label: 'Visual',
      description: 'Icons and text'
    },
    {
      active: settings.hapticFeedback,
      icon: '📳',
      label: 'Haptic',
      description: 'Vibrations'
    },
    {
      active: settings.voiceGuide,
      icon: '🔊',
      label: 'Voice',
      description: 'Audio announcements'
    }
  ];

  return (
    <div 
      className={`flex gap-2 p-3 rounded-xl ${
        settings.colorMode === 'high-contrast'
          ? 'bg-gray-800 border-2 border-yellow-400'
          : 'bg-purple-50 border border-purple-200'
      }`}
      role="status"
      aria-label="Active feedback modes"
    >
      {indicators.map((indicator) => (
        <div
          key={indicator.label}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            indicator.active
              ? settings.colorMode === 'high-contrast'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-purple-700 text-white'
              : settings.colorMode === 'high-contrast'
                ? 'bg-gray-700 text-gray-400'
                : 'bg-gray-200 text-gray-500'
          }`}
          title={`${indicator.label}: ${indicator.active ? 'Active' : 'Inactive'}`}
          aria-label={`${indicator.label} feedback: ${indicator.active ? 'Active' : 'Inactive'}`}
        >
          <span aria-hidden="true">{indicator.icon}</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{indicator.label}</span>
            <span className="text-xs opacity-75">{indicator.description}</span>
          </div>
          {indicator.active && (
            <span className="text-lg" aria-hidden="true">✓</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * useFeedbackOnMount Hook
 * 
 * Provides feedback when a component mounts (e.g., screen load)
 */
export function useFeedbackOnMount(
  message: string,
  type: FeedbackType = 'info',
  delay: number = 500
) {
  const { provideFeedback } = useMultimodalFeedback();

  useEffect(() => {
    const timer = setTimeout(() => {
      provideFeedback({
        type,
        message,
        options: { visual: false, haptic: true, audio: true, voice: true }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, []);
}

/**
 * Multimodal Alert Component
 * 
 * Alert that provides feedback through ALL channels simultaneously
 */
interface MultimodalAlertProps {
  type: FeedbackType;
  title: string;
  message: string;
  icon?: string;
  onDismiss?: () => void;
}

export function MultimodalAlert({
  type,
  title,
  message,
  icon,
  onDismiss
}: MultimodalAlertProps) {
  const { settings } = useAccessibility();
  const { provideFeedback } = useMultimodalFeedback();

  // Provide multimodal feedback when alert appears
  useEffect(() => {
    provideFeedback({
      type,
      message: `${title}. ${message}`,
      options: { visual: true, haptic: true, audio: true, voice: true }
    });
  }, [type, title, message]);

  const typeStyles = {
    success: {
      bg: settings.colorMode === 'high-contrast' ? 'bg-gray-800' : 'bg-green-50',
      border: settings.colorMode === 'high-contrast' ? 'border-yellow-400' : 'border-green-500',
      text: settings.colorMode === 'high-contrast' ? 'text-yellow-400' : 'text-green-800',
      icon: icon || '✓'
    },
    error: {
      bg: settings.colorMode === 'high-contrast' ? 'bg-gray-900' : 'bg-red-50',
      border: settings.colorMode === 'high-contrast' ? 'border-red-400' : 'border-red-500',
      text: settings.colorMode === 'high-contrast' ? 'text-red-400' : 'text-red-800',
      icon: icon || '✕'
    },
    warning: {
      bg: settings.colorMode === 'high-contrast' ? 'bg-gray-800' : 'bg-yellow-50',
      border: settings.colorMode === 'high-contrast' ? 'border-yellow-400' : 'border-yellow-500',
      text: settings.colorMode === 'high-contrast' ? 'text-yellow-400' : 'text-yellow-800',
      icon: icon || '⚠'
    },
    info: {
      bg: settings.colorMode === 'high-contrast' ? 'bg-gray-800' : 'bg-blue-50',
      border: settings.colorMode === 'high-contrast' ? 'border-blue-400' : 'border-blue-500',
      text: settings.colorMode === 'high-contrast' ? 'text-blue-400' : 'text-blue-800',
      icon: icon || 'ℹ'
    },
    neutral: {
      bg: settings.colorMode === 'high-contrast' ? 'bg-gray-800' : 'bg-gray-50',
      border: settings.colorMode === 'high-contrast' ? 'border-gray-400' : 'border-gray-300',
      text: settings.colorMode === 'high-contrast' ? 'text-white' : 'text-gray-800',
      icon: icon || '•'
    }
  };

  const style = typeStyles[type];

  return (
    <div
      className={`flex items-start gap-4 p-6 rounded-2xl border-2 ${style.bg} ${style.border}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* VISUAL: Icon */}
      <div 
        className={`text-3xl ${style.text}`}
        aria-hidden="true"
      >
        {style.icon}
      </div>

      {/* VISUAL: Text content */}
      <div className="flex-1">
        <h3 className={`text-lg font-semibold mb-1 ${style.text}`}>
          {title}
        </h3>
        <p className={`${style.text} opacity-90`}>
          {message}
        </p>

        {/* VISUAL: Haptic indicator (if enabled) */}
        {settings.hapticFeedback && (
          <p className={`text-sm mt-2 ${style.text} opacity-75 flex items-center gap-2`}>
            <span aria-hidden="true">📳</span>
            <span>Device vibration active</span>
          </p>
        )}
      </div>

      {/* VISUAL: Dismiss button */}
      {onDismiss && (
        <MultimodalButton
          onClick={onDismiss}
          className={`min-h-[44px] min-w-[44px] ${style.text}`}
          aria-label="Dismiss alert"
        >
          <span className="text-2xl" aria-hidden="true">×</span>
        </MultimodalButton>
      )}
    </div>
  );
}

/**
 * Export all multimodal feedback utilities
 */
export default {
  useMultimodalFeedback,
  MultimodalButton,
  MultimodalAlert,
  FeedbackIndicator,
  useFeedbackOnMount,
  HAPTIC_PATTERNS,
  AUDIO_FREQUENCIES
};
