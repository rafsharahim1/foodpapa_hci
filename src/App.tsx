import { useState, useEffect } from "react";
import {
  AccessibilityProvider,
  useAccessibility,
} from "./context/AccessibilityContext";
import { TutorialProvider } from "./context/TutorialContext";
import { InitialWelcomeScreen } from "./components/InitialWelcomeScreen";
import { WelcomeSetupScreen } from "./components/WelcomeSetupScreen";
import { LoginScreen } from "./components/LoginScreen";
import { LocationSelectionScreen } from "./components/LocationSelectionScreen";
import { EnhancedHomeScreen } from "./components/EnhancedHomeScreen";
import { SearchFilterScreen } from "./components/SearchFilterScreen";
import { RestaurantListScreen } from "./components/RestaurantListScreen";
import { EnhancedMenuScreen } from "./components/EnhancedMenuScreen";
import { EnhancedCartScreen } from "./components/EnhancedCartScreen";
import { MultiCartScreen } from "./components/MultiCartScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";
import { OrderSuccessScreen } from "./components/OrderSuccessScreen";
import { RewardsScreen } from "./components/RewardsScreen";
import { OrderHistoryScreen } from "./components/OrderHistoryScreen";
import { OrderTrackingScreen } from "./components/OrderTrackingScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { HelpSupportScreen } from "./components/HelpSupportScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SavedPlacesScreen } from "./components/SavedPlacesScreen";
import { PaymentMethodScreen } from "./components/PaymentMethodScreen";
import { LanguageScreen } from "./components/LanguageScreen";
import { BottomNavBar } from "./components/BottomNavBar";
import { NotificationCenter } from "./components/NotificationCenter";
import { Toaster } from "sonner@2.0.3";
import { useAccessibleToast } from "./components/AccessibleToast";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { useTutorial } from "./context/TutorialContext";
import { MazeAnalytics } from "./components/analytics/MazeAnalytics";

type Screen =
  | "initial-welcome"
  | "setup"
  | "login"
  | "location"
  | "home"
  | "search"
  | "restaurants"
  | "menu"
  | "cart"
  | "multicart"
  | "checkout"
  | "success"
  | "rewards"
  | "orders"
  | "settings"
  | "help"
  | "profile"
  | "notifications"
  | "saved-places"
  | "payment"
  | "language"
  | "tracking";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    "initial-welcome",
  );
  const [currentLocation, setCurrentLocation] = useState(
    "123 Main Street, Gulshan-e-Iqbal",
  );
  const [previousScreen, setPreviousScreen] =
    useState<Screen>("home"); // Track previous screen for back navigation

  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userPhone, setUserPhone] = useState("");

  // Active order tracking for floating widget
  const [activeOrder, setActiveOrder] = useState<{
    orderId: string;
    restaurantName: string;
    status: string;
    estimatedTime: string;
  } | null>(null);

  // Multi-restaurant cart system with REAL ITEMS TRACKING
  const [restaurantCarts, setRestaurantCarts] = useState<
    Map<
      string,
      {
        restaurantId: string;
        restaurantName: string;
        restaurantImage: string;
        items: Array<{
          id: number;
          name: string;
          image: string;
          price: number;
          quantity: number;
        }>;
      }
    >
  >(new Map());

  const [currentRestaurant, setCurrentRestaurant] = useState<
    string | null
  >(null);

  // Convert Map to Array for components and calculate totals
  const cartsArray = Array.from(restaurantCarts.values()).map(
    (cart) => ({
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      restaurantImage: cart.restaurantImage,
      itemCount: cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      totalPrice: `Rs. ${cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`,
    }),
  );

  const totalCartCount = cartsArray.reduce(
    (sum, cart) => sum + cart.itemCount,
    0,
  );

  // Function to add item to cart
  const addItemToCart = (
    restaurantId: string,
    restaurantName: string,
    restaurantImage: string,
    item: {
      id: number;
      name: string;
      image: string;
      price: number;
    },
  ) => {
    const newCarts = new Map(restaurantCarts);
    const existingCart = newCarts.get(restaurantId);

    if (existingCart) {
      // Check if item already exists
      const existingItemIndex = existingCart.items.findIndex(
        (i) => i.id === item.id,
      );
      if (existingItemIndex >= 0) {
        // Increase quantity
        existingCart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        existingCart.items.push({ ...item, quantity: 1 });
      }
    } else {
      // Create new cart
      newCarts.set(restaurantId, {
        restaurantId,
        restaurantName,
        restaurantImage,
        items: [{ ...item, quantity: 1 }],
      });
    }

    setRestaurantCarts(newCarts);
  };

  // Function to update item quantity in cart
  const updateCartItemQuantity = (
    restaurantId: string,
    itemId: number,
    newQuantity: number,
  ) => {
    const newCarts = new Map(restaurantCarts);
    const cart = newCarts.get(restaurantId);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (i) => i.id === itemId,
      );
      if (itemIndex >= 0) {
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          cart.items.splice(itemIndex, 1);
          if (cart.items.length === 0) {
            // Remove cart if no items left
            newCarts.delete(restaurantId);
          }
        } else {
          cart.items[itemIndex].quantity = newQuantity;
        }
        setRestaurantCarts(newCarts);
      }
    }
  };

  // Function to remove item from cart
  const removeCartItem = (
    restaurantId: string,
    itemId: number,
  ) => {
    const newCarts = new Map(restaurantCarts);
    const cart = newCarts.get(restaurantId);

    if (cart) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
      if (cart.items.length === 0) {
        newCarts.delete(restaurantId);
      }
      setRestaurantCarts(newCarts);
    }
  };

  // Get current restaurant's cart items
  const getCurrentRestaurantCartItems = () => {
    if (!currentRestaurant) return [];
    const cart = restaurantCarts.get(currentRestaurant);
    return cart ? cart.items : [];
  };

  // Inner component that can access toast hook
  function AppContent() {
    const toast = useAccessibleToast();
    const { setIsGuestMode } = useAccessibility();
    const { setCurrentScreen: setTutorialScreen } =
      useTutorial();

    // Sync guest mode with login status
    useEffect(() => {
      setIsGuestMode(!isLoggedIn);
    }, [isLoggedIn, setIsGuestMode]);

    // Sync tutorial screen with current screen
    useEffect(() => {
      setTutorialScreen(currentScreen);
    }, [currentScreen, setTutorialScreen]);

    return (
      <>
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="skip-to-main sr-only focus:not-sr-only"
          tabIndex={0}
        >
          Skip to main content
        </a>

        <Toaster position="top-center" richColors />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div
            id="main-content"
            className="w-full max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative"
          >
            {currentScreen === "initial-welcome" && (
              <InitialWelcomeScreen
                onContinue={() => setCurrentScreen("setup")}
              />
            )}

            {currentScreen === "setup" && (
              <WelcomeSetupScreen
                onComplete={() => setCurrentScreen("login")}
                onSkip={() => setCurrentScreen("login")}
              />
            )}

            {currentScreen === "login" && (
              <LoginScreen
                onContinueAsGuest={() => {
                  setIsLoggedIn(false);
                  setUserName("Guest User");
                  setCurrentScreen("location");
                }}
                onLoginSuccess={(phone: string) => {
                  setIsLoggedIn(true);
                  setUserName("Rafsha");
                  setUserPhone(phone);
                  setCurrentScreen("profile");
                }}
              />
            )}

            {currentScreen === "location" && (
              <LocationSelectionScreen
                onConfirm={(location) => {
                  setCurrentLocation(location);
                  setCurrentScreen("home");
                }}
              />
            )}

            {currentScreen === "home" && (
              <EnhancedHomeScreen
                onNavigateToRestaurants={() =>
                  setCurrentScreen("restaurants")
                }
                onNavigateToCart={(restaurantId?: string) => {
                  if (restaurantId)
                    setCurrentRestaurant(restaurantId);
                  setCurrentScreen("cart");
                }}
                onNavigateToRewards={() =>
                  setCurrentScreen("rewards")
                }
                onNavigateToProfile={() =>
                  setCurrentScreen("profile")
                }
                onNavigateToSearch={() =>
                  setCurrentScreen("search")
                }
                onNavigateToMultiCart={() =>
                  setCurrentScreen("multicart")
                }
                onNavigateToMenu={(restaurantId: string) => {
                  setCurrentRestaurant(restaurantId);
                  setPreviousScreen("home"); // Track that we came from home
                  setCurrentScreen("menu");
                }}
                cartCount={totalCartCount}
                currentLocation={currentLocation}
                carts={cartsArray}
                onRemoveCart={(restaurantId: string) => {
                  const newCarts = new Map(restaurantCarts);
                  newCarts.delete(restaurantId);
                  setRestaurantCarts(newCarts);
                }}
                activeOrder={activeOrder}
                onTrackOrder={() =>
                  setCurrentScreen("tracking")
                }
              />
            )}

            {currentScreen === "search" && (
              <SearchFilterScreen
                onBack={() => setCurrentScreen("home")}
                onSelectRestaurant={() =>
                  setCurrentScreen("menu")
                }
              />
            )}

            {currentScreen === "restaurants" && (
              <RestaurantListScreen
                onSelectRestaurant={(restaurantId: string) => {
                  setCurrentRestaurant(restaurantId);
                  setPreviousScreen("restaurants"); // Track that we came from restaurants list
                  setCurrentScreen("menu");
                }}
                onBack={() => setCurrentScreen("home")}
              />
            )}

            {currentScreen === "menu" && (
              <EnhancedMenuScreen
                restaurantId={currentRestaurant || undefined}
                onAddToCart={(item) => {
                  // Add item to cart system
                  if (currentRestaurant) {
                    const restaurant =
                      currentRestaurant === "restaurant-1"
                        ? {
                            name: "Kolachi Restaurant",
                            image:
                              "https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                          }
                        : currentRestaurant === "restaurant-2"
                          ? {
                              name: "Bar.B.Q Tonight",
                              image:
                                "https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                            }
                          : currentRestaurant === "restaurant-3"
                            ? {
                                name: "Student Biryani",
                                image:
                                  "https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                              }
                            : currentRestaurant ===
                                "restaurant-4"
                              ? {
                                  name: "Bundu Khan",
                                  image:
                                    "https://images.unsplash.com/photo-1750190624513-020c9df74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWhhcmklMjBiZWVmfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                }
                              : currentRestaurant ===
                                  "restaurant-5"
                                ? {
                                    name: "Kababjees",
                                    image:
                                      "https://images.unsplash.com/photo-1660262849063-63c52a1fa2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrYWJhYnxlbnwxfHx8fDE3NjI1OTIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                  }
                                : {
                                    name: "Pompei Pizza",
                                    image:
                                      "https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                  };

                    addItemToCart(
                      currentRestaurant,
                      restaurant.name,
                      restaurant.image,
                      item,
                    );
                  }
                }}
                onViewCart={() => setCurrentScreen("cart")}
                onBack={() => setCurrentScreen(previousScreen)} // Go back to wherever we came from!
              />
            )}

            {currentScreen === "cart" && (
              <EnhancedCartScreen
                cartItems={getCurrentRestaurantCartItems()}
                onUpdateQuantity={(itemId, newQuantity) => {
                  if (currentRestaurant) {
                    updateCartItemQuantity(
                      currentRestaurant,
                      itemId,
                      newQuantity,
                    );
                  }
                }}
                onRemoveItem={(itemId) => {
                  if (currentRestaurant) {
                    removeCartItem(currentRestaurant, itemId);
                  }
                }}
                onRestoreItem={(item) => {
                  if (currentRestaurant) {
                    const newCarts = new Map(restaurantCarts);
                    const cart = newCarts.get(
                      currentRestaurant,
                    );

                    if (cart) {
                      // Cart still exists, just add the item back
                      newCarts.set(currentRestaurant, {
                        ...cart,
                        items: [...cart.items, item],
                      });
                    } else {
                      // Cart was deleted (was empty), recreate it
                      const restaurant =
                        currentRestaurant === "restaurant-1"
                          ? {
                              name: "Kolachi Restaurant",
                              image:
                                "https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                            }
                          : currentRestaurant === "restaurant-2"
                            ? {
                                name: "Bar.B.Q Tonight",
                                image:
                                  "https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                              }
                            : currentRestaurant ===
                                "restaurant-3"
                              ? {
                                  name: "Student Biryani",
                                  image:
                                    "https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                }
                              : currentRestaurant ===
                                  "restaurant-4"
                                ? {
                                    name: "Bundu Khan",
                                    image:
                                      "https://images.unsplash.com/photo-1750190624513-020c9df74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWhhcmklMjBiZWVmfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                  }
                                : currentRestaurant ===
                                    "restaurant-5"
                                  ? {
                                      name: "Kababjees",
                                      image:
                                        "https://images.unsplash.com/photo-1660262849063-63c52a1fa2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrYWJhYnxlbnwxfHx8fDE3NjI1OTIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                    }
                                  : {
                                      name: "Pompei Pizza",
                                      image:
                                        "https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                                    };

                      newCarts.set(currentRestaurant, {
                        restaurantId: currentRestaurant,
                        restaurantName: restaurant.name,
                        restaurantImage: restaurant.image,
                        items: [item],
                      });
                    }
                    setRestaurantCarts(newCarts);
                  }
                }}
                onCheckout={() => setCurrentScreen("checkout")}
                onBack={() => setCurrentScreen("menu")}
                onGoToRestaurants={() =>
                  setCurrentScreen("restaurants")
                }
              />
            )}

            {currentScreen === "multicart" && (
              <MultiCartScreen
                carts={cartsArray}
                onBack={() => setCurrentScreen("home")}
                onViewCart={(restaurantId: string) => {
                  setCurrentRestaurant(restaurantId);
                  setCurrentScreen("cart");
                }}
                onRemoveCart={(restaurantId: string) => {
                  const newCarts = new Map(restaurantCarts);
                  newCarts.delete(restaurantId);
                  setRestaurantCarts(newCarts);
                }}
              />
            )}

            {currentScreen === "checkout" && (
              <CheckoutScreen
                onPlaceOrder={() => {
                  // Set active order for tracking widget
                  setActiveOrder({
                    orderId:
                      "#FP" + Math.floor(Math.random() * 10000),
                    restaurantName:
                      cartsArray[0]?.restaurantName ||
                      "Restaurant",
                    status: "Confirmed",
                    estimatedTime: "25-30 mins",
                  });
                  setCurrentScreen("success");
                }}
                onBack={() => setCurrentScreen("cart")}
              />
            )}

            {currentScreen === "success" && (
              <OrderSuccessScreen
                onBack={() => setCurrentScreen("home")}
                onViewRewards={() =>
                  setCurrentScreen("rewards")
                }
              />
            )}

            {currentScreen === "rewards" && (
              <RewardsScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "orders" && (
              <OrderHistoryScreen
                onBack={() => setCurrentScreen("profile")}
                onReorder={() => {
                  setCurrentScreen("cart");
                }}
              />
            )}

            {currentScreen === "settings" && (
              <SettingsScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "help" && (
              <HelpSupportScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "profile" && (
              <ProfileScreen
                onNavigateToOrders={() =>
                  setCurrentScreen("orders")
                }
                onNavigateToRewards={() =>
                  setCurrentScreen("rewards")
                }
                onNavigateToSettings={() =>
                  setCurrentScreen("settings")
                }
                onNavigateToHelp={() =>
                  setCurrentScreen("help")
                }
                onNavigateToSavedPlaces={() =>
                  setCurrentScreen("saved-places")
                }
                onNavigateToPayment={() =>
                  setCurrentScreen("payment")
                }
                onNavigateToLanguage={() =>
                  setCurrentScreen("language")
                }
                onBack={() => setCurrentScreen("home")}
                onSignIn={() => setCurrentScreen("login")}
                onSignOut={() => {
                  setIsLoggedIn(false);
                  setUserName("Guest User");
                  setUserPhone("");
                }}
                isLoggedIn={isLoggedIn}
                userName={userName}
                userPhone={userPhone}
              />
            )}

            {currentScreen === "saved-places" && (
              <SavedPlacesScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "payment" && (
              <PaymentMethodScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "language" && (
              <LanguageScreen
                onBack={() => setCurrentScreen("profile")}
              />
            )}

            {currentScreen === "notifications" && (
              <NotificationCenter
                onBack={() => setCurrentScreen("home")}
                asFullScreen={true}
              />
            )}

            {currentScreen === "tracking" && (
              <OrderTrackingScreen
                onBack={() => setCurrentScreen("home")}
                onViewRewards={() =>
                  setCurrentScreen("rewards")
                }
              />
            )}

            {/* Bottom Navigation Bar - Show on all main screens */}
            {![
              "initial-welcome",
              "setup",
              "login",
              "location",
            ].includes(currentScreen) && (
              <BottomNavBar
                currentScreen={currentScreen}
                onNavigateToHome={() =>
                  setCurrentScreen("home")
                }
                onNavigateToCart={() => {
                  if (cartsArray.length > 1) {
                    setCurrentScreen("multicart");
                  } else {
                    // Always go to cart screen, even if empty
                    if (cartsArray.length === 1) {
                      setCurrentRestaurant(
                        cartsArray[0].restaurantId,
                      );
                    }
                    setCurrentScreen("cart");
                  }
                }}
                onNavigateToProfile={() =>
                  setCurrentScreen("profile")
                }
                onNavigateToRewards={() =>
                  setCurrentScreen("rewards")
                }
                onNavigateToNotifications={() =>
                  setCurrentScreen("notifications")
                }
                cartCount={totalCartCount}
                notificationCount={toast.getHistory().length}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <AccessibilityProvider>
      <TutorialProvider>
        <MazeAnalytics projectId="475865394" />
        <AppContent />
        <TutorialOverlay />
      </TutorialProvider>
    </AccessibilityProvider>
  );
}