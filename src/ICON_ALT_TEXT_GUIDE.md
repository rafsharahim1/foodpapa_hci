# Icon Alt Text & ARIA Implementation Guide

## Overview
All icons in FoodPapa must have proper accessibility attributes to ensure screen reader users understand their purpose and context.

---

## Icon Accessibility Patterns

### Pattern 1: Icons Inside Buttons with ARIA Labels

**When**: Icon is inside a button that has an `aria-label`

**Rule**: Add `aria-hidden="true"` to the icon

**Why**: The button's aria-label already describes the action; the icon is decorative

```tsx
// ✅ CORRECT
<button 
  onClick={handleClick}
  aria-label="Add chicken biryani to cart, price 450 rupees"
>
  <ShoppingCart className="w-6 h-6" aria-hidden="true" />
  Add to Cart
</button>

// ❌ WRONG - Icon not marked as decorative
<button 
  onClick={handleClick}
  aria-label="Add to cart"
>
  <ShoppingCart className="w-6 h-6" />
  Add to Cart
</button>
```

### Pattern 2: Standalone Decorative Icons

**When**: Icon is purely decorative (next to text that describes the same thing)

**Rule**: Add `aria-hidden="true"`

**Why**: Screen reader would announce redundant information

```tsx
// ✅ CORRECT - Error message icon
{errors.phoneNumber && (
  <div className="text-red-500 flex items-center gap-1" role="alert">
    <AlertCircle className="w-4 h-4" aria-hidden="true" />
    {errors.phoneNumber}
  </div>
)}

// ✅ CORRECT - Navigation icon
<button aria-label="Go to Home">
  <Home className="w-7 h-7" aria-hidden="true" />
  <span>Home</span>
</button>
```

### Pattern 3: Standalone SVG Icons (Custom Icons.tsx)

**When**: Custom SVG icons in Icons.tsx file

**Rule**: Add `role="img"`, `aria-label`, and `<title>` element

**Why**: Provides context when icon is used standalone

```tsx
// ✅ CORRECT
export function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="Microphone"
    >
      <title>Microphone</title>
      <path d="..." />
    </svg>
  );
}
```

### Pattern 4: Logo Images

**When**: Using `<img>` tags for logos or meaningful images

**Rule**: Always include descriptive `alt` text

**Why**: Screen readers need to understand what the image represents

```tsx
// ✅ CORRECT
<img 
  src={logoImage} 
  alt="FoodPapa Logo" 
  className="w-12 h-12" 
/>

// ❌ WRONG - Missing alt text
<img 
  src={logoImage} 
  className="w-12 h-12" 
/>

// ❌ WRONG - Empty alt for meaningful image
<img 
  src={logoImage} 
  alt="" 
  className="w-12 h-12" 
/>
```

### Pattern 5: ImageWithFallback Component

**When**: Using the ImageWithFallback component for food/restaurant images

**Rule**: Always include descriptive `alt` prop

```tsx
// ✅ CORRECT
<ImageWithFallback
  src={restaurantImage}
  alt="Savory Restaurant exterior showing outdoor seating"
  className="w-full h-48 object-cover"
/>

// ✅ CORRECT - Food item
<ImageWithFallback
  src={itemImage}
  alt="Chicken Biryani with aromatic rice and spices"
  className="w-24 h-24 rounded-lg"
/>

// ❌ WRONG - Generic alt text
<ImageWithFallback
  src={itemImage}
  alt="Food"
  className="w-24 h-24"
/>
```

### Pattern 6: Icons in Navigation

**When**: Icons in bottom navigation or tabs

**Rule**: `aria-hidden="true"` on icon, descriptive `aria-label` on button/link

```tsx
// ✅ CORRECT
<button
  onClick={onNavigateToCart}
  aria-label={`Go to Cart (${cartCount} items)`}
  aria-current={isActive ? 'page' : undefined}
>
  <ShoppingCart className="w-7 h-7" aria-hidden="true" />
  <span>Cart</span>
</button>
```

### Pattern 7: Icons in Form Labels/Inputs

**When**: Icons appear with form fields

**Rule**: Icon should be `aria-hidden="true"`, label provides context

```tsx
// ✅ CORRECT
<label className="flex items-center gap-2">
  <MapPin className="w-5 h-5" aria-hidden="true" />
  <span>Delivery Address</span>
</label>
<input 
  type="text"
  aria-label="Enter delivery address"
  placeholder="Street address"
/>
```

### Pattern 8: Badges/Counters with Icons

**When**: Notification badges or counters

**Rule**: Badge should have `role="status"` and `aria-label`

```tsx
// ✅ CORRECT
<div className="relative">
  <ShoppingCart className="w-7 h-7" aria-hidden="true" />
  {cartCount > 0 && (
    <div 
      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full"
      role="status"
      aria-label={`${cartCount} items in cart`}
    >
      {cartCount}
    </div>
  )}
</div>
```

---

## Component-Specific Requirements

### CheckoutScreen.tsx

**Error Icons**: All `<AlertCircle>` icons in error messages

```tsx
// Update all instances like this:
{errors.fieldName && (
  <div className="text-red-500 flex items-center gap-1" role="alert">
    <AlertCircle className="w-4 h-4" aria-hidden="true" />
    {errors.fieldName}
  </div>
)}
```

**Payment Icons**: `<CreditCard>` icon

```tsx
<CreditCard className="w-5 h-5" aria-hidden="true" />
```

**Chevron Icons**: `<ChevronDown>`, `<ChevronUp>`

```tsx
<ChevronDown className="w-5 h-5" aria-hidden="true" />
```

**Location Icons**: `<MapPin>`

```tsx
<button aria-label="Use current GPS location">
  <MapPin className="w-6 h-6" aria-hidden="true" />
  Use Current Location
</button>
```

### HomeScreen.tsx / EnhancedHomeScreen.tsx

**Category Icons**:
```tsx
<button aria-label="Filter by Biryani category">
  <Restaurant className="w-6 h-6" aria-hidden="true" />
  Biryani
</button>
```

**Search Icons**:
```tsx
<button aria-label="Search restaurants and food">
  <Search className="w-6 h-6" aria-hidden="true" />
</button>
```

### ProfileScreen.tsx

**Menu Icons**: All icons in profile menu items

```tsx
<button aria-label="View order history">
  <History className="w-6 h-6" aria-hidden="true" />
  <span>Order History</span>
</button>

<button aria-label="Open settings">
  <Settings className="w-6 h-6" aria-hidden="true" />
  <span>Settings</span>
</button>
```

### SettingsScreen.tsx

**Toggle Icons**: Icons next to settings

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <Moon className="w-6 h-6" aria-hidden="true" />
    <span>Dark Mode</span>
  </div>
  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
</div>
```

### OrderTrackingScreen.tsx

**Status Icons**: Icons showing order status

```tsx
<div className="flex items-center gap-2">
  <CheckCircle className="w-6 h-6 text-green-500" aria-hidden="true" />
  <span>Order Confirmed</span>
</div>
```

### RestaurantListScreen.tsx

**Star/Rating Icons**:
```tsx
<div className="flex items-center gap-1">
  <Star className="w-4 h-4 fill-yellow-400" aria-hidden="true" />
  <span>{rating}</span>
</div>
```

### MenuScreen.tsx

**Dietary Icons**:
```tsx
<div className="flex gap-1" aria-label="Vegetarian option">
  <Leaf className="w-4 h-4 text-green-500" aria-hidden="true" />
</div>
```

---

## Checklist for Developers

When adding a new icon, ask yourself:

### 1. Is the icon inside a button/link with an aria-label?
- **Yes**: Add `aria-hidden="true"` to icon
- **No**: Continue to #2

### 2. Is there text next to the icon that says the same thing?
- **Yes**: Add `aria-hidden="true"` to icon
- **No**: Continue to #3

### 3. Is the icon conveying unique information?
- **Yes**: Add `aria-label` to a parent element or the icon itself
- **No**: Add `aria-hidden="true"`

### 4. Is it an image (not an icon)?
- **Yes**: Add descriptive `alt` text
- **No**: Follow patterns above

---

## Testing

### Screen Reader Test

1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through the component
3. Listen for:
   - ✅ Button labels are clear ("Add to cart" not "Add graphic to cart graphic")
   - ✅ No redundant announcements
   - ✅ Images have meaningful descriptions
   - ❌ Icons aren't announced separately when they're decorative

### Example Test Results

**Before (Wrong)**:
```
Screen reader: "Add graphic shopping cart graphic to cart button"
```

**After (Correct)**:
```
Screen reader: "Add chicken biryani to cart, price 450 rupees button"
```

---

## Common Mistakes

### ❌ Mistake 1: No aria-hidden on decorative icons
```tsx
<button aria-label="Add to cart">
  <ShoppingCart className="w-6 h-6" />  {/* WRONG */}
</button>
```

### ✅ Fixed:
```tsx
<button aria-label="Add to cart">
  <ShoppingCart className="w-6 h-6" aria-hidden="true" />
</button>
```

### ❌ Mistake 2: Empty alt text on meaningful images
```tsx
<img src={restaurantImage} alt="" />  {/* WRONG */}
```

### ✅ Fixed:
```tsx
<img src={restaurantImage} alt="Savory Restaurant interior with modern decor" />
```

### ❌ Mistake 3: Generic alt text
```tsx
<ImageWithFallback 
  src={foodImage} 
  alt="Food item"  {/* TOO GENERIC */}
/>
```

### ✅ Fixed:
```tsx
<ImageWithFallback 
  src={foodImage} 
  alt="Chicken Tikka Masala with naan bread and basmati rice"
/>
```

### ❌ Mistake 4: Icon aria-label instead of button
```tsx
<button onClick={handleClick}>
  <Home className="w-6 h-6" aria-label="Go home" />  {/* WRONG PLACEMENT */}
</button>
```

### ✅ Fixed:
```tsx
<button onClick={handleClick} aria-label="Go home">
  <Home className="w-6 h-6" aria-hidden="true" />
</button>
```

---

## Quick Reference

| Icon Type | Pattern | Example |
|-----------|---------|---------|
| Icon in button | `aria-hidden="true"` on icon, `aria-label` on button | `<button aria-label="..."><Icon aria-hidden="true" /></button>` |
| Error icon | `aria-hidden="true"` on icon, `role="alert"` on container | `<div role="alert"><AlertCircle aria-hidden="true" />Error text</div>` |
| Navigation icon | `aria-hidden="true"` on icon | `<nav><button aria-label="..."><Icon aria-hidden="true" />Label</button></nav>` |
| Logo/Image | Descriptive `alt` text | `<img alt="FoodPapa Logo" src="..." />` |
| Custom SVG | `role="img"`, `aria-label`, `<title>` | `<svg role="img" aria-label="..."><title>...</title>...</svg>` |
| Decorative icon | `aria-hidden="true"` | `<Star className="..." aria-hidden="true" />` |

---

## Summary

### Key Principles

1. **Decorative icons** (next to text or in buttons with labels) → `aria-hidden="true"`
2. **Meaningful images** → Descriptive `alt` text
3. **Informative icons** → Parent element with `aria-label` or context
4. **SVG icons** → `role="img"` + `aria-label` + `<title>` if standalone
5. **Test with screen readers** → Ensure no redundancy

### Benefits

- ✅ Screen readers don't announce redundant information
- ✅ Users hear clear, concise labels
- ✅ Better user experience for visually impaired users
- ✅ WCAG compliance (1.1.1 Non-text Content)

---

**Status**: Implementation Required
**Priority**: High (WCAG Level A)
**Next Steps**: Systematically update all components with icon usage
