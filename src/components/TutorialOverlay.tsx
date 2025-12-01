import { useEffect, useState } from 'react';
import { useTutorial } from '../context/TutorialContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessibility } from '../context/AccessibilityContext';
import { X } from 'lucide-react';
import { useVoiceAnnouncement } from './VoiceGuide';

export function TutorialOverlay() {
  const { isTutorialEnabled, getCurrentStepForScreen, nextStep, skipTutorial, currentStep, getTotalStepsForScreen } = useTutorial();
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const { speakDirectly } = useVoiceAnnouncement();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const currentStepData = getCurrentStepForScreen();
  const totalSteps = getTotalStepsForScreen();

  useEffect(() => {
    if (!isTutorialEnabled || !currentStepData) {
      setIsVisible(false);
      setTargetElement(null);
      setTargetRect(null);
      return;
    }

    setIsVisible(true);

    // Find the target element by data-tutorial-id
    const findTarget = () => {
      const element = document.querySelector(`[data-tutorial-id="${currentStepData.target}"]`) as HTMLElement;
      if (element) {
        setTargetElement(element);
        setTargetRect(element.getBoundingClientRect());
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Try to find immediately
    findTarget();

    // Also try after a short delay (in case DOM hasn't rendered yet)
    const timeoutId = setTimeout(findTarget, 100);

    // Update position on scroll/resize
    const updatePosition = () => {
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isTutorialEnabled, currentStepData, targetElement]);

  if (!isTutorialEnabled || !currentStepData || !targetRect || !isVisible) {
    return null;
  }

  const padding = 12;
  const spotlightStyle = {
    left: targetRect.left - padding,
    top: targetRect.top - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
  };

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const gap = 16;

    switch (currentStepData.position) {
      case 'bottom':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.bottom + gap,
          arrowPosition: 'top' as const,
          arrowLeft: tooltipWidth / 2 - 12,
        };
      case 'top':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.top - tooltipHeight - gap,
          arrowPosition: 'bottom' as const,
          arrowLeft: tooltipWidth / 2 - 12,
        };
      case 'left':
        return {
          left: targetRect.left - tooltipWidth - gap,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          arrowPosition: 'right' as const,
          arrowTop: tooltipHeight / 2 - 12,
        };
      case 'right':
        return {
          left: targetRect.right + gap,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          arrowPosition: 'left' as const,
          arrowTop: tooltipHeight / 2 - 12,
        };
      default:
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.bottom + gap,
          arrowPosition: 'top' as const,
          arrowLeft: tooltipWidth / 2 - 12,
        };
    }
  };

  const tooltipPos = getTooltipPosition();

  const handleNext = () => {
    nextStep();
  };

  const handleSpeak = () => {
    const text = t(currentStepData.voiceText);
    speakDirectly(text);
  };

  return (
    <>
      {/* Dark Overlay with cutout */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none animate-fadeIn"
        style={{
          background: settings.highContrast 
            ? 'rgba(0, 0, 0, 0.85)'
            : 'rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Spotlight cutout effect */}
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            ...spotlightStyle,
            boxShadow: settings.highContrast
              ? '0 0 0 9999px rgba(0, 0, 0, 0.85), 0 0 20px 4px rgba(255, 255, 255, 0.5)'
              : '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px 8px rgba(147, 51, 234, 0.6)',
            borderRadius: '16px',
            border: settings.highContrast 
              ? '3px solid #FFFFFF'
              : '3px solid #a855f7',
          }}
        />
      </div>

      {/* Pulsing border around target */}
      <div
        className="fixed z-[9999] pointer-events-none animate-pulse-scale"
        style={{
          ...spotlightStyle,
          borderRadius: '16px',
          border: settings.highContrast 
            ? '4px solid #FFFFFF'
            : '4px solid #a855f7',
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[10000] pointer-events-auto animate-slideIn"
        style={{
          left: Math.max(16, Math.min(window.innerWidth - 336, tooltipPos.left)),
          top: Math.max(16, Math.min(window.innerHeight - 250, tooltipPos.top)),
          width: '320px',
        }}
      >
        <div 
          className="rounded-2xl shadow-2xl border-2 p-6 relative"
          style={{
            backgroundColor: settings.highContrast ? '#000000' : '#FFFFFF',
            borderColor: settings.highContrast ? '#FFFFFF' : '#e5e7eb',
          }}
        >
          {/* Arrow pointing to target */}
          <div
            className="absolute w-0 h-0"
            style={{
              ...(tooltipPos.arrowPosition === 'top' && {
                top: '-12px',
                left: `${tooltipPos.arrowLeft}px`,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: `12px solid ${settings.highContrast ? '#FFFFFF' : '#e5e7eb'}`,
              }),
              ...(tooltipPos.arrowPosition === 'bottom' && {
                bottom: '-12px',
                left: `${tooltipPos.arrowLeft}px`,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: `12px solid ${settings.highContrast ? '#FFFFFF' : '#e5e7eb'}`,
              }),
              ...(tooltipPos.arrowPosition === 'left' && {
                left: '-12px',
                top: `${tooltipPos.arrowTop}px`,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderRight: `12px solid ${settings.highContrast ? '#FFFFFF' : '#e5e7eb'}`,
              }),
              ...(tooltipPos.arrowPosition === 'right' && {
                right: '-12px',
                top: `${tooltipPos.arrowTop}px`,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderLeft: `12px solid ${settings.highContrast ? '#FFFFFF' : '#e5e7eb'}`,
              }),
            }}
          />

          {/* Close/Skip button - Top right X icon */}
          <button
            onClick={skipTutorial}
            className="absolute -top-3 -right-3 rounded-full p-2 shadow-lg transition-all hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            style={{
              backgroundColor: settings.highContrast ? '#FFFFFF' : '#ef4444',
              color: settings.highContrast ? '#000000' : '#FFFFFF',
            }}
            aria-label={t('skipTutorial') || 'Skip tutorial'}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-sm px-3 py-1 rounded-full"
              style={{
                backgroundColor: settings.highContrast ? '#FFFFFF' : '#f3e8ff',
                color: settings.highContrast ? '#000000' : '#7c3aed',
              }}
            >
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="text-xl mb-2"
            style={{
              color: settings.highContrast ? '#FFFFFF' : '#111827',
            }}
          >
            {t(currentStepData.title)}
          </h3>

          {/* Description */}
          <p 
            className="text-lg mb-4"
            style={{
              color: settings.highContrast ? '#FFFFFF' : '#4b5563',
            }}
          >
            {t(currentStepData.description)}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSpeak}
              className="flex-1 min-h-[48px] rounded-xl border-2 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: settings.highContrast ? '#000000' : '#FFFFFF',
                borderColor: settings.highContrast ? '#FFFFFF' : '#7c3aed',
                color: settings.highContrast ? '#FFFFFF' : '#7c3aed',
              }}
            >
              <span className="text-xl">🔊</span>
              <span>{t('listen')}</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 min-h-[48px] rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                backgroundColor: settings.highContrast ? '#FFFFFF' : '#7c3aed',
                color: settings.highContrast ? '#000000' : '#FFFFFF',
              }}
            >
              <span>{currentStep + 1 === totalSteps ? t('finish') : t('next')}</span>
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add custom animations via style tag */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulseScale {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-pulse-scale {
          animation: pulseScale 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}