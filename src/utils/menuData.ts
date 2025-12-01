// Centralized menu data for all restaurants
// This allows the Read Menu feature to access menu data from anywhere

export const getRestaurantMenu = (restaurantId: string) => {
  const menus: Record<string, any[]> = {
    '1': [ // Kolachi Restaurant
      {
        id: 'starters',
        nameKey: 'bbqStarters',
        items: [
          { id: 1, nameKey: 'chickenTikka', price: '₨450', descriptionKey: 'marinatedGrilledChicken' },
          { id: 2, nameKey: 'chickenBoti', price: '₨480', descriptionKey: 'bonelessChickenTikka' },
          { id: 3, nameKey: 'seekhKabab', price: '₨380', descriptionKey: 'mincedMeatGrilled' }
        ]
      },
      {
        id: 'mains',
        nameKey: 'mainCourse',
        items: [
          { id: 4, nameKey: 'chickenKarahi', price: '₨1200', descriptionKey: 'traditionalWokChicken' },
          { id: 5, nameKey: 'fishFry', price: '₨950', descriptionKey: 'crispyFriedFish' },
          { id: 6, nameKey: 'naan', price: '₨60', descriptionKey: 'freshOvenBakedBread' }
        ]
      }
    ],
    '2': [ // Bar.B.Q Tonight
      {
        id: 'starters',
        nameKey: 'bbqSpecials',
        items: [
          { id: 1, nameKey: 'seekhKabab', price: 'Rs. 420', descriptionKey: 'famousBBQKabab' },
          { id: 2, nameKey: 'chickenTikka', price: 'Rs. 480', descriptionKey: 'signatureGrilledTikka' }
        ]
      },
      {
        id: 'karahi',
        nameKey: 'karahiSpecial',
        items: [
          { id: 3, nameKey: 'whiteKarahi', price: 'Rs. 1400', descriptionKey: 'creamyYogurtKarahi' },
          { id: 4, nameKey: 'redKarahi', price: 'Rs. 1350', descriptionKey: 'spicyTomatoKarahi' }
        ]
      }
    ],
    '3': [ // Student Biryani
      {
        id: 'biryani',
        nameKey: 'biryaniSelection',
        items: [
          { id: 1, nameKey: 'chickenBiryani', price: 'Rs. 320', descriptionKey: 'aromaticRiceBiryani' },
          { id: 2, nameKey: 'beefBiryani', price: 'Rs. 350', descriptionKey: 'spicyBeefBiryani' },
          { id: 3, nameKey: 'muttonBiryani', price: 'Rs. 420', descriptionKey: 'tenderMuttonBiryani' }
        ]
      },
      {
        id: 'sides',
        nameKey: 'sides',
        items: [
          { id: 4, nameKey: 'raita', price: 'Rs. 80', descriptionKey: 'yogurtSideDish' },
          { id: 5, nameKey: 'coldDrink', price: 'Rs. 100', descriptionKey: 'refreshingBeverage' }
        ]
      }
    ],
    '4': [ // Nihari House
      {
        id: 'special',
        nameKey: 'ourSpecials',
        items: [
          { id: 1, nameKey: 'beefNihari', price: 'Rs. 450', descriptionKey: 'slowCookedBeefStew' },
          { id: 2, nameKey: 'paya', price: 'Rs. 400', descriptionKey: 'trotterStew' },
          { id: 3, nameKey: 'haleem', price: 'Rs. 350', descriptionKey: 'meatLentilStew' }
        ]
      }
    ],
    '5': [ // Burger King
      {
        id: 'burgers',
        nameKey: 'burgers',
        items: [
          { id: 1, nameKey: 'cheeseburger', price: 'Rs. 350', descriptionKey: 'juicyBeefPatty' },
          { id: 2, nameKey: 'chickenBurger', price: 'Rs. 380', descriptionKey: 'crispyChickenBurger' },
          { id: 3, nameKey: 'veggieBurger', price: 'Rs. 320', descriptionKey: 'plantBasedBurger' }
        ]
      },
      {
        id: 'sides',
        nameKey: 'sidesAndDrinks',
        items: [
          { id: 4, nameKey: 'fries', price: 'Rs. 150', descriptionKey: 'crispyGoldenFries' },
          { id: 5, nameKey: 'coke', price: 'Rs. 120', descriptionKey: 'chilledSoftDrink' }
        ]
      }
    ],
    '12': [ // Pizza Heaven
      {
        id: 'pizza',
        nameKey: 'pizzas',
        items: [
          { id: 1, nameKey: 'margherita', price: 'Rs. 950', descriptionKey: 'classicCheesePizza' },
          { id: 2, nameKey: 'pepperoni', price: 'Rs. 1200', descriptionKey: 'spicyPepperoniPizza' },
          { id: 3, nameKey: 'veggiePizza', price: 'Rs. 1050', descriptionKey: 'freshVegetablePizza' }
        ]
      },
      {
        id: 'pasta',
        nameKey: 'pasta',
        items: [
          { id: 4, nameKey: 'carbonara', price: 'Rs. 750', descriptionKey: 'creamyPastaDish' },
          { id: 5, nameKey: 'bolognese', price: 'Rs. 800', descriptionKey: 'meatSaucePasta' }
        ]
      }
    ]
  };

  return menus[restaurantId] || menus['1'];
};

export const getRestaurantData = (restaurantId: string) => {
  const restaurants: Record<string, { nameKey: string; cuisine: string }> = {
    '1': { nameKey: 'kolachiRestaurant', cuisine: 'pakistani, bbq' },
    '2': { nameKey: 'bbqTonight', cuisine: 'bbq, karahi, desi' },
    '3': { nameKey: 'studentBiryani', cuisine: 'biryani, fastFood' },
    '4': { nameKey: 'bbqTonight', cuisine: 'nihari, pakistani' },
    '5': { nameKey: 'burgerKing', cuisine: 'fastFood, burgers' },
    '12': { nameKey: 'pizzaHeaven', cuisine: 'italian, pizza' }
  };

  return restaurants[restaurantId] || restaurants['1'];
};
