import { AccessibleButton } from './AccessibleButton';
import { MascotIcon } from './MascotIcon';
import { LanguageToggle } from './LanguageToggle';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col px-8 py-8">
      {/* Language Toggle - Top Right */}
      <div className="flex justify-end mb-4">
        <LanguageToggle variant="pill" />
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8" role="main">
        {/* Logo */}
        <div className="mb-4" role="img" aria-label="FoodPapa mascot logo">
          <MascotIcon className="w-32 h-32 mx-auto" aria-hidden="true" />
        </div>
        
        {/* App Name */}
        <h1 className="text-purple-700 text-4xl">FoodPapa</h1>
        
        {/* Tagline */}
        <p className="text-gray-700 text-xl leading-relaxed">
          Order Meals Easily
        </p>
        
        <p className="text-gray-600 leading-relaxed">
          Simple, clear food ordering designed for everyone
        </p>
        
        {/* Action Buttons */}
        <div className="w-full space-y-4 pt-8" role="group" aria-label="Sign in options">
          <AccessibleButton 
            variant="primary" 
            fullWidth
            onClick={onContinue}
            ariaLabel="Continue as guest without signing in"
          >
            Continue as Guest
          </AccessibleButton>
          
          <AccessibleButton 
            variant="outlined" 
            fullWidth
            onClick={onContinue}
            ariaLabel="Sign in to your account"
          >
            Sign In
          </AccessibleButton>
        </div>
        
        {/* Accessibility Toggle */}
        <button 
          className="mt-8 text-purple-700 underline min-h-[44px]"
          aria-label="Enable high contrast mode for better visibility"
        >
          Enable High Contrast Mode
        </button>
      </main>
    </div>
  );
}