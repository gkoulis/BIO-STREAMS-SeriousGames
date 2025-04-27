const FOODS = [
  // Fruit
  { name: "Apple", categoryId: "fruit", texture: "apple" },
  { name: "Banana", categoryId: "fruit", texture: "banana" },
  { name: "Grape", categoryId: "fruit", texture: "grape" },
  { name: "Lemon", categoryId: "fruit", texture: "lemon" },
  { name: "Mango", categoryId: "fruit", texture: "mango" },
  { name: "Mellon", categoryId: "fruit", texture: "mellon" },
  { name: "Pineapple", categoryId: "fruit", texture: "pineapple" },
  // Poultry
  { name: "Chicken Breast", categoryId: "poultry", texture: "chicken-breast" },
  { name: "Chicken", categoryId: "poultry", texture: "chicken-whole" },
  // Vegetable
  { name: "Bell Pepper (Capsicum)", categoryId: "vegetable", texture: "bell-pepper-capsicum" },
  { name: "Broccoli", categoryId: "vegetable", texture: "broccoli" },
  { name: "Cabbage", categoryId: "vegetable", texture: "cabbage" },
  { name: "Carrot", categoryId: "vegetable", texture: "carrot" },
  { name: "Cucumber", categoryId: "vegetable", texture: "cucumber" },
  { name: "Garlic", categoryId: "vegetable", texture: "garlic" },
  { name: "Onion", categoryId: "vegetable", texture: "onion" },
  { name: "Potato", categoryId: "vegetable", texture: "potato" },
  { name: "Spinach", categoryId: "vegetable", texture: "spinach" },
  { name: "Tomato", categoryId: "vegetable", texture: "tomato" },
  // Grains
  { name: "Bread", categoryId: "grain", texture: "bread" },
  { name: "Oat", categoryId: "grain", texture: "oat" },
  { name: "Pasta", categoryId: "grain", texture: "pasta" },
  { name: "Rice", categoryId: "grain", texture: "rice" },
  { name: "Weat", categoryId: "grain", texture: "weat" },
];

const FOOD_CATEGORIES = {};

// Dynamically populate FOOD_CATEGORIES
FOODS.forEach((food) => {
  const { categoryId, texture } = food;
  if (!FOOD_CATEGORIES[categoryId]) {
    FOOD_CATEGORIES[categoryId] = []; // Initialize array for the type if not present
  }
  FOOD_CATEGORIES[categoryId].push(texture); // Add texture to the respective type
});

const FOOD_IMAGES = {};

FOODS.forEach((food) => {
  const { categoryId, texture } = food;
  // Construct image path using the texture
  FOOD_IMAGES[texture] = `/temp-foods/${categoryId}/${texture}.png`;
});

export { FOODS, FOOD_CATEGORIES, FOOD_IMAGES };
