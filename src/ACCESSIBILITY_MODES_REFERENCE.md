# Accessibility Modes Quick Reference

## Overview
FoodPapa implements a **smart accessibility system** that adapts visual features based on user preferences, ensuring enhanced features are available to those who need them without overwhelming others.

## Activation Modes

### 🔷 Regular Mode (Default)
**Activated when:**
- User has NOT enabled High-Contrast Mode
- User has NOT enabled Voice Guide

**Features:**
- Standard 2px focus outlines
- Normal button styling
- No skip links
- No focus animations
- Clean, minimal interface
- Full ARIA support (always on)

**Target Users:**
- General users
- Users with no visual impairments
- Users who prefer minimal UI

---

### 🟦 Accessibility Enhanced Mode
**Activated when:**
- User enables **High-Contrast Mode**, OR
- User enables **Voice Guide**, OR
- User enables **Simplified Navigation**

**Features:**
- 4-5px thick focus outlines
- Double-layer shadow effects on focus
- Pulse animations (1.5s cycle)
- Skip to main content link
- Enhanced button offsets (3-4px)
- **44x44px minimum touch targets** (WCAG AAA)
- **8px spacing between interactive elements**
- All regular features +

**Target Users:**
- Users with visual impairments
- Users with low vision
- Users using screen readers
- Senior citizens
- Users with motor impairments
- Users who need larger touch targets
- Users who need extra visual feedback

---

## CSS Class System

### Root Classes Applied Automatically

```tsx
// In AccessibilityContext.tsx

// Color mode classes
if (colorMode === 'dark') {
  document.documentElement.classList.add('dark');
} else if (colorMode === 'high-contrast') {
  document.documentElement.classList.add('high-contrast');
}

// Accessibility enhancement class
if (colorMode === 'high-contrast' || voiceGuide || simplifiedNavigation) {
  document.documentElement.classList.add('accessibility-enhanced');
}
```

### Class Combinations

| User Settings | Classes Applied | Mode |
|--------------|----------------|------|
| Default | (none) | Regular |
| Voice Guide ON | `accessibility-enhanced` | Enhanced |
| Simplified Navigation ON | `accessibility-enhanced` | Enhanced |
| High Contrast ON | `high-contrast`, `accessibility-enhanced` | Enhanced + HC |
| Dark Mode ON | `dark` | Regular (dark theme) |
| Dark + Voice Guide | `dark`, `accessibility-enhanced` | Enhanced (dark) |
| Dark + Simplified Nav | `dark`, `accessibility-enhanced` | Enhanced (dark) |
| High Contrast + Voice Guide | `high-contrast`, `accessibility-enhanced` | Enhanced + HC |
| Any 2+ accessibility features | (combined classes) | Enhanced |

---

## Feature Matrix

### Visual Features

| Feature | Regular Mode | Enhanced Mode | High-Contrast Enhanced |
|---------|-------------|---------------|----------------------|
| Focus Ring Width | 2px | 4px | 5px |
| Focus Offset | 2px | 2-3px | 3-4px |
| Shadow Effects | ❌ | ✅ Double-layer | ✅ Triple-layer |
| Pulse Animation | ❌ | ✅ | ✅ |
| Skip Link | ❌ | ✅ | ✅ |
| Touch Target Size | Variable | 44x44px min | 44x44px min |
| Element Spacing | Variable | 8px min | 8px min |
| Border Thickness | 2px | 2px | 3-4px |
| Focus Colors | Purple | Purple | Blue on Yellow |

### Interaction Features

| Feature | Regular Mode | Enhanced Mode |
|---------|-------------|---------------|
| ARIA Labels | ✅ | ✅ |
| Screen Reader Support | ✅ | ✅ Optimized |
| Keyboard Navigation | ✅ | ✅ Enhanced |
| Touch Targets (44x44px) | ✅ | ✅ |
| Color Contrast (WCAG AA) | ✅ | ✅ AAA |
| Text Size Options | ✅ | ✅ |
| Voice Announcements | ❌ | ✅ (if enabled) |
| Haptic Feedback | ✅ | ✅ |

---

## User Journey Examples

### Example 1: New User (Regular Mode)
```
1. Opens FoodPapa
2. Sees welcome screen
3. Clicks "Continue as Guest"
4. Uses app with standard focus (2px outlines)
5. Clean, modern interface
6. No accessibility overhead
```

### Example 2: Senior Citizen (Enhanced Mode)
```
1. Opens FoodPapa
2. Completes setup wizard
3. Selects "Large Text" + "High Contrast"
4. App automatically activates accessibility-enhanced
5. Sees 5px blue focus rings on yellow background
6. Pulse animations help locate focused element
7. Skip link available for quick navigation
8. Enhanced visual feedback throughout
```

### Example 3: Partially Sighted User (Enhanced Mode)
```
1. Opens FoodPapa
2. Goes to Settings
3. Enables "Voice Guide" (keeps light mode)
4. App activates accessibility-enhanced
5. Gets 4px purple focus rings with shadows
6. Hears voice announcements for actions
7. Pulse animations + audio = clear feedback
8. Can navigate confidently
```

---

## Developer Guidelines

### Adding New Features

When adding new interactive elements, ensure they work in both modes:

#### ✅ Good Practice
```tsx
// Focus styles will automatically adapt based on mode
<button 
  onClick={handleClick}
  aria-label="Add to cart"
>
  Add to Cart
</button>
```

The global CSS will handle:
- Regular mode: 2px outline
- Enhanced mode: 4px outline + shadows
- High-contrast enhanced: 5px blue outline

#### ❌ Avoid
```tsx
// Don't apply custom focus styles that override the system
<button 
  onClick={handleClick}
  className="focus:outline-none focus:ring-1"
>
  Add to Cart
</button>
```

### Testing Checklist

For every new component, test in all modes:

- [ ] **Regular Mode**: Focus visible but not intrusive
- [ ] **Enhanced Mode**: 4px ring, shadows, animation
- [ ] **High-Contrast Enhanced**: 5px blue ring, thick borders
- [ ] **Dark Enhanced**: Focus visible on dark background
- [ ] **Keyboard Navigation**: Tab order logical
- [ ] **Screen Reader**: ARIA labels announce correctly

### CSS Pattern

Use this pattern for mode-specific styling:

```css
/* Base styles - work in all modes */
.my-component {
  padding: 1rem;
  background: white;
}

/* Enhanced mode only */
.accessibility-enhanced .my-component:focus-visible {
  outline: 4px solid var(--focus-ring);
  box-shadow: 0 0 0 2px white, 0 0 0 6px var(--focus-ring);
}

/* High-contrast + enhanced mode */
.high-contrast.accessibility-enhanced .my-component:focus-visible {
  outline: 5px solid var(--focus-ring);
  border-width: 3px;
}
```

---

## Settings Integration

### How Settings Trigger Modes

```tsx
// User changes settings
updateSettings({ colorMode: 'high-contrast' });
// → AccessibilityContext detects change
// → Adds 'high-contrast' class to document root
// → Adds 'accessibility-enhanced' class
// → All focus styles automatically update
// → Skip link becomes available
// → Animations activate

updateSettings({ voiceGuide: true });
// → AccessibilityContext detects change
// → Adds 'accessibility-enhanced' class
// → Focus styles enhance
// → Voice announcements begin
// → Skip link becomes available
```

### Persisting User Preferences

Currently implemented in context, can be extended to localStorage:

```tsx
// Save to localStorage
useEffect(() => {
  localStorage.setItem('foodpapa-accessibility', JSON.stringify(settings));
}, [settings]);

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('foodpapa-accessibility');
  if (saved) {
    setSettings(JSON.parse(saved));
  }
}, []);
```

---

## Performance Considerations

### Why Conditional Activation?

1. **Performance**: Enhanced features (animations, shadows) have minimal but measurable rendering cost
2. **User Experience**: Regular users don't need or expect thick focus rings
3. **Visual Clarity**: Prevents UI clutter for those who don't need it
4. **Accessibility**: Provides maximum support only to those who request it

### CSS Specificity

The system uses CSS specificity to ensure proper cascading:

```
Default focus (2px)
  ↓
.accessibility-enhanced focus (4px)
  ↓
.high-contrast.accessibility-enhanced focus (5px)
```

This ensures the most specific styles win without !important.

---

## Troubleshooting

### Issue: Focus indicators not showing
**Check:**
1. Is high-contrast or voice guide enabled?
2. Is `accessibility-enhanced` class on `<html>` element?
3. Browser DevTools → Check computed styles

### Issue: Focus rings too subtle
**Solution:** Enable High-Contrast Mode in Settings
- Go to Profile → Settings → Display → High Contrast Mode

### Issue: Focus rings too prominent
**Solution:** This is expected in Enhanced Mode
- If user didn't intend to enable it, they can:
  - Disable Voice Guide
  - Switch from High-Contrast to Light/Dark mode

### Issue: Skip link not appearing
**Check:**
1. Is accessibility-enhanced mode active?
2. Press Tab key (keyboard navigation)
3. Check if display: none is overridden somewhere

---

## API Reference

### AccessibilityContext

```tsx
const { settings, updateSettings } = useAccessibility();

// Check if enhanced mode is active
const isEnhanced = 
  settings.colorMode === 'high-contrast' || 
  settings.voiceGuide;

// Update settings
updateSettings({ 
  colorMode: 'high-contrast',  // Activates enhanced mode
  voiceGuide: true,             // Also activates enhanced mode
  textSize: 'large'             // Doesn't affect enhanced mode
});
```

### CSS Variables

```css
/* Focus colors */
--focus-ring: #7c3aed;           /* Light/Dark mode */
--focus-ring: #0000ff;           /* High-contrast mode */
--focus-ring-offset: #ffffff;    /* Light mode */
--focus-ring-offset: #ffff00;    /* High-contrast mode */
```

---

## Summary

FoodPapa's accessibility system is **intelligent and respectful**:
- ✅ Doesn't assume all users need accessibility features
- ✅ Provides standard experience by default
- ✅ Automatically enhances when user opts-in
- ✅ Combines multiple preferences intelligently
- ✅ Maintains WCAG compliance in all modes
- ✅ Zero configuration required by developers
- ✅ Automatic, context-aware activation

This approach ensures **the best experience for everyone** while providing **powerful support for those who need it**.
