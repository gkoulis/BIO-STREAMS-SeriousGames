<script setup>
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import Phaser from "phaser";
import { loadJson } from "@/common/load-json.js";

const PUBLIC_PATH = import.meta.env.BASE_URL;

const { t } = useI18n();

const dynamicStyle = reactive({
  width: "100px",
  margin: "20px auto",
});
const FOOD_DISPLAY_SIZE = 100; // TODO Automatic based on common dimensions and devices.

const convertFoodsToFoodCategoriesObject = (foods) => {
  const foodCategories = {};
  // Dynamically populate FOOD_CATEGORIES
  foods.forEach((food) => {
    const { id, name, categoryId, categoryName, texture } = food;
    if (!foodCategories[categoryId]) {
      foodCategories[categoryId] = {
        id: categoryId,
        name: categoryName,
        foods: [],
      };
    }
    // Add texture to the respective type
    foodCategories[categoryId].foods.push({
      id: id,
      name: name,
      texture: texture,
    });
  });
  return foodCategories;
};

const foodsRef = ref([]);
const foodCategoriesRef = ref({});

let evaluateNoFoods = null;

// State management
const correctCount = ref(0);
const wrongCount = ref(0);
const currentRoundFoods = ref(1); // Number of foods for the current round
const remainingCorrectFoods = ref(0); // Correct foods left to slice

const notification = reactive({
  message: "",
  type: "", // 'success' or 'error'
  visible: false, // Visibility flag
});

// Function to show a notification
function showNotification(message, type, timeout) {
  notification.message = message;
  notification.type = type;
  notification.visible = true;

  if (timeout > 0) {
    setTimeout(() => {
      notification.visible = false;
    }, timeout);
  }
}

// Avoid overlap radius
const FOOD_RADIUS = 40;

onMounted(async () => {
  const languageCode = localStorage.getItem("languageCode");
  const jsonResponse = await loadJson(`/sr-foodninjafreemode/${languageCode}/content.json`);
  foodsRef.value = jsonResponse.foods;
  foodCategoriesRef.value = convertFoodsToFoodCategoriesObject(foodsRef.value);

  const gameWidth = window.innerWidth - 20;
  const gameHeight = window.innerHeight - (150 + 100); // TODO Dynamic.

  dynamicStyle.width = `${gameWidth}px`;

  const config = {
    type: Phaser.AUTO,
    parent: "phaser-game-container",
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#4488aa",
    transparent: true,
    arcade: {
      gravity: { y: 0 }, // No gravity
      debug: false, // Disable debug mode
    },
    scene: {
      preload,
      create,
      update,
    },
  };
  const game = new Phaser.Game(config);

  let foodObjects = []; // To track food objects
  let slicing = false; // Flag for slicing state
  let sliceLine; // Reference to slicing line
  let lastPointerPosition = null; // To track last pointer position

  function preload() {
    // Load food images
    for (const food of foodsRef.value) {
      const foodId = food.id;
      const foodImageUrl = `/sr-foodninjafreemode/images/${food.texture}`;
      this.load.image(foodId, foodImageUrl);
    }

    // Load sounds
    this.load.audio("correct", "/sr-foodninjafreemode/audio/steel-blade-slice-1-188213.mp3");
    this.load.audio("incorrect", "/sr-foodninjafreemode/audio/incorrect.mp3");
    this.load.audio("nextRoundSuccess", "/sr-foodninjafreemode/audio/winning-82808.mp3");
  }

  function create() {
    resetGameState.call(this); // Reset the game state at the start

    // Unlock audio context on user interaction.
    // TODO Better not working...
    this.input.once("pointerdown", () => this.sound.context.resume());
    this.input.once("pointerup", () => this.sound.context.resume());
    this.input.once("pointermove", () => this.sound.context.resume());

    // const allFoods = Object.values(foodCategoriesRef.value).flat(); // TODO Remove after dev.
    const allFoods = foodsRef.value;
    const roundFoods = Phaser.Utils.Array.Shuffle(allFoods).slice(0, currentRoundFoods.value);

    const categoryIdList = Object.keys(foodCategoriesRef.value);
    const selectedCategoryId = Phaser.Utils.Array.GetRandom(categoryIdList);
    const selectedCategory = foodCategoriesRef.value[selectedCategoryId];
    const correctFoods = foodCategoriesRef.value[selectedCategoryId].foods;
    remainingCorrectFoods.value = correctFoods.filter((food) =>
      roundFoods.some((i) => i.id === food.id)
    ).length;

    if (remainingCorrectFoods.value <= 0) {
      // alert("HIT NON IDEAL CONDITION!"); // TODO Remove.
      console.log("NON IDEAL CONDITION: no remaining correct foods. Adding one.");

      // Add one correct food from the selected category to ensure at least one exists.
      const availableFoods = foodCategoriesRef.value[selectedCategoryId].foods;
      const extraFood = Phaser.Utils.Array.GetRandom(availableFoods);
      roundFoods.push(extraFood);
      remainingCorrectFoods.value++;
    }

    this.add.text(10, 10, `${t("foodninjafreemode.Category")}: ${selectedCategory.name}`, {
      font: "20px Arial",
      fill: "#ffffff",
    });

    // Generate non-overlapping random positions
    const positions = generateRandomPositions(roundFoods.length);

    // Display foods with images and movement
    roundFoods.forEach((food, index) => {
      if (food == null || food == undefined) {
        console.warn("found null food in index " + index);
        return;
      }

      const [x, y] = positions[index];

      // Add food image
      const foodImage = this.add.image(x, y, food.id).setInteractive();

      foodImage.setDisplaySize(FOOD_DISPLAY_SIZE, FOOD_DISPLAY_SIZE); // Scale the image to a fixed size
      foodImage.setData("id", food.id);
      foodImage.setData("name", food.name);
      foodImage.setData("categoryId", food.categoryId);
      foodImage.setData("categoryName", food.categoryName);
      foodImage.rotation = Phaser.Math.FloatBetween(0, Math.PI * 2); // Start with a random rotation angle
      foodObjects.push(foodImage); // Store for later slicing logic

      // Assign a random speed
      const speed = Phaser.Math.FloatBetween(1000, 3000); // Speed in milliseconds
      addMovement.call(this, foodImage, speed); // Apply random movement
    });

    // Add slicing line graphics
    sliceLine = this.add.graphics();

    // Mouse input for slicing
    this.input.on("pointerdown", (pointer) => {
      if (pointer.leftButtonDown()) {
        // Left-click pressed
        slicing = true;
        lastPointerPosition = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on("pointermove", (pointer) => {
      if (slicing) {
        drawSliceLine.call(this, pointer.x, pointer.y);
        checkIntersection.call(this, pointer.x, pointer.y, correctFoods, selectedCategory);
        lastPointerPosition = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on("pointerup", () => {
      slicing = false;
      sliceLine.clear();
    });
  }

  function resetGameState() {
    slicing = false;
    lastPointerPosition = null;

    // Destroy all existing food objects
    foodObjects.forEach((food) => food.destroy());
    foodObjects = [];

    // Clear sliceLine graphics
    if (sliceLine) {
      sliceLine.clear();
    }

    correctCount.value = 0;
    wrongCount.value = 0;

    // Remove lingering pointer events
    if (this.input === undefined || this.input === null) {
      return;
    }

    this.input.off("pointerdown");
    this.input.off("pointermove");
    this.input.off("pointerup");
  }

  function generateRandomPositions(count) {
    const positions = [];
    let attempts = 0;

    while (positions.length < count && attempts < 1000) {
      const x = Phaser.Math.Between(FOOD_RADIUS, gameWidth - FOOD_RADIUS);
      const y = Phaser.Math.Between(FOOD_RADIUS, gameHeight - FOOD_RADIUS);

      const isOverlapping = positions.some(
        ([px, py]) => Phaser.Math.Distance.Between(x, y, px, py) < FOOD_RADIUS * 2
      );

      if (!isOverlapping) {
        positions.push([x, y]);
      }

      attempts++;
    }

    return positions;
  }

  function drawSliceLine(x, y) {
    sliceLine.clear();
    sliceLine.lineStyle(2, 0xff0000, 1); // Red slicing line
    sliceLine.beginPath();
    sliceLine.moveTo(lastPointerPosition.x, lastPointerPosition.y);
    sliceLine.lineTo(x, y);
    sliceLine.strokePath();
  }

  function checkIntersection(x, y, correctFoods, category) {
    foodObjects = foodObjects.filter((food) => {
      const foodBounds = food.getBounds();
      const sliceLine = new Phaser.Geom.Line(
        // todo sometimes it's undefined or null... I have to check...
        lastPointerPosition.x,
        lastPointerPosition.y,
        x,
        y
      );

      if (Phaser.Geom.Intersects.LineToRectangle(sliceLine, foodBounds)) {
        const foodId = food.getData("id");
        const foodName = food.getData("name");
        const foodCategoryName = food.getData("categoryName");

        // TODO Use map... to avoid iteration.
        if (correctFoods.some((i) => i.id === foodId)) {
          this.sound.play("correct");
          correctCount.value++;
          remainingCorrectFoods.value--;

          showNotification(`${foodName} ✅ 🥷`, "success", 3000);

          // Slice effect
          food.setAlpha(0.5);
          setTimeout(() => food.destroy(), 100);
          if (remainingCorrectFoods.value === 0) {
            handleWin.call(this);
          }
          return false;
        } else {
          this.sound.play("incorrect");
          wrongCount.value++;

          // alert(`Incorrect: ${foodName} is not a ${category}. Game Over!`);
          const temp = t("foodninjafreemode.is_a_not_a", [
            foodName,
            foodCategoryName,
            category.name,
          ]);
          showNotification(temp, "error", 3000);

          // Reset game state and restart
          resetGameState.call(this);
          this.scene.restart();
        }
      }
      return true;
    });
  }

  function handleWin() {
    // alert('You won this round! Proceeding to the next round...');
    showNotification(t("foodninjafreemode.round_success"), "success", 3000);
    this.sound.play("nextRoundSuccess");

    currentRoundFoods.value++; // Increment the number of foods for the next round
    this.scene.restart(); // Restart the scene for the next round
  }

  function addMovement(foodImage, speed) {
    // todo enable bounce too.
    const movementType = Phaser.Math.RND.pick(["sinusoidal", "circular", "diagonal", "jitter"]);

    switch (movementType) {
      case "sinusoidal":
        addSinusoidalMovement.call(this, foodImage, speed);
        break;
      case "circular":
        addCircularMovement.call(this, foodImage, speed);
        break;
      case "diagonal":
        addDiagonalMovement.call(this, foodImage, speed);
        break;
      case "bounce":
        addBounceMovement.call(this, foodImage, speed);
        break;
      case "jitter":
        addJitterMovement.call(this, foodImage, speed);
        break;
    }
  }

  function addSinusoidalMovement(foodImage, speed) {
    this.tweens.add({
      targets: foodImage,
      y: foodImage.y + Phaser.Math.Between(-50, 50),
      duration: speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  function addCircularMovement(foodImage, speed) {
    const centerX = foodImage.x;
    const centerY = foodImage.y;
    const radius = Phaser.Math.Between(30, 60);
    const angle = { value: 0 };

    this.tweens.add({
      targets: angle,
      value: 2 * Math.PI,
      duration: speed,
      repeat: -1,
      ease: "Linear",
      onUpdate: () => {
        foodImage.x = centerX + radius * Math.cos(angle.value);
        foodImage.y = centerY + radius * Math.sin(angle.value);
      },
    });
  }

  function addDiagonalMovement(foodImage, speed) {
    const targetX = foodImage.x + Phaser.Math.Between(-100, 100);
    const targetY = foodImage.y + Phaser.Math.Between(-100, 100);

    this.tweens.add({
      targets: foodImage,
      x: targetX,
      y: targetY,
      duration: speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  function addBounceMovement(foodImage, speed) {
    // todo implement.
  }

  function addJitterMovement(foodImage, speed) {
    this.time.addEvent({
      delay: Phaser.Math.Between(200, 500),
      callback: () => {
        foodImage.x += Phaser.Math.Between(-10, 10);
        foodImage.y += Phaser.Math.Between(-10, 10);
      },
      repeat: -1,
    });
  }

  function update() {
    foodObjects.forEach((food) => {
      food.rotation += 0.02; // Rotate each food
    });
  }

  function evaluateNoFoods_() {
    // Check if there are any foods from the selected category in the container
    /*
    const hasFoodsInCategory = foodObjects.some((food) =>
      correctFoods.includes(food.getData('name'))
    );
    */

    const hasFoodsInCategory = remainingCorrectFoods.value > 0;

    if (hasFoodsInCategory) {
      // User is wrong
      wrongCount.value++;
      // alert("Wrong! Foods from this category are present in the container."); // TODO WTF?
      resetGameState.call(this);
      if (this.scene !== undefined && this.scene !== null) {
        this.scene.restart(); // Restart the game
      }
    } else {
      // User is correct
      correctCount.value++;
      // alert("Correct! No foods from this category are in the container."); // TODO WTF?
      resetGameState.call(this);
      if (this.scene !== undefined && this.scene !== null) {
        this.scene.restart(); // Proceed to the next round
      }
    }
  }

  evaluateNoFoods = evaluateNoFoods_;
});
</script>

<template>
  <div id="FoodNinjaSeriousGameView">
    <!-- TODO Show alerts/flash messages with effects/animations!!! -->
    <div class="notification-wrapper">
      <transition name="fade">
        <div
          v-if="notification.visible"
          :class="['notification', notification.type === 'success' ? 'success' : 'error']"
          class=""
        >
          {{ notification.message }}
        </div>
      </transition>
    </div>

    <div class="header-wrapper">
      <header>
        <div class="mx-auto flex items-center justify-center p-2">
          <img class="h-14 w-auto" :src="`${PUBLIC_PATH}logo/ninja-logo-0001.png`" alt="" />
        </div>

        <!-- CONTROLS -->
        <!--
        <div>
          <button @click="location.reload()">Restart</button>
        </div>
        -->

        <!-- TODO Fix better. -->
        <div class="Scores mx-auto flex items-center justify-center space-x-4 p-2">
          <div class="text-green-500">{{ correctCount }}</div>
          <div class="text-red-500">{{ wrongCount }}</div>
          <div class="text-gray-900">{{ remainingCorrectFoods }}</div>
        </div>
      </header>
    </div>

    <div id="phaser-game-container" :style="dynamicStyle"></div>
    <!--
    <div>
      NOT WORKING
      <button @click="evaluateNoFoods">No Foods in This Category</button>
    </div>
    -->

    <!-- DIAGNOSTICS -->
    <!-- TODO State Management Boolean to show or not. -->
    <!--
    <div>
      <div>correctCount: {{ correctCount }}</div>
      <div>wrongCount: {{ wrongCount }}</div>
      <div>remainingCorrectFoods: {{ remainingCorrectFoods }}</div>
      <div>currentRoundFoods: {{ currentRoundFoods }}</div>
    </div>
    -->

    <footer>
      <div class="mx-auto flex items-center justify-center p-2">
        <img
          class="h-14 w-auto"
          :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-white.png`"
          alt=""
        />
      </div>
    </footer>
  </div>
</template>

<style scoped>
#FoodNinjaSeriousGameView {
  background: #983aa0;
  background: linear-gradient(135deg, #009999, #92278f, #f5a623);
  background-image: url(https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg);
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #009999, #92278f, #f5a623),
    url(https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg);
  background-blend-mode: overlay;
  background-size: contain;
  background-repeat: repeat;
  background-position: center;
}

#FoodNinjaSeriousGameView .header-wrapper {
  padding: 16px;
}

#FoodNinjaSeriousGameView header {
  background: #983aa0;
  background: linear-gradient(135deg, #009999, #92278f, #f5a623);
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
  /* SHADOWS: https://getcssscan.com/css-box-shadow-examples */
  box-shadow:
    rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  border-radius: 20px;
}
#FoodNinjaSeriousGameView header .Scores {
  font-family: "Knewave", cursive;
}

.notification-wrapper {
  position: absolute;
  top: 40px; /* TODO Find the optimal placement */
  /* left: 10px; */
  /* right: 10px; */
  width: 100%;
  text-align: center;
  margin: 20px auto;
  /* border: 1px solid yellow; */
  z-index: 1000;
}

.notification {
  display: inline-block;
  padding: 6px;
  margin: 0 6px;
  font-size: 18px;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 4px 6px,
    rgba(0, 0, 0, 0.2) 0px 1px 3px;
  animation: slide-in 0.3s ease-out;
}

.notification.success {
  background-color: #d4edda;
  color: #22c55e;
  border: 1px solid black;
}

.notification.error {
  background-color: #f8d7da;
  color: #ef4444;
  border: 1px solid black;
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
