import { AccessibleButton } from './AccessibleButton';
import { useState, useEffect } from 'react';
import { VoiceGuide, useVoiceAnnouncement } from './VoiceGuide';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
  onLoginSuccess: (phone: string) => void;
}

export function LoginScreen({ onContinueAsGuest, onLoginSuccess }: LoginScreenProps) {
  const { t } = useTranslation();
  const { announce } = useVoiceAnnouncement();
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Announce screen on load
  useEffect(() => {
    setTimeout(() => {
      announce('Welcome to FoodPapa login screen. You can continue as a guest without signing in, or sign in with your phone number to access your orders and rewards.');
    }, 500);
  }, []);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-verify when all filled
      if (newOTP.every(digit => digit !== '') && index === 5) {
        setTimeout(() => {
          onLoginSuccess(phone);
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 py-8">
      {/* Language Toggle - Top Right */}
      <div className="flex justify-end mb-4">
        <LanguageToggle variant="pill" />
      </div>
      
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto" role="main">
        <h1 className="text-gray-900 text-3xl mb-4 text-center">{t('welcomeBack')}</h1>
        <p className="text-gray-600 text-center mb-12">
          {t('signInAccess')}
        </p>

        {!showOTP ? (
          <>
            {/* Continue as Guest - Primary Option */}
            <div className="mb-8">
              <VoiceGuide text="Continue as guest button. No account needed. This will let you start ordering food immediately without signing in.">
                <AccessibleButton
                  variant="primary"
                  fullWidth
                  onClick={onContinueAsGuest}
                  className="min-h-[64px]"
                  ariaLabel="Continue as guest without signing in"
                >
                  <span className="text-2xl mr-2" aria-hidden="true">👤</span>
                  {t('continueAsGuest')}
                </AccessibleButton>
              </VoiceGuide>
              <p className="text-gray-500 text-center mt-3" id="guest-description">
                {t('noAccountNeeded')}
              </p>
            </div>

            <div className="relative mb-8" role="separator" aria-label="or">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500">{t('or')}</span>
              </div>
            </div>

            {/* Phone Login */}
            <form onSubmit={(e) => { e.preventDefault(); setShowOTP(true); }} className="mb-6">
              <label htmlFor="phone-input" className="block text-gray-700 mb-3">{t('phoneNumber')}</label>
              <div className="flex gap-3">
                <div 
                  className="w-20 px-4 py-4 bg-gray-100 rounded-xl text-center text-lg"
                  aria-label="Country code"
                >
                  +92
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="3001234567"
                  className="flex-1 px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
                  aria-required="true"
                  aria-describedby="phone-description"
                  aria-invalid={phone.length > 0 && phone.length < 10}
                />
              </div>
              <p id="phone-description" className="sr-only">
                Enter your 10-digit mobile phone number
              </p>

              <div className="mt-6">
                <VoiceGuide text={phone.length < 10 ? "Sign in with phone button. Please enter your 10-digit phone number first to continue." : "Sign in with phone button. This will send a verification code to your phone number."}>
                  <AccessibleButton
                    variant="outlined"
                    fullWidth
                    onClick={() => setShowOTP(true)}
                    disabled={phone.length < 10}
                    ariaLabel={phone.length < 10 ? "Enter phone number to continue" : "Send verification code to phone"}
                  >
                    {t('signInWithPhone')}
                  </AccessibleButton>
                </VoiceGuide>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* OTP Entry */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 text-xl">Enter Verification Code</h2>
                <button 
                  onClick={() => setShowOTP(false)}
                  className="text-purple-700 underline min-h-[44px]"
                  aria-label="Change phone number and go back"
                >
                  Change Number
                </button>
              </div>
              
              <p className="text-gray-600 mb-6" id="otp-description">
                We sent a code to +92 {phone}
              </p>

              {/* OTP Input Boxes */}
              <div 
                className="flex gap-3 justify-center mb-6" 
                role="group" 
                aria-labelledby="otp-description"
                aria-label="6-digit verification code"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-14 h-14 text-center text-2xl border-2 border-gray-300 rounded-xl focus:border-purple-700 outline-none"
                    aria-label={`Digit ${index + 1} of 6`}
                    aria-required="true"
                  />
                ))}
              </div>

              {/* Progress Indicator */}
              {otp.some(d => d !== '') && (
                <div 
                  className="bg-purple-50 rounded-xl p-4 mb-6 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-purple-700">
                    {otp.filter(d => d !== '').length} of 6 digits entered
                  </p>
                </div>
              )}

              <div className="text-center space-y-4">
                <button 
                  className="text-purple-700 underline text-lg min-h-[44px]"
                  aria-label="Resend verification code"
                >
                  Didn't receive code? Resend
                </button>
                
                <AccessibleButton
                  variant="secondary"
                  fullWidth
                  icon={<span className="text-2xl" aria-hidden="true">📞</span>}
                  ariaLabel="Receive verification code via phone call instead"
                >
                  Call Me Instead
                </AccessibleButton>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}