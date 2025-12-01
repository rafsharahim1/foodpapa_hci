import { ReactNode } from 'react';
import { useMultimodalFeedback } from './MultimodalFeedback';

interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outlined';
  size?: 'large' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disableMultimodal?: boolean; // Option to disable multimodal feedback if needed
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  disableMultimodal = false
}: AccessibleButtonProps) {
  const { tap } = useMultimodalFeedback();
  
  const baseStyles = 'flex items-center justify-center gap-3 rounded-xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    large: 'min-h-[56px] px-6 text-lg',
    medium: 'min-h-[44px] px-4'
  };
  
  const variantStyles = {
    primary: 'bg-purple-700 text-white hover:bg-purple-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outlined: 'border-2 border-purple-700 text-purple-700 hover:bg-purple-50'
  };
  
  const handleClick = () => {
    // Provide multimodal feedback (haptic + audio) when button is pressed
    // This ensures buttons ALWAYS provide haptic + audio feedback, not just haptic alone
    if (!disabled && !disableMultimodal) {
      tap();
    }
    
    if (onClick && !disabled) {
      onClick();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
