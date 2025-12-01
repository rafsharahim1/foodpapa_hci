import { ReactNode, useRef, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

// Global speech lock to ensure only one speech at a time
let isSpeaking = false;
let speechQueue: Array<{ text: string; resolve: () => void }> = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Cooldown timer to prevent rapid-fire calls
let cooldownTimer: NodeJS.Timeout | null = null;
const COOLDOWN_MS = 150; // Wait after cancel before starting new speech

interface VoiceGuideProps {
  text: string;
  children: ReactNode;
  onFocus?: boolean;
  onHover?: boolean;
  delay?: number;
  className?: string;
}

/**
 * VoiceGuide Component
 * 
 * Provides audio announcements for interactive elements using Web Speech API
 * 
 * Features:
 * - Automatic voice announcements on focus
 * - Optional announcements on hover
 * - Screen reader compatible (doesn't interfere with VoiceOver/TalkBack)
 * - Configurable delay
 * - Respects accessibility settings
 * 
 * Usage:
 * <VoiceGuide text="This button adds your food to cart">
 *   <button>Add to Cart</button>
 * </VoiceGuide>
 */
export function VoiceGuide({ 
  text, 
  children, 
  onFocus = false,  // CHANGED: Disabled by default - only speak on explicit click
  onHover = false,
  delay = 300,
  className = ''
}: VoiceGuideProps) {
  const { settings, isInitialSetup } = useAccessibility();
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice guide is enabled if:
  // 1. We're in initial setup (before user makes choices), OR
  // 2. User has enabled Voice Guide, OR
  // 3. User has enabled High Contrast mode
  const isVoiceEnabled = isInitialSetup || settings.voiceGuide || settings.colorMode === 'high-contrast';

  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
      // Also load immediately
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (textToSpeak: string) => {
    if (!isVoiceEnabled) return;
    
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      console.log('Voice Guide:', textToSpeak);
      return;
    }

    // Cancel any ongoing speech
    if (currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtteranceRef.current = utterance;

    // Configure speech based on language
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Set language based on accessibility settings
    if (settings.language === 'urdu') {
      utterance.lang = 'ur-PK'; // Pakistani Urdu
    } else {
      utterance.lang = 'en-US'; // US English
    }

    // Try to find and set the appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (settings.language === 'urdu') {
        // Look for Pakistani Urdu or Hindi voice (Hindi works well for Urdu)
        const urduVoice = voices.find(voice => 
          voice.lang.startsWith('ur') || 
          voice.lang.startsWith('hi') ||
          voice.name.toLowerCase().includes('urdu') ||
          voice.name.toLowerCase().includes('hindi')
        );
        if (urduVoice) {
          utterance.voice = urduVoice;
        }
      } else {
        // Look for US English voice
        const englishVoice = voices.find(voice => voice.lang === 'en-US');
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
    }

    // Speak
    window.speechSynthesis.speak(utterance);

    // Clean up reference when done
    utterance.onend = () => {
      currentUtteranceRef.current = null;
    };
  };

  const handleFocus = () => {
    if (!onFocus || !isVoiceEnabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      speak(text);
    }, delay);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseEnter = () => {
    if (!onHover || !isVoiceEnabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      speak(text);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      if (onFocus) {
        element.addEventListener('focus', handleFocus as EventListener);
        element.addEventListener('blur', handleBlur as EventListener);
      }
      if (onHover) {
        element.addEventListener('mouseenter', handleMouseEnter as EventListener);
        element.addEventListener('mouseleave', handleMouseLeave as EventListener);
      }
    });

    return () => {
      focusableElements.forEach(element => {
        element.removeEventListener('focus', handleFocus as EventListener);
        element.removeEventListener('blur', handleBlur as EventListener);
        element.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cancel any ongoing speech when component unmounts
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, onFocus, onHover, isVoiceEnabled, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * useVoiceAnnouncement Hook
 * 
 * Provides programmatic voice announcements
 * 
 * Usage:
 * const { announce } = useVoiceAnnouncement();
 * announce('Order placed successfully');
 */
export function useVoiceAnnouncement() {
  const { settings, isInitialSetup } = useAccessibility();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isVoiceEnabled = isInitialSetup || settings.voiceGuide || settings.colorMode === 'high-contrast';

  const announce = (text: string, interrupt: boolean = false) => {
    console.log('🎤 Announce called:', text);
    console.log('🎤 Voice enabled:', isVoiceEnabled);
    console.log('🎤 Settings:', { voiceGuide: settings.voiceGuide, colorMode: settings.colorMode, language: settings.language });

    if (!('speechSynthesis' in window)) {
      console.log('Voice Announcement:', text);
      return;
    }

    // Cancel ongoing speech if interrupting
    if (interrupt && currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Set language based on accessibility settings
    if (settings.language === 'urdu') {
      utterance.lang = 'ur-PK'; // Pakistani Urdu
    } else {
      utterance.lang = 'en-US'; // US English
    }

    // Try to find and set the appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (settings.language === 'urdu') {
        // Look for Pakistani Urdu or Hindi voice (Hindi works well for Urdu)
        const urduVoice = voices.find(voice => 
          voice.lang.startsWith('ur') || 
          voice.lang.startsWith('hi') ||
          voice.name.toLowerCase().includes('urdu') ||
          voice.name.toLowerCase().includes('hindi')
        );
        if (urduVoice) {
          utterance.voice = urduVoice;
        }
      } else {
        // Look for US English voice
        const englishVoice = voices.find(voice => voice.lang === 'en-US');
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
    }

    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      currentUtteranceRef.current = null;
    };
  };

  const stop = () => {
    console.log('🛑 STOP called - clearing all speech');
    
    // Clear any pending cooldown timers
    if (cooldownTimer) {
      clearTimeout(cooldownTimer);
      cooldownTimer = null;
    }
    
    // Cancel browser speech
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        console.log('✅ Browser speech canceled');
      } catch (e) {
        console.log('⚠️ Error canceling speech (ignored):', e);
      }
    }
    
    // Clear global state
    currentUtterance = null;
    isSpeaking = false;
    speechQueue = [];
    console.log('✅ Cleared lock, queue, and utterance references');
  };
  
  // speakDirectly bypasses the voice guide settings - always speaks
  // Returns a Promise that resolves when speech is complete
  // COMPLETELY REWRITTEN to eliminate "interrupted" errors
  const speakDirectly = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log('═══════════════════════════════════════');
      console.log('🔊 DIRECT SPEECH REQUEST');
      console.log('   Text:', text.substring(0, 50) + '...');
      console.log('   Full text:', text);
      console.log('   Text length:', text.length);
      console.log('   Language:', settings.language);
      console.log('   isSpeaking lock:', isSpeaking);
      console.log('   Queue length:', speechQueue.length);
      
      // CRITICAL DEBUG: Check if text contains Urdu characters
      const hasUrduChars = /[\u0600-\u06FF]/.test(text);
      const hasEnglishChars = /[a-zA-Z]/.test(text);
      const hasNumbers = /[0-9]/.test(text);
      console.log('   📝 Text analysis:');
      console.log('      Contains Urdu script:', hasUrduChars);
      console.log('      Contains English:', hasEnglishChars);
      console.log('      Contains numbers:', hasNumbers);
      
      if (!('speechSynthesis' in window)) {
        console.log('❌ Speech synthesis not supported');
        resolve();
        return;
      }

      // Add to queue if already speaking
      if (isSpeaking) {
        console.log('⏳ QUEUED - Lock is active. Total in queue:', speechQueue.length + 1);
        speechQueue.push({ text, resolve });
        return;
      }

      // ============================================
      // CRITICAL FIX: Proper sequence for clean speech
      // ============================================
      
      // 1. Acquire lock FIRST (prevents race conditions)
      isSpeaking = true;
      console.log('🔒 LOCK ACQUIRED');

      // 2. Force cancel ANY existing speech (clean slate)
      try {
        window.speechSynthesis.cancel();
        console.log('🧹 Cancelled any existing speech');
      } catch (e) {
        console.log('⚠️ Cancel error (ignored):', e);
      }

      // 3. Wait for mandatory cooldown period
      //    This gives the browser time to fully stop and reset
      const startSpeechAfterCooldown = () => {
        console.log('🔍 Checking browser readiness...');
        console.log('   speaking:', window.speechSynthesis.speaking);
        console.log('   pending:', window.speechSynthesis.pending);
        
        // Double-check the browser is actually ready
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          console.log('⏳ Browser not ready yet, waiting another 50ms...');
          setTimeout(startSpeechAfterCooldown, 50);
          return;
        }

        console.log('✅ Browser ready, creating utterance');
        
        // 4. Create and configure utterance
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtterance = utterance;

        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Set language
        if (settings.language === 'urdu') {
          utterance.lang = 'ur-PK';
          console.log('🌐 Language: Urdu (ur-PK)');
        } else {
          utterance.lang = 'en-US';
          console.log('🌐 Language: English (en-US)');
        }

        // Set voice
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('📢 Available voices:', voices.length);
          console.log('   All voices:', voices.map(v => `${v.name} (${v.lang})`));
          
          if (settings.language === 'urdu') {
            const urduVoice = voices.find(voice => 
              voice.lang.startsWith('ur') || 
              voice.lang.startsWith('hi') ||
              voice.name.toLowerCase().includes('urdu') ||
              voice.name.toLowerCase().includes('hindi')
            );
            
            console.log('🔍 Looking for Urdu voice...');
            console.log('   Found:', urduVoice ? `${urduVoice.name} (${urduVoice.lang})` : 'NONE');
            
            if (urduVoice) {
              utterance.voice = urduVoice;
              console.log('🎤 Voice:', urduVoice.name);
            } else {
              console.log('⚠️ No Urdu voice found!');
              console.log('   Available language codes:', [...new Set(voices.map(v => v.lang))].join(', '));
              console.log('   🔧 FALLBACK: Will use default voice (may not pronounce Urdu correctly)');
            }
          } else {
            const englishVoice = voices.find(voice => voice.lang === 'en-US');
            if (englishVoice) {
              utterance.voice = englishVoice;
              console.log('🎤 Voice:', englishVoice.name);
            }
          }
        } else {
          console.log('⚠️ No voices available yet!');
        }

        // 5. Setup completion handler (handles success AND errors)
        const finishSpeaking = (reason: string) => {
          console.log('═══════════════════════════════════════');
          console.log(`✅ SPEECH FINISHED (${reason})`);
          console.log('   Clearing utterance reference');
          currentUtterance = null;
          console.log('   Releasing lock');
          isSpeaking = false;
          console.log('🔓 LOCK RELEASED');
          
          // Resolve THIS promise
          console.log('   Resolving promise for this item');
          resolve();
          
          // Process next in queue AFTER resolving
          if (speechQueue.length > 0) {
            console.log('📋 PROCESSING QUEUE:', speechQueue.length, 'items remaining');
            const nextItem = speechQueue.shift();
            if (nextItem) {
              // Small delay between items for smoother transitions
              console.log('   Scheduling next item in 100ms...');
              setTimeout(() => {
                speakDirectly(nextItem.text).then(nextItem.resolve);
              }, 100);
            }
          } else {
            console.log('📋 Queue empty - all done');
          }
        };

        // Handle successful completion
        utterance.onend = () => {
          console.log('📢 Utterance onend event fired');
          finishSpeaking('completed');
        };
        
        // Handle errors - but DON'T log "interrupted" as error
        // (it's expected when we cancel intentionally)
        utterance.onerror = (event) => {
          console.log('⚠️ Utterance onerror event fired:', event.error);
          if (event.error === 'interrupted') {
            console.log('ℹ️ Speech interrupted (expected during cleanup)');
          } else if (event.error === 'canceled') {
            console.log('ℹ️ Speech canceled');
          } else {
            console.error('❌ Speech error:', event.error);
          }
          finishSpeaking('error');
        };

        // 6. Start speaking!
        console.log('▶️ SPEAKING NOW...');
        try {
          window.speechSynthesis.speak(utterance);
          console.log('✅ speak() called successfully');
        } catch (e) {
          console.error('❌ Exception calling speak():', e);
          finishSpeaking('exception');
        }
      };

      // Start after cooldown period
      console.log(`⏰ Starting cooldown timer (${COOLDOWN_MS}ms)...`);
      if (cooldownTimer) {
        clearTimeout(cooldownTimer);
      }
      cooldownTimer = setTimeout(startSpeechAfterCooldown, COOLDOWN_MS);
    });
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { announce, stop, speakDirectly, isEnabled: isVoiceEnabled };
}

/**
 * VoiceButton Component
 * 
 * Pre-configured button with voice guide
 * 
 * Usage:
 * <VoiceButton voiceText="Add chicken biryani to cart" onClick={handleAdd}>
 *   Add to Cart
 * </VoiceButton>
 */
interface VoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  voiceText: string;
  children: ReactNode;
}

export function VoiceButton({ voiceText, children, className = '', ...props }: VoiceButtonProps) {
  return (
    <VoiceGuide text={voiceText} onFocus onHover>
      <button className={className} {...props}>
        {children}
      </button>
    </VoiceGuide>
  );
}

/**
 * ScreenReaderText Component
 * 
 * Provides additional context for screen readers without voice synthesis
 * 
 * Usage:
 * <ScreenReaderText>Additional context for screen readers</ScreenReaderText>
 */
export function ScreenReaderText({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}