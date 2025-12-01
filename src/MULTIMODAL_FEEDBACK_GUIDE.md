# Multimodal Feedback System Guide

## Overview

FoodPapa implements a comprehensive **multimodal feedback system** that ensures all user interactions provide feedback through **multiple sensory channels simultaneously**. This approach follows WCAG 2.1 Success Criterion 1.3.3 (Sensory Characteristics) by never relying on a single sensory modality.

## Core Principle

> **Visual cues DO NOT replace sounds or vibrations. Beeps and alerts are ALWAYS accompanied by vibrations, icons, and text.**

When haptic feedback is enabled, users receive feedback through **ALL available channels**:

### 1. **VISUAL** (Always Active)
- Icons and symbols
- Text messages
- Color coding
- Animations and transitions

### 2. **HAPTIC** (When Enabled)
- Device vibrations
- Different vibration patterns for different actions
- Tactile confirmation of interactions

### 3. **AUDIO** (Context-Dependent)
- Beep sounds with varying frequencies
- Sound effects for notifications
- Audio cues for state changes

### 4. **VOICE** (When Enabled)
- Spoken announcements
- Screen reader support
- Detailed audio descriptions

## Implementation

### Basic Usage

```tsx
import { useMultimodalFeedback } from './components/MultimodalFeedback';

function MyComponent() {
  const feedback = useMultimodalFeedback();
  
  const handleAction = () => {
    // Provides: Visual (toast) + Haptic (vibration) + Audio (beep) + Voice (announcement)
    feedback.success(
      'Item added',                           // Short message
      'Chicken biryani added to your cart'    // Detailed announcement
    );
  };
  
  return <button onClick={handleAction}>Add to Cart</button>;
}
```

### Multimodal Feedback Methods

#### 1. **Success Feedback**
```tsx
feedback.success('Order placed', 'Your order has been placed successfully');
```

**Provides:**
- ✅ VISUAL: Green checkmark icon + success message
- ✅ HAPTIC: Double tap vibration pattern (50ms, 30ms, 50ms)
- ✅ AUDIO: High pleasant tone (800 Hz, 100ms)
- ✅ VOICE: "Success. Your order has been placed successfully"

#### 2. **Error Feedback**
```tsx
feedback.error('Payment failed', 'Please check your payment method and try again');
```

**Provides:**
- ✅ VISUAL: Red X icon + error message
- ✅ HAPTIC: Triple pulse vibration (100ms, 50ms, 100ms, 50ms, 100ms)
- ✅ AUDIO: Low warning tone (200 Hz, 150ms)
- ✅ VOICE: "Error. Please check your payment method and try again"

#### 3. **Warning Feedback**
```tsx
feedback.warning('Cart limit', 'Maximum 10 items per order');
```

**Provides:**
- ✅ VISUAL: Yellow warning triangle + warning message
- ✅ HAPTIC: Double medium pulse (80ms, 40ms, 80ms)
- ✅ AUDIO: Medium cautionary tone (600 Hz, 100ms)
- ✅ VOICE: "Warning. Maximum 10 items per order"

#### 4. **Info Feedback**
```tsx
feedback.info('Location updated', 'Delivery address changed to home');
```

**Provides:**
- ✅ VISUAL: Blue info icon + info message
- ✅ HAPTIC: Single gentle pulse (60ms)
- ✅ AUDIO: Neutral tone (500 Hz, 80ms)
- ✅ VOICE: "Notification. Delivery address changed to home"

### Button Interaction Feedback

All `AccessibleButton` components automatically provide multimodal feedback:

```tsx
<AccessibleButton onClick={handleSubmit} variant="primary">
  Submit Order
</AccessibleButton>
```

**On Press:**
- ✅ VISUAL: Button press animation + active state
- ✅ HAPTIC: Quick tap vibration (10ms)
- ✅ AUDIO: Brief click sound (300 Hz, 20ms)
- ✅ VOICE: (VoiceGuide announcement if wrapped)

### Custom Multimodal Alerts

```tsx
import { MultimodalAlert } from './components/MultimodalFeedback';

<MultimodalAlert
  type="error"
  title="Connection Lost"
  message="Unable to connect to server. Please check your internet connection."
  icon="📡"
  onDismiss={() => setShowAlert(false)}
/>
```

**Automatically provides all 4 channels of feedback when displayed.**

## Feedback Patterns

### Haptic Vibration Patterns

Different vibration patterns communicate different types of feedback:

| Action Type | Pattern (ms) | Description |
|-------------|--------------|-------------|
| **Tap** | `[10]` | Quick confirmation |
| **Long Press** | `[50, 20, 50, 20, 50]` | Triple pulse |
| **Success** | `[50, 30, 50]` | Double gentle tap |
| **Error** | `[100, 50, 100, 50, 100]` | Urgent triple pulse |
| **Warning** | `[80, 40, 80]` | Medium double pulse |
| **Info** | `[60]` | Single gentle pulse |
| **Swipe** | `[30]` | Light swipe confirmation |

### Audio Frequencies

Different sound frequencies indicate different notification types:

| Type | Frequency | Duration | Tone |
|------|-----------|----------|------|
| **Success** | 800 Hz | 100ms | High, pleasant |
| **Error** | 200 Hz | 150ms | Low, attention-grabbing |
| **Warning** | 600 Hz | 100ms | Medium, cautionary |
| **Info** | 500 Hz | 80ms | Neutral, informative |
| **Tap** | 300 Hz | 20ms | Brief click |

### Visual Indicators

Each feedback type has distinct visual styling:

#### Success
- **Color**: Green (`bg-green-50`, `text-green-800` / High contrast: `bg-gray-800`, `text-yellow-400`)
- **Icon**: ✓ (checkmark)
- **Border**: Green border

#### Error
- **Color**: Red (`bg-red-50`, `text-red-800` / High contrast: `bg-gray-900`, `text-red-400`)
- **Icon**: ✕ (X mark)
- **Border**: Red border

#### Warning
- **Color**: Yellow (`bg-yellow-50`, `text-yellow-800` / High contrast: `bg-gray-800`, `text-yellow-400`)
- **Icon**: ⚠ (warning triangle)
- **Border**: Yellow border

#### Info
- **Color**: Blue (`bg-blue-50`, `text-blue-800` / High contrast: `bg-gray-800`, `text-blue-400`)
- **Icon**: ℹ (info symbol)
- **Border**: Blue border

## Integration Examples

### 1. Add to Cart (EnhancedMenuScreen)

```tsx
const handleAddToCart = (item) => {
  // MULTIMODAL FEEDBACK - All channels simultaneously
  toast.success(
    `${item.name} added to cart`,
    `${item.name} for ${item.price} has been added to your cart`
  );
  
  // This triggers:
  // ✅ VISUAL: Toast notification with green checkmark
  // ✅ HAPTIC: Success vibration pattern (if enabled)
  // ✅ AUDIO: Success beep sound
  // ✅ VOICE: "Success. Chicken biryani for Rs. 450 added to your cart"
};
```

### 2. Form Validation (CheckoutScreen)

```tsx
const handleSubmit = () => {
  if (!isValid) {
    // MULTIMODAL ERROR FEEDBACK
    toast.error(
      'Missing information',
      'Please fill in all required fields before proceeding'
    );
    
    // Provides:
    // ✅ VISUAL: Red error toast with X icon
    // ✅ HAPTIC: Error vibration (triple pulse)
    // ✅ AUDIO: Low warning beep
    // ✅ VOICE: "Error. Please fill in all required fields"
  }
};
```

### 3. Screen Load Announcement

```tsx
import { useFeedbackOnMount } from './components/MultimodalFeedback';

function MenuScreen() {
  // Announces screen on mount with multimodal feedback
  useFeedbackOnMount(
    'Restaurant menu loaded. Browse items and add them to your cart.',
    'info',
    500
  );
  
  return <div>...</div>;
}
```

### 4. Interactive Button

```tsx
import { MultimodalButton } from './components/MultimodalFeedback';

<MultimodalButton
  feedbackType="success"
  onClick={handlePlaceOrder}
  className="..."
>
  Place Order
</MultimodalButton>
```

## Feedback Indicator Component

Shows users which feedback modes are currently active:

```tsx
import { FeedbackIndicator } from './components/MultimodalFeedback';

<FeedbackIndicator />
```

**Displays:**
- 👁️ **Visual** (Always active) - "Icons and text"
- 📳 **Haptic** (Active if enabled) - "Vibrations"  
- 🔊 **Voice** (Active if enabled) - "Audio announcements"

## Accessibility Settings Integration

The multimodal feedback system respects user preferences:

### Haptic Feedback Setting

```tsx
// User enables haptic feedback in settings
settings.hapticFeedback = true;

// Now ALL interactions provide:
// ✅ Visual feedback (always)
// ✅ Haptic feedback (vibrations)
// ✅ Audio feedback (beeps)
// ✅ Voice feedback (announcements, if voice guide enabled)
```

### Voice Guide Setting

```tsx
// User enables voice guide in settings
settings.voiceGuide = true;

// Voice announcements are added to feedback:
feedback.success('Order placed');
// Speaks: "Success. Order placed"
```

### High Contrast Mode

```tsx
// User enables high contrast
settings.colorMode = 'high-contrast';

// Visual feedback uses high contrast colors:
// - Yellow text on dark backgrounds
// - Thicker borders
// - Enhanced icons
// + All other feedback channels remain active
```

## Best Practices

### ✅ DO

1. **Always provide multiple feedback channels**
   ```tsx
   // GOOD: Visual + Haptic + Audio + Voice
   feedback.success('Saved', 'Changes saved successfully');
   ```

2. **Use appropriate feedback types**
   ```tsx
   // GOOD: Match feedback type to action
   feedback.error('Failed', 'Unable to save changes');
   feedback.success('Done', 'Order placed successfully');
   ```

3. **Provide detailed messages**
   ```tsx
   // GOOD: Short title + detailed description
   feedback.warning(
     'Cart limit',
     'You can add maximum 10 items per order'
   );
   ```

4. **Include haptic indicators in visual feedback**
   ```tsx
   // The MultimodalAlert component shows when haptic is active
   {settings.hapticFeedback && (
     <p className="text-sm mt-2">
       <span aria-hidden="true">📳</span>
       Device vibration active
     </p>
   )}
   ```

### ❌ DON'T

1. **Never rely on haptic alone**
   ```tsx
   // BAD: Only vibration, no visual/audio
   navigator.vibrate(100);
   ```

2. **Never rely on audio alone**
   ```tsx
   // BAD: Only beep, no visual/haptic
   playBeep(800, 100);
   ```

3. **Never rely on visual alone for critical feedback**
   ```tsx
   // BAD: Only showing text without haptic/audio
   <div>Error occurred</div>
   ```

4. **Don't use vague messages**
   ```tsx
   // BAD: Not descriptive enough
   feedback.error('Error', 'Something went wrong');
   
   // GOOD: Specific and actionable
   feedback.error('Payment Failed', 'Card declined. Please try another payment method');
   ```

## Testing Multimodal Feedback

### 1. Test Visual Feedback
- ✅ Icons display correctly
- ✅ Text is readable
- ✅ Colors have sufficient contrast
- ✅ Animations are smooth

### 2. Test Haptic Feedback
```tsx
// Enable haptic feedback in settings
settings.hapticFeedback = true;

// Trigger actions and feel vibrations
// Test on physical mobile devices (vibration not available in simulators)
```

### 3. Test Audio Feedback
```tsx
// Check different notification types
feedback.success('Test');  // Should play high tone
feedback.error('Test');    // Should play low tone
feedback.warning('Test');  // Should play medium tone
```

### 4. Test Voice Feedback
```tsx
// Enable voice guide
settings.voiceGuide = true;

// Trigger feedback and listen for announcements
feedback.info('Test', 'This should be spoken out loud');
```

### 5. Test Combinations
- High Contrast + Haptic
- Voice Guide + Haptic
- All features enabled simultaneously
- All features disabled (should still have visual + basic audio)

## Performance Considerations

### 1. Audio Context Cleanup
```tsx
// Audio contexts are properly cleaned up after use
useEffect(() => {
  return () => {
    audioContext.close();
  };
}, []);
```

### 2. Vibration Debouncing
```tsx
// Rapid button presses don't cause excessive vibrations
// Built-in 10ms delay prevents vibration spam
```

### 3. Voice Announcement Interruption
```tsx
// New announcements interrupt old ones
// Prevents announcement backlog
window.speechSynthesis.cancel();
```

## Browser and Device Support

### Haptic Feedback (Vibration API)
- ✅ Chrome/Edge (Android)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ❌ Safari (iOS) - No vibration API support
- ⚠️ Desktop browsers - No vibration hardware

**Fallback:** Visual and audio feedback always work, even without haptic support.

### Audio Feedback (Web Audio API)
- ✅ All modern browsers
- ✅ Desktop and mobile
- ✅ iOS Safari
- ✅ Android Chrome

### Voice Feedback (Speech Synthesis API)
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop)
- ⚠️ Voice quality varies by platform

## Reduced Motion Support

The system respects `prefers-reduced-motion`:

```tsx
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip audio beeps
  // Reduce vibration intensity
  // Disable animations
}
```

## WCAG 2.1 Compliance

### Success Criterion 1.3.3 (Level A): Sensory Characteristics

✅ **Compliant** - Instructions and feedback do not rely solely on:
- Shape, size, visual location (not just visual)
- Sound (also provides visual and haptic)
- Color (uses icons and text in addition to color)

### Success Criterion 2.5.2 (Level A): Pointer Cancellation

✅ **Compliant** - Button actions complete on `click` event (up-event), not `mousedown`

### Success Criterion 1.4.1 (Level A): Use of Color

✅ **Compliant** - Color is not the only means of conveying information:
- Success: Green + ✓ icon + "Success" text + beep + vibration
- Error: Red + ✕ icon + "Error" text + beep + vibration

## Summary

The FoodPapa multimodal feedback system ensures that **NO feedback is ever provided through a single channel**. When haptic feedback is enabled, users receive:

1. **VISUAL**: Icons, text, colors (ALWAYS)
2. **HAPTIC**: Vibrations (when enabled)
3. **AUDIO**: Beeps and tones (context-dependent)
4. **VOICE**: Announcements (when voice guide enabled)

This approach makes the app accessible to users with various disabilities and preferences, ensuring everyone receives feedback through channels they can perceive.
