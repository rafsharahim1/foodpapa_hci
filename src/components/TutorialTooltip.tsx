import { useEffect, useState } from 'react';
import { useTutorial } from '../context/TutorialContext';
import { useTranslation } from '../hooks/useTranslation';
import { VoiceGuide } from './VoiceGuide';
import { AccessibleButton } from './AccessibleButton';

interface TutorialTooltipProps {
  targetId?: string;
}

export function TutorialTooltip({ targetId: propTargetId }: TutorialTooltipProps) {
  const { t } = useTranslation();
  const { isTutorialEnabled, getCurrentStepForScreen, nextStep, skipTutorial, currentStep, getTotalStepsForScreen } = useTutorial();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  const currentStepData = getCurrentStepForScreen();
  const totalSteps = getTotalStepsForScreen();
  
  // Use prop targetId if provided, otherwise use the one from current step
  const targetId = propTargetId || currentStepData?.target;

  useEffect(() => {
    if (!isTutorialEnabled || !currentStepData || !targetId) {
      return;
    }

    console.log('🎯 Tutorial showing for:', targetId, currentStepData);

    // Find the target element
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.warn('⚠️ Target element not found:', targetId);
      return;
    }

    // Calculate position based on target element
    const rect = targetElement.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (currentStepData.position) {
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + (rect.width / 2);
        setArrowPosition('top');
        break;
      case 'top':
        top = rect.top - 16;
        left = rect.left + (rect.width / 2);
        setArrowPosition('bottom');
        break;
      case 'left':
        top = rect.top + (rect.height / 2);
        left = rect.left - 16;
        setArrowPosition('right');
        break;
      case 'right':
        top = rect.top + (rect.height / 2);
        left = rect.right + 16;
        setArrowPosition('left');
        break;
    }

    setPosition({ top, left });

    // Highlight the target element
    targetElement.style.position = 'relative';
    targetElement.style.zIndex = '1000';
    targetElement.style.boxShadow = '0 0 0 4px rgba(147, 51, 234, 0.5), 0 0 0 8px rgba(147, 51, 234, 0.2)';
    targetElement.style.borderRadius = '12px';

    return () => {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
    };
  }, [isTutorialEnabled, currentStepData, targetId]);

  if (!isTutorialEnabled || !currentStepData || !targetId) {
    return null;
  }

  const getArrowStyles = () => {
    const arrowSize = 12;
    const styles: any = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${arrowSize}px solid transparent`
    };

    switch (arrowPosition) {
      case 'top':
        styles.bottom = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.borderBottomColor = '#7c3aed';
        break;
      case 'bottom':
        styles.top = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.borderTopColor = '#7c3aed';
        break;
      case 'left':
        styles.right = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.borderRightColor = '#7c3aed';
        break;
      case 'right':
        styles.left = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.borderLeftColor = '#7c3aed';
        break;
    }

    return styles;
  };

  const getTooltipTransform = () => {
    switch (arrowPosition) {
      case 'top':
        return 'translateX(-50%)';
      case 'bottom':
        return 'translate(-50%, -100%)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0, -50%)';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-[999]"
        onClick={skipTutorial}
      />

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: getTooltipTransform(),
          zIndex: 1001,
          maxWidth: '320px',
          minWidth: '280px'
        }}
        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="relative bg-purple-700 text-white rounded-2xl p-6 shadow-2xl">
          {/* Arrow */}
          <div style={getArrowStyles()} />

          {/* Step Counter */}
          <div className="flex items-center justify-between mb-4">
            <span className="bg-purple-900 px-3 py-1 rounded-full text-sm">
              {t('step')} {currentStep + 1} {t('of')} {totalSteps}
            </span>
            <button
              onClick={skipTutorial}
              className="text-purple-200 hover:text-white text-sm underline"
            >
              {t('skipTutorial')}
            </button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl mb-3 flex items-center gap-2">
              <span>👉</span>
              <span>{t(currentStepData.title as any)}</span>
            </h3>
            <p className="text-purple-100 leading-relaxed">
              {t(currentStepData.description as any)}
            </p>
          </div>

          {/* Voice Guide */}
          <div className="mb-4">
            <VoiceGuide 
              text={t(currentStepData.voiceText as any)}
              autoPlay={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <AccessibleButton
              variant="outlined"
              onClick={skipTutorial}
              className="flex-1 border-white text-white hover:bg-white hover:text-purple-700"
            >
              {t('skipAll')}
            </AccessibleButton>
            <AccessibleButton
              variant="primary"
              onClick={nextStep}
              className="flex-1 bg-white text-purple-700 hover:bg-purple-50"
            >
              {currentStep + 1 === totalSteps ? t('finish') : t('next')}
            </AccessibleButton>
          </div>
        </div>
      </div>
    </>
  );
}