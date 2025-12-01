# Maze Analytics Integration - Setup Instructions

## Overview
Your FoodPapa app now includes Maze.co analytics integration for tracking user behavior, creating heatmaps, and analyzing accessibility feature usage.

## 🚀 Quick Setup

### Step 1: Create a Maze Account
1. Go to **https://maze.co**
2. Sign up for a free account
3. Verify your email

### Step 2: Create a New Project
1. Click **"New Project"** in Maze dashboard
2. Choose **"Web"** as the platform
3. Name your project: **"FoodPapa - Low Literacy User Testing"**

### Step 3: Get Your Project ID
1. In your Maze project, go to **Settings** → **Installation**
2. Copy your **Project ID** (it looks like: `abc123def456`)
3. Alternatively, find it in the installation snippet provided by Maze

### Step 4: Add Project ID to Your App
Open `/App.tsx` and find this line:
```tsx
<MazeAnalytics projectId="YOUR_MAZE_PROJECT_ID" />
```

Replace `YOUR_MAZE_PROJECT_ID` with your actual project ID:
```tsx
<MazeAnalytics projectId="abc123def456" />
```

### Step 5: Test the Integration
1. Open your app in the browser
2. Open Developer Console (F12)
3. Look for these messages:
   - ✅ `Maze script loaded successfully`
   - ✅ `Maze initialized with project: abc123def456`
   - 📊 `Maze event tracked: app_loaded`

## 📊 What Gets Tracked

### Automatic Tracking
The integration automatically tracks:
- **Page views** - Every screen transition
- **Accessibility settings** - Language, voice guide, color mode, text size
- **Cart updates** - Items added, removed, quantities changed
- **User preferences** - Haptic feedback, simplified navigation

### Custom Events Tracked
- `app_loaded` - Initial app load with user context
- `accessibility_settings_changed` - When users change any accessibility setting
- `page_view` - Screen navigation with language and accessibility context
- `cart_updated` - Cart changes with item counts

## 🎯 Using Custom Tracking (Optional)

You can track custom events in any component using the `useMazeTracking` hook:

```tsx
import { useMazeTracking } from '../hooks/useMazeTracking';

function YourComponent() {
  const { 
    trackButtonClick, 
    trackVoiceUsage, 
    trackTutorialStep,
    trackLanguageChange,
    trackOrderPlaced 
  } = useMazeTracking('your-screen-name');

  const handleButtonClick = () => {
    trackButtonClick('Add to Cart', true); // Button name, has voice guide
    // Your button logic...
  };

  const handleVoiceClick = () => {
    trackVoiceUsage('food-item-card', 'Chicken Biryani Rs. 450');
    // Your voice logic...
  };

  return (
    <button onClick={handleButtonClick}>
      Add to Cart
    </button>
  );
}
```

### Available Tracking Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `trackButtonClick()` | Track button/link clicks | `trackButtonClick('Checkout Button')` |
| `trackVoiceUsage()` | Track voice guide usage | `trackVoiceUsage('menu-item', 'Text spoken')` |
| `trackTutorialStep()` | Track tutorial interactions | `trackTutorialStep(2, 'completed')` |
| `trackLanguageChange()` | Track language switches | `trackLanguageChange('english', 'urdu')` |
| `trackSearch()` | Track search queries | `trackSearch('biryani', 12)` |
| `trackOrderPlaced()` | Track successful orders | `trackOrderPlaced({...orderDetails})` |
| `trackCartAction()` | Track cart modifications | `trackCartAction('add', 'Chicken Tikka')` |
| `trackSwipeGesture()` | Track swipe gestures | `trackSwipeGesture('right', 'notification')` |
| `trackAccessibilityFeature()` | Track accessibility toggles | `trackAccessibilityFeature('voiceGuide', true)` |

## 📈 Viewing Analytics in Maze

1. Go to your Maze project dashboard
2. Navigate to **"Analytics"** section
3. View:
   - **Event Timeline** - See all tracked events in chronological order
   - **User Sessions** - Watch session replays
   - **Heatmaps** - See where users click most
   - **Funnels** - Track conversion paths
   - **Custom Reports** - Filter by language, accessibility settings, etc.

## 🎨 Advanced: Creating Custom Reports

### Example: Track Urdu vs English User Behavior
1. In Maze, go to **Analytics** → **Custom Reports**
2. Create a filter: `language = "urdu"`
3. Compare metrics between language groups

### Example: Track Voice Guide Effectiveness
1. Filter events by: `voiceGuideEnabled = true`
2. Compare task completion rates
3. Analyze tutorial completion times

## 🔍 Key Metrics to Monitor

For your low-literacy user research, focus on:
- **Tutorial completion rate** - Are users finishing the tutorial?
- **Voice guide usage frequency** - How often do users click voice buttons?
- **Language preference** - Urdu vs English adoption
- **Error patterns** - Where do users struggle?
- **Cart abandonment** - Where in the flow do users drop off?
- **Accessibility feature adoption** - Which features are most used?

## 🛠️ Troubleshooting

### Maze script not loading?
- Check browser console for errors
- Verify your Project ID is correct
- Ensure you have internet connection
- Try disabling ad blockers

### Events not appearing in Maze?
- Wait 1-2 minutes for data to sync
- Check that `debug: false` in MazeAnalytics.tsx (set to `true` for verbose logging)
- Verify your Maze project is active

### Too much data / console noise?
In `/components/analytics/MazeAnalytics.tsx`, set `debug: false`:
```tsx
Maze.initMazeUniversal({
  projectId: mazeProjectId,
  debug: false, // Turn off console logging
});
```

## 🔒 Privacy & Data Collection

**Important**: For your HCI research:
- Maze tracks **anonymous** usage data by default
- No PII (personally identifiable information) is collected unless you explicitly call `identifyMazeUser()`
- All tracking is GDPR compliant
- Users can't be individually identified without explicit user IDs

**Note from FoodPapa App**:
This app is designed for accessibility research. The tracking focuses on:
- Interaction patterns (not content)
- Accessibility feature usage
- Navigation paths
- Error frequencies

## 📝 Files Created

1. `/components/analytics/MazeAnalytics.tsx` - Main integration component
2. `/hooks/useMazeTracking.ts` - Custom tracking hook with FoodPapa-specific events
3. `/MAZE_SETUP_INSTRUCTIONS.md` - This file

## 🎓 Next Steps

1. ✅ Add your Maze Project ID to App.tsx
2. ✅ Test the integration in browser console
3. ✅ Run user testing sessions
4. ✅ Review analytics in Maze dashboard
5. ✅ Create custom reports for your research
6. ✅ Export data for your HCI analysis report

## 📞 Support

- **Maze Documentation**: https://help.maze.co
- **Maze Community**: https://community.maze.co
- **Contact Maze Support**: support@maze.co

---

**Happy Testing! 🚀**

Your FoodPapa app now has professional-grade analytics to help you understand how low-literacy users interact with accessibility features.
