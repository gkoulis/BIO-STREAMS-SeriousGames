<script setup>
import { onMounted, ref, reactive, defineEmits, defineProps, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import cloneDeep from "lodash/cloneDeep";
import Phaser from "phaser";

const props = defineProps({
  level: Object,
});

const { level } = toRefs(props); // I do not listen for changes. Parent changes do not have an effect in here.
const LEVEL = cloneDeep(level.value);
const ITEM_LIST = LEVEL.items;

const { t } = useI18n();

const emit = defineEmits(["onCompleted"]);

const dynamicStyle = reactive({
  width: "100px",
  margin: "0 auto",
});
const FOOD_DISPLAY_SIZE = 100; // TODO Automatic based on common dimensions and devices.
const FOOD_RADIUS = 40; // Avoid overlap radius
const WIDTH_OFFSET = 0; // TODO Automatic.
const HEIGHT_OFFSET = 0; // TODO Automatic.

const correctCount = ref(0);
const wrongCount = ref(0);
const remainingTargetItemsCountRef = ref(ITEM_LIST.filter((item) => item.target).length);

// TODO On Destroy release resources (delete, flush, destroy, clean everything!)

onMounted(async () => {
  const gameWidth = window.innerWidth - WIDTH_OFFSET;
  const gameHeight = window.innerHeight - HEIGHT_OFFSET;

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
  // const game = new Phaser.Game(config);
  new Phaser.Game(config);

  let GAMEPLAY_ITEM_LIST = []; // To track Gameplay Items.
  let slicing = false; // Flag for slicing state.
  let sliceLine; // Reference to slicing line.
  let lastPointerPosition = null; // To track last pointer position.

  function preload() {
    for (const item of ITEM_LIST) {
      this.load.image(item.id, item.imageURL);
    }

    this.load.audio("correct", "/sr-foodninjastorymode/audio/slice.mp3");
    this.load.audio("incorrect", "/sr-foodninjastorymode/audio/incorrect.mp3");
    this.load.audio("nextRoundSuccess", "/sr-foodninjastorymode/audio/win.mp3");
  }

  function create() {
    // Reset the game state at the start.
    resetGameState.call(this);

    // Unlock audio context on user interaction.
    // TODO Bug: Sometimes it does not work.
    this.input.once("pointerdown", () => this.sound.context.resume());
    this.input.once("pointerup", () => this.sound.context.resume());
    this.input.once("pointermove", () => this.sound.context.resume());

    // TODO Add multiple texts: Level, remaining, etc. Better font. Better UX.
    this.add.text(10, 10, LEVEL.title, {
      font: "20px Arial",
      fill: "#000000",
    });

    // Generate non-overlapping random positions for Items.
    const positions = generateRandomPositions(ITEM_LIST.length);

    // Display Items with images and movement.
    ITEM_LIST.forEach((item, index) => {
      if (item === null || item === undefined) {
        console.warn("found null Item in index " + index);
        return;
      }

      const [x, y] = positions[index];

      // GI stands for Gameplay Image.
      const itemGI = this.add.image(x, y, item.id).setInteractive();

      itemGI.setDisplaySize(FOOD_DISPLAY_SIZE, FOOD_DISPLAY_SIZE); // Scale the image to a fixed size.
      itemGI.setData("id", item.id);
      itemGI.setData("name", item.name);
      itemGI.setData("target", item.target);
      // @future I can add more data (e.g., category).
      itemGI.rotation = Phaser.Math.FloatBetween(0, Math.PI * 2); // Start with a random rotation angle.
      GAMEPLAY_ITEM_LIST.push(itemGI); // Store for later slicing logic.

      const speed = Phaser.Math.FloatBetween(1000, 3000); // Assign random speed in ms.
      addMovement.call(this, itemGI, speed); // Apply random movement.
    });

    // Add slicing line graphics.
    sliceLine = this.add.graphics();

    // Mouse input for slicing.
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
        checkIntersection.call(this, pointer.x, pointer.y);
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

    // Destroy all existing Gameplay Items.
    GAMEPLAY_ITEM_LIST.forEach((item) => item.destroy());
    GAMEPLAY_ITEM_LIST = [];

    // Clear sliceLine graphics.
    if (sliceLine) {
      sliceLine.clear();
    }

    correctCount.value = 0;
    wrongCount.value = 0;

    // Remove lingering pointer events.
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
    sliceLine.lineStyle(2, 0xff0000, 1); // Red slicing line.
    sliceLine.beginPath();
    sliceLine.moveTo(lastPointerPosition.x, lastPointerPosition.y);
    sliceLine.lineTo(x, y);
    sliceLine.strokePath();
  }

  function checkIntersection(x, y) {
    GAMEPLAY_ITEM_LIST = GAMEPLAY_ITEM_LIST.filter((item) => {
      // NOTICE: We are iterating gameplay items.

      if (lastPointerPosition === null || lastPointerPosition === undefined) {
        return true; // Include (NON-IDEAL CONDITION).
      }

      const bounds = item.getBounds();
      const sliceLine = new Phaser.Geom.Line(lastPointerPosition.x, lastPointerPosition.y, x, y);

      if (!Phaser.Geom.Intersects.LineToRectangle(sliceLine, bounds)) {
        return true; // Include.
      }

      // const itemID = item.getData("id");
      // const itemName = item.getData("name");
      const itemTarget = item.getData("target");

      if (itemTarget === true) {
        this.sound.play("correct");
        correctCount.value++;
        remainingTargetItemsCountRef.value--;

        item.setAlpha(0.5);
        setTimeout(() => item.destroy(), 100);

        if (remainingTargetItemsCountRef.value === 0) {
          handleWin.call(this);
        }

        return false; // Exclude!
      } else {
        this.sound.play("incorrect");
        wrongCount.value++;

        // In story mode, we do not reset after a wrong slice.
        // resetGameState.call(this);
        // this.scene.restart();
      }

      return true; // Include.
    });
  }

  function handleWin() {
    this.sound.play("nextRoundSuccess");

    // In story mode, we do not restart the scene.
    // Instead, we emit a signal to parent component to load the next level.
    // this.scene.restart();

    emit("onCompleted");
  }

  // Movements
  // --------------------------------------------------

  function addMovement(item, speed) {
    const movementType = Phaser.Math.RND.pick([
      "sinusoidal",
      "circular",
      "diagonal",
      "bounce",
      "jitter",
    ]);

    switch (movementType) {
      case "sinusoidal":
        addSinusoidalMovement.call(this, item, speed);
        break;
      case "circular":
        addCircularMovement.call(this, item, speed);
        break;
      case "diagonal":
        addDiagonalMovement.call(this, item, speed);
        break;
      case "bounce":
        addBounceMovement.call(this, item, speed);
        break;
      case "jitter":
        addJitterMovement.call(this, item);
        break;
    }
  }

  function addSinusoidalMovement(item, speed) {
    this.tweens.add({
      targets: item,
      y: item.y + Phaser.Math.Between(-50, 50),
      duration: speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  function addCircularMovement(item, speed) {
    const centerX = item.x;
    const centerY = item.y;
    const radius = Phaser.Math.Between(30, 60);
    const angle = { value: 0 };

    this.tweens.add({
      targets: angle,
      value: 2 * Math.PI,
      duration: speed,
      repeat: -1,
      ease: "Linear",
      onUpdate: () => {
        item.x = centerX + radius * Math.cos(angle.value);
        item.y = centerY + radius * Math.sin(angle.value);
      },
    });
  }

  function addDiagonalMovement(item, speed) {
    const targetX = item.x + Phaser.Math.Between(-100, 100);
    const targetY = item.y + Phaser.Math.Between(-100, 100);

    this.tweens.add({
      targets: item,
      x: targetX,
      y: targetY,
      duration: speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  function addBounceMovement(item, speed) {
    const startY = item.y;
    const bounceHeight = Phaser.Math.Between(30, 80);

    this.tweens.add({
      targets: item,
      y: startY - bounceHeight,
      duration: speed,
      yoyo: true,
      repeat: -1,
      ease: "Bounce.easeOut",
    });
  }

  function addJitterMovement(item) {
    this.time.addEvent({
      delay: Phaser.Math.Between(200, 500),
      callback: () => {
        item.x += Phaser.Math.Between(-10, 10);
        item.y += Phaser.Math.Between(-10, 10);
      },
      repeat: -1,
    });
  }

  function update() {
    // Rotate each Gameplay Item.
    GAMEPLAY_ITEM_LIST.forEach((item) => {
      item.rotation += 0.02;
    });
  }
});
</script>

<template>
  <div id="FoodNinjaStoreModeSeriousGameThemeLevel">
    <div id="phaser-game-container" :style="dynamicStyle"></div>
  </div>
</template>

<style scoped>
#FoodNinjaStoreModeSeriousGameThemeLevel {
}
</style>
