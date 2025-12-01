# Voice Guide Integration Guide

## Overview

The FoodPapa app now includes a comprehensive Voice Guide system that provides audio explanations for all interactive elements, making the app accessible to users with visual impairments and those who prefer audio navigation.

## Key Features

### 1. **Automatic Voice Activation**

Voice Guide is **automatically enabled** in the following scenarios:

- **Initial Setup Screens** - Voice guide works from the very first screen, even before users make any accessibility choices
- **After Voice Guide Selection** - When users explicitly enable "Voice Guide" in settings
- **High Contrast Mode** - Automatically enabled when users select high-contrast mode

### 2. **Web Speech API Integration**

The system uses the browser's built-in Web Speech API (`speechSynthesis`) to provide:

- Clear, natural-sounding voice announcements
- Optimized speech rate (0.9x) for better comprehension
- Support for VoiceOver (iOS) and TalkBack (Android) compatibility

### 3. **Smart Activation Logic**

```typescript
// Voice is enabled if:
const isVoiceEnabled = 
  isInitialSetup ||                        // Before user makes choices
  settings.voiceGuide ||                   // User enabled voice guide
  settings.colorMode === 'high-contrast';  // High contrast mode
```

## Components

### VoiceGuide Component

Wraps interactive elements to provide automatic voice announcements on focus and optionally on hover.

**Usage:**

```tsx
import { VoiceGuide } from './VoiceGuide';

<VoiceGuide text="This button adds your food to cart">
  <button onClick={handleAddToCart}>Add to Cart</button>
</VoiceGuide>
```

**Props:**

- `text`: The voice announcement text (required)
- `onFocus`: Enable voice on focus (default: true)
- `onHover`: Enable voice on hover (default: false)
- `delay`: Delay before speaking in ms (default: 300)

### useVoiceAnnouncement Hook

Provides programmatic voice announcements for events and state changes.

**Usage:**

```tsx
import { useVoiceAnnouncement } from './VoiceGuide';

function MyComponent() {
  const { announce, stop, isEnabled } = useVoiceAnnouncement();
  
  const handleAction = () => {
    announce('Order placed successfully');
  };
  
  return <button onClick={handleAction}>Place Order</button>;
}
```

**Methods:**

- `announce(text, interrupt?)`: Speaks the provided text
- `stop()`: Stops current speech
- `isEnabled`: Boolean indicating if voice is enabled

### VoiceButton Component

Pre-configured button component with voice guide.

**Usage:**

```tsx
import { VoiceButton } from './VoiceGuide';

<VoiceButton 
  voiceText="Add chicken biryani to cart" 
  onClick={handleAdd}
>
  Add to Cart
</VoiceButton>
```

## Implementation Examples

### 1. Welcome Setup Screen

All options include detailed voice explanations:

```tsx
<VoiceGuide text="Large text size option. Select this for easier reading with larger text throughout the app.">
  <button onClick={() => handleTextSizeChange('large')}>
    Large Text
  </button>
</VoiceGuide>
```

### 2. Login Screen

Announces screen purpose on load and guides through actions:

```tsx
useEffect(() => {
  announce('Welcome to FoodPapa login screen. You can continue as a guest...');
}, []);

<VoiceGuide text="Continue as guest button. No account needed. This will let you start ordering food immediately.">
  <AccessibleButton onClick={onContinueAsGuest}>
    Continue as Guest
  </AccessibleButton>
</VoiceGuide>
```

### 3. Menu Screen

Announces when items are added to cart:

```tsx
const handleAddToCart = (item) => {
  toast.success(
    `${item.name} added to cart`,
    `${item.name} for ${item.price} has been added to your cart`
  );
  // This triggers voice announcement via AccessibleToast
};
```

## Screen Announcements

Each major screen announces its purpose when loaded:

### Welcome Setup Screen
- **Step 1**: "Welcome to FoodPapa. Setup step 1 of 3. Choose your preferred text size..."
- **Step 2**: "Setup step 2 of 3. Choose your color mode..."
- **Step 3**: "Setup step 3 of 3. Enable helpful features..."

### Login Screen
- "Welcome to FoodPapa login screen. You can continue as a guest without signing in, or sign in with your phone number..."

## Accessibility Context Integration

The `AccessibilityContext` now tracks initial setup state:

```tsx
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings) => void;
  resetSettings: () => void;
  isInitialSetup: boolean;      // NEW
  completeSetup: () => void;     // NEW
}
```

### Setup Completion

Call `completeSetup()` when user finishes initial setup:

```tsx
const { completeSetup } = useAccessibility();

const handleComplete = () => {
  completeSetup(); // Disables automatic voice guide
  onComplete();
};
```

## Voice Guide Examples by Screen

### WelcomeSetupScreen ✅
- Text size options (Small, Medium, Large)
- Color mode options (Light, High Contrast)
- Assistance features (Voice Guide, Haptic Feedback, Simplified Navigation)
- Navigation buttons (Next, Skip)

### LoginScreen ✅
- Continue as Guest button
- Sign in with Phone button
- Change Number button

### LocationSelectionScreen (Recommended)
```tsx
<VoiceGuide text="Use current location button. This will automatically detect your location using GPS.">
  <button onClick={useCurrentLocation}>📍 Use Current Location</button>
</VoiceGuide>
```

### EnhancedMenuScreen ✅
- Add to cart actions (via toast notifications)
- Item descriptions on focus

### CheckoutScreen ✅
- Form validation errors (via accessible toast)

## Best Practices

### 1. **Clear, Concise Descriptions**
```tsx
// ❌ Too short
<VoiceGuide text="Add button">

// ✅ Descriptive and helpful
<VoiceGuide text="Add chicken biryani to cart button. Press to add this item.">
```

### 2. **Context-Aware Announcements**
```tsx
// Provide different text based on state
<VoiceGuide text={
  isDisabled 
    ? "Add to cart button. Please fill in required fields first."
    : "Add to cart button. This will add the item to your shopping cart."
}>
```

### 3. **Action-Oriented Language**
```tsx
// ❌ Passive description
<VoiceGuide text="This is the sign in button">

// ✅ Action-oriented
<VoiceGuide text="Sign in button. Press to sign in with your phone number.">
```

### 4. **Screen Context Announcements**
```tsx
useEffect(() => {
  setTimeout(() => {
    announce('Restaurant menu screen. Browse items and add them to your cart.');
  }, 500);
}, []);
```

## Testing Voice Guide

### 1. **Enable Voice Guide**
- Complete welcome setup and enable "Voice Guide"
- OR select "High Contrast Mode"

### 2. **Test Navigation**
- Tab through interactive elements
- Listen for voice announcements on focus
- Hover over buttons (if onHover enabled)

### 3. **Test Announcements**
- Trigger actions (add to cart, place order)
- Listen for toast notification announcements
- Check screen load announcements

### 4. **Screen Reader Compatibility**
- Test with VoiceOver (Mac/iOS): Cmd+F5
- Test with TalkBack (Android): Settings > Accessibility
- Test with NVDA (Windows): Free download

## Browser Support

### Supported Browsers
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop)
- ⚠️ Opera (Desktop)

### Fallback Behavior
When Speech Synthesis is unavailable:
```typescript
if (!('speechSynthesis' in window)) {
  console.log('Voice Guide:', text); // Logs to console
  return;
}
```

## Integration with Notification System

Voice Guide works seamlessly with the accessible notification system:

```tsx
// Accessible toast automatically announces
const toast = useAccessibleToast();

toast.success(
  'Order placed',                    // Short message
  'Your order has been placed',      // Detailed announcement
  { playSound: true }                 // Additional audio cue
);
```

## Performance Considerations

### 1. **Debouncing**
Voice Guide includes built-in delay (default 300ms) to prevent announcement spam.

### 2. **Speech Cancellation**
Previous speech is automatically cancelled when new speech starts.

### 3. **Cleanup on Unmount**
```typescript
useEffect(() => {
  return () => {
    window.speechSynthesis.cancel(); // Cancel on unmount
  };
}, []);
```

## Customization

### Adjust Speech Rate
```typescript
utterance.rate = 0.9;  // 0.1 to 10 (default: 1.0)
utterance.pitch = 1.0; // 0 to 2 (default: 1.0)
utterance.volume = 1.0; // 0 to 1 (default: 1.0)
```

### Change Voice Language
```typescript
utterance.lang = 'en-US'; // English (US)
// Other options: 'ur-PK' (Urdu), 'en-GB' (British), etc.
```

## Future Enhancements

### Planned Features
1. **Multi-language Support** - Urdu voice guide
2. **Voice Speed Control** - User-adjustable speech rate
3. **Voice Selection** - Choose from available system voices
4. **Offline Support** - Pre-recorded audio files
5. **Smart Interruption** - Context-aware speech interruption

### Additional Screens to Integrate
- [ ] LocationSelectionScreen
- [ ] RestaurantListScreen
- [ ] SearchFilterScreen
- [ ] OrderHistoryScreen
- [ ] ProfileScreen
- [ ] SettingsScreen
- [ ] HelpSupportScreen
- [ ] OrderTrackingScreen

## Conclusion

The Voice Guide system ensures FoodPapa is accessible from the very first screen, providing comprehensive audio support for all users, especially those with visual impairments or low literacy levels. The system is designed to be non-intrusive for users who don't need it while being immediately available for those who do.
