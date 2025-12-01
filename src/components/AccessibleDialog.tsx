import { useEffect, useRef, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAccessibility } from '../context/AccessibilityContext';

interface AccessibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  critical?: boolean;
  playSound?: boolean;
}

/**
 * Accessible Dialog Component
 * 
 * Features:
 * - Automatic focus management
 * - Screen reader announcements
 * - Focus trapping (prevents leaving dialog)
 * - Sound cues for critical dialogs
 * - Persistent until user interaction for cognitive disabilities
 * - Enhanced visual prominence in accessibility mode
 * 
 * WCAG Compliance:
 * - 2.4.3 Focus Order
 * - 3.2.1 On Focus
 * - 4.1.3 Status Messages
 */
export function AccessibleDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  critical = false,
  playSound = false,
}: AccessibleDialogProps) {
  const { settings } = useAccessibility();
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);

  // Announce dialog opening
  useEffect(() => {
    if (open) {
      // Create announcement
      if (!announcerRef.current) {
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'alert');
        announcer.setAttribute('aria-live', 'assertive');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        announcerRef.current = announcer;
      }

      // Announce dialog
      setTimeout(() => {
        if (announcerRef.current) {
          const announcement = `${critical ? 'Important dialog opened' : 'Dialog opened'}: ${title}${description ? '. ' + description : ''}`;
          announcerRef.current.textContent = announcement;
        }
      }, 100);

      // Play sound if requested or if voice guide is enabled
      if ((playSound || settings.voiceGuide || critical) && settings.hapticFeedback) {
        playDialogSound(critical);
      }

      // Haptic feedback
      if (settings.hapticFeedback) {
        if ('vibrate' in navigator) {
          navigator.vibrate(critical ? [200, 100, 200] : [100]);
        }
      }
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, [open, title, description, critical, settings.voiceGuide, settings.hapticFeedback, playSound]);

  return (
    <Dialog open={open} onOpenChange={critical ? undefined : onOpenChange}>
      <DialogContent
        className={`
          ${critical ? 'border-4 border-red-500' : ''}
          ${settings.colorMode === 'high-contrast' ? 'border-4 border-black dark:border-white' : ''}
        `}
        aria-describedby={description ? 'dialog-description' : undefined}
        onOpenAutoFocus={(e) => {
          // Store first focusable element for potential refocus
          const focusable = e.currentTarget.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          firstFocusableRef.current = focusable;
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {critical && '⚠️ '}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription id="dialog-description" className="text-lg">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Sound effect for dialog
const playDialogSound = (critical: boolean) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (critical) {
      // Alert sound - lower frequency, more urgent
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else {
      // Info sound - pleasant tone
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.debug('Audio not supported');
  }
};
