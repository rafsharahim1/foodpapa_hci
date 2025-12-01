import { useTranslation } from '../hooks/useTranslation';

interface AccessibleBackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'default' | 'light';
}

export function AccessibleBackButton({ onClick, label, variant = 'default' }: AccessibleBackButtonProps) {
  const { t } = useTranslation();
  const isLight = variant === 'light';
  const displayLabel = label || t('back');
  
  return (
    <button 
      onClick={onClick}
      className={`min-w-[100px] min-h-[56px] flex items-center justify-center gap-2 rounded-xl px-4 transition-colors ${
        isLight
          ? 'bg-white/20 hover:bg-white/30 active:bg-white/40 text-white'
          : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
      }`}
      aria-label={`Go back to previous screen - ${displayLabel}`}
    >
      <span className="text-3xl" aria-hidden="true">←</span>
      <span className="text-xl">{displayLabel}</span>
    </button>
  );
}