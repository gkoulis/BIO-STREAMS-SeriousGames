<script setup>
import { ref, defineProps, toRefs, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import FoodNinjaStoreModeSeriousGameThemeLevel from "./FoodNinjaStoreModeSeriousGameThemeLevel.vue";
import FNSMSGContainer from "./FNSMSGContainer.vue";
import { submitRawScoreToApi } from "@/common/score-api-client";

const PUBLIC_PATH = import.meta.env.BASE_URL;
const winSoundRef = ref(null);

const router = useRouter();

const props = defineProps({
  theme: Object,
  userId: {
    type: [String, Number],
    required: false,
  },
});

const { theme, userId } = toRefs(props); // I do not listen for changes. Parent changes do not have an effect in here.

const THEME = cloneDeep(theme.value);
const USER_ID = userId.value;
const LEVEL_BY_ID = {};
for (const level of THEME.levels) {
  LEVEL_BY_ID[level.id] = level;
}
const MAX_LEVEL = THEME.levels.length;

const themeStatusRef = ref("SPLASH");
const activeLevelIdRef = ref(0);
const activeLevelRef = computed(() => {
  return LEVEL_BY_ID[activeLevelIdRef.value];
});

const lastLevelStatsRef = ref(null);

onBeforeMount(() => {
  themeStatusRef.value = "SPLASH";
});

const startTheme = () => {
  activeLevelIdRef.value = 1;
  themeStatusRef.value = "PRE_ACTIVE";
};

const startLevel = () => {
  themeStatusRef.value = "ACTIVE";
};

const handleOnCompleted = async (stats) => {
  // stats = { correct, wrong, score, duration, ... }
  lastLevelStatsRef.value = stats;

  themeStatusRef.value = "POST_ACTIVE";

  if (winSoundRef.value) {
    winSoundRef.value.play().catch((err) => console.warn("Audio play failed:", err));
  }

  try {
    const apiData = {
      userId: USER_ID,
      score: stats.score,
      timestamp: stats.timestamp,
      game: "Food Ninja Story Mode",
      theme: THEME.id,
      themeLevel: activeLevelIdRef.value,
      duration: stats.duration,
    };
    await submitRawScoreToApi(apiData);
    console.log("Score submitted:", apiData);
  } catch (e) {
    console.warn(e);
  }
};

const goToNextLevelOrCompleteTheme = () => {
  activeLevelIdRef.value = activeLevelIdRef.value + 1;
  if (activeLevelIdRef.value > MAX_LEVEL) {
    themeStatusRef.value = "COMPLETED";
  } else {
    themeStatusRef.value = "PRE_ACTIVE";
  }
};

const returnToIndex = () => {
  router.push({ name: "food-ninja-story-mode-index" });
};
</script>

<template>
  <div class="FoodNinjaStoryModeSeriousGameView">
    <!-- SPLASH: Theme is not yet started. -->
    <template v-if="themeStatusRef === 'SPLASH'">
      <f-n-s-m-s-g-container>
        <div class="py-6 px-6 text-center">
          <p class="text-xl">{{ theme.title }}!</p>
          <div class="h-2"></div>
          <p class="text-gray-500 text-sm">{{ theme.description }}</p>
          <div class="h-8"></div>
          <p class="text-yellow-600">{{ $t("theme_level.Levels") }}:</p>
          <ul class="">
            <template v-for="level in theme.levels" :key="level.id">
              <li>➡️ {{ level.title }}</li>
            </template>
          </ul>
          <div class="h-10"></div>
          <div class="space-x-2">
            <button
              @click="startTheme"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {{ $t("actions.Go") }}! ✌️ 🥷
            </button>
            <button
              @click="returnToIndex"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {{ $t("actions.Return") }}
            </button>
          </div>
        </div>
      </f-n-s-m-s-g-container>
    </template>

    <!-- PRE_ACTIVE: Level is about to start. -->
    <template v-else-if="themeStatusRef === 'PRE_ACTIVE'">
      <template v-if="activeLevelRef">
        <f-n-s-m-s-g-container>
          <div class="py-6 px-6 text-center">
            <p class="text-xl">
              {{ activeLevelRef.title }} <small>({{ activeLevelRef.id }} / {{ MAX_LEVEL }})</small>
            </p>
            <div class="h-10"></div>
            <div class="space-x-2">
              <button
                @click="startLevel"
                type="button"
                class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {{ $t("actions.Go") }}! 🚀
              </button>
            </div>
          </div>
        </f-n-s-m-s-g-container>
      </template>
    </template>

    <!-- PRE_ACTIVE: Level is active. -->
    <template v-else-if="themeStatusRef === 'ACTIVE'">
      <FoodNinjaStoreModeSeriousGameThemeLevel
        :level="activeLevelRef"
        v-on:on-completed="handleOnCompleted"
      ></FoodNinjaStoreModeSeriousGameThemeLevel>
    </template>

    <!-- POST_ACTIVE: Level is completed. Users see messages. -->
    <template v-else-if="themeStatusRef === 'POST_ACTIVE'">
      <f-n-s-m-s-g-container>
        <div class="py-6 px-6 text-center">
          <p class="text-xl">
            👏 {{ $t("theme_level.you_completed_level") }} {{ activeLevelRef.id }}! 🎉
          </p>
          <div class="h-10"></div>
          <p class="text-xl">{{ activeLevelRef.title }} <small>✅</small></p>
          <div class="h-10"></div>
          <div class="space-y-4">
            <template v-for="message in activeLevelRef.messages" :key="message">
              <p class="text-lg text-green-950">✔️ {{ message }}</p>
            </template>
          </div>
          <div class="h-10"></div>
          <div v-if="lastLevelStatsRef" class="mt-6 text-sm text-gray-600 space-y-1">
            <p>
              ⏱️ <b>{{ lastLevelStatsRef.duration }}</b>
            </p>
            <p>
              🎯 {{ $t("foodquiz.Score") }}: <b>{{ lastLevelStatsRef.score }}</b>
            </p>
            <p>
              ✅ {{ $t("foodquiz.Correct") }}: {{ lastLevelStatsRef.correct }} | ❌ {{ $t("foodquiz.Wrong") }}: {{ lastLevelStatsRef.wrong }}
            </p>
          </div>
          <div class="h-10"></div>
          <div class="space-x-2">
            <button
              @click="goToNextLevelOrCompleteTheme"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {{ $t("actions.Next") }}! 🚀
            </button>
          </div>
        </div>
      </f-n-s-m-s-g-container>
    </template>

    <!-- COMPLETED: All Levels are completed. Theme is completed. -->
    <template v-else-if="themeStatusRef === 'COMPLETED'">
      <f-n-s-m-s-g-container>
        <div class="py-6 px-6 text-center">
          <p class="text-xl">🎉 {{ $t("theme_level.you_completed_all_levels") }} 🏁</p>
          <div class="h-8"></div>
          <ul class="">
            <template v-for="level in theme.levels" :key="level.id">
              <li>✅ {{ level.title }}</li>
            </template>
          </ul>
          <div class="h-10"></div>
          <div class="space-x-2">
            <button
              @click="returnToIndex"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Food Ninja 🥷
            </button>
          </div>
        </div>
      </f-n-s-m-s-g-container>
    </template>

    <template v-else>
      <p>Invalid status: {{ themeStatusRef }}</p>
    </template>
  </div>

  <audio ref="winSoundRef" :src="`${PUBLIC_PATH}sr-foodninjastorymode/audio/win.mp3`" />
</template>

<style scoped>
.FoodNinjaStoryModeSeriousGameView {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf5f5 0%, #fdfaf7 100%);
}
</style>
