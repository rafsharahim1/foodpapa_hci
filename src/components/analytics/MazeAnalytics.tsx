import { useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface MazeAnalyticsProps {
  projectId?: string;
}

/**
 * MazeAnalytics Component
 * 
 * Integrates Maze.co analytics for user testing, heatmaps, and behavior tracking
 * 
 * Setup Instructions:
 * 1. Sign up at maze.co
 * 2. Create a new project
 * 3. Get your Project ID from Settings > Installation
 * 4. Add it to the projectId prop or set MAZE_PROJECT_ID in the code
 * 
 * Features tracked:
 * - Page views and navigation
 * - User clicks and interactions
 * - Accessibility feature usage
 * - Language preferences
 * - Tutorial completion
 * - Cart and order actions
 */
export function MazeAnalytics({ projectId }: MazeAnalyticsProps) {
  const { settings } = useAccessibility();

  useEffect(() => {
    console.log('🔍 MazeAnalytics component mounted!');
    console.log('🔍 Project ID received:', projectId);
    
    // Use provided projectId or placeholder
    const mazeProjectId = projectId || 'YOUR_MAZE_PROJECT_ID';

    // Don't load if no valid project ID
    if (!mazeProjectId || mazeProjectId === 'YOUR_MAZE_PROJECT_ID') {
      console.warn('⚠️ Maze Analytics: No project ID provided. Add your Maze project ID to enable tracking.');
      console.log('📖 Instructions:');
      console.log('1. Sign up at https://maze.co');
      console.log('2. Create a new project');
      console.log('3. Go to Settings > Installation');
      console.log('4. Copy your Project ID');
      console.log('5. Add it to the MazeAnalytics component in App.tsx');
      return;
    }

    // Check if Maze is already loaded
    if ((window as any).Maze) {
      console.log('✅ Maze already loaded');
      return;
    }

    console.log('📊 Loading Maze Analytics...');

    // Load Maze script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://snippet.maze.co/maze-universal-loader.js`;
    
    script.onload = () => {
      console.log('✅ Maze script loaded successfully');
      
      // Initialize Maze
      if ((window as any).Maze) {
        (window as any).Maze.initMazeUniversal({
          projectId: mazeProjectId,
          // Additional configuration
          debug: false, // Set to true for debugging
        });
        
        console.log('✅ Maze initialized with project:', mazeProjectId);
        
        // Track initial page load with user context
        trackMazeEvent('app_loaded', {
          language: settings.language,
          voiceGuide: settings.voiceGuide,
          colorMode: settings.colorMode,
          textSize: settings.textSize,
          timestamp: new Date().toISOString(),
        });
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load Maze Analytics script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [projectId]);

  // Track accessibility settings changes
  useEffect(() => {
    trackMazeEvent('accessibility_settings_changed', {
      language: settings.language,
      voiceGuide: settings.voiceGuide,
      colorMode: settings.colorMode,
      textSize: settings.textSize,
      hapticFeedback: settings.hapticFeedback,
      simplifiedNavigation: settings.simplifiedNavigation,
    });
  }, [settings]);

  return null; // This component doesn't render anything
}

/**
 * Track custom events in Maze
 */
export function trackMazeEvent(eventName: string, properties?: Record<string, any>) {
  if ((window as any).Maze && (window as any).Maze.track) {
    try {
      (window as any).Maze.track(eventName, properties);
      console.log('📊 Maze event tracked:', eventName, properties);
    } catch (error) {
      console.error('❌ Error tracking Maze event:', error);
    }
  }
}

/**
 * Track page views in Maze
 */
export function trackMazePageView(pageName: string, properties?: Record<string, any>) {
  trackMazeEvent('page_view', {
    page: pageName,
    ...properties,
  });
}

/**
 * Identify user in Maze (for tracking across sessions)
 */
export function identifyMazeUser(userId: string, traits?: Record<string, any>) {
  if ((window as any).Maze && (window as any).Maze.identify) {
    try {
      (window as any).Maze.identify(userId, traits);
      console.log('👤 Maze user identified:', userId);
    } catch (error) {
      console.error('❌ Error identifying Maze user:', error);
    }
  }
}