<script setup>
import { ref, defineProps, toRefs, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import FoodTreasureSeriousGameThemeLevel from "./FoodTreasureSeriousGameThemeLevel.vue";
import PrivateContainer from "@/components/PrivateContainer.vue";

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

// TODO Create the same method for all. (composable or something).
async function submitRawScoreToApi({ score, duration, levelId, levelTitle, timestamp }) {
  if (!USER_ID) {
    console.warn("No userId provided; skipping score submit.");
    return;
  }

  const payload = {
    UserId: String(USER_ID),
    Score: score,
    Timestamp: timestamp || new Date().toISOString(),
    GameName: "Food Treasure",
    Level: `Stage ${levelId} - ${levelTitle}`,
    Duration: duration, // "HH:MM:SS"
    Source: "Linked",
  };

  const res = await fetch(
    "https://activehealth.dev.bio-streams.eu/api/seriousgames/scores/submit-raw-score",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        JsonPayload: JSON.stringify(payload),
      }),
    }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Score submit failed (${res.status}): ${txt}`);
  }

  // Some APIs return empty body; be tolerant
  const text = await res.text().catch(() => "");
  return text;
}

const handleOnCompleted = async ($event) => {
  // @future Utilize $event: correct, wrong tries, time, etc.
  themeStatusRef.value = "POST_ACTIVE";

  try {
    await submitRawScoreToApi($event);
    console.log("Score submitted:", $event);
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
  router.push({ name: "food-treasure-index" });
};
</script>

<template>
  <div class="FoodTreasureBackground">
    <!-- SPLASH: Theme is not yet started. -->
    <template v-if="themeStatusRef === 'SPLASH'">
      <private-container>
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
              {{ $t("actions.Go") }}! ✌️ 🗺️
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
      </private-container>
    </template>

    <!-- PRE_ACTIVE: Level is about to start. -->
    <template v-else-if="themeStatusRef === 'PRE_ACTIVE'">
      <template v-if="activeLevelRef">
        <private-container>
          <div class="py-6 px-6 text-center">
            <p class="text-xl">
              {{ activeLevelRef.title }} <small>({{ activeLevelRef.id }} / {{ MAX_LEVEL }})</small>
            </p>
            <div class="h-2"></div>
            <p class="text-gray-500 text-sm">{{ activeLevelRef.description }}</p>
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
        </private-container>
      </template>
    </template>

    <!-- PRE_ACTIVE: Level is active. -->
    <template v-else-if="themeStatusRef === 'ACTIVE'">
      <FoodTreasureSeriousGameThemeLevel
        :level="activeLevelRef"
        v-on:on-completed="handleOnCompleted"
      ></FoodTreasureSeriousGameThemeLevel>
    </template>

    <!-- PRE_ACTIVE: Level is completed. Users see messages. -->
    <template v-else-if="themeStatusRef === 'POST_ACTIVE'">
      <private-container>
        <div class="py-6 px-6 text-center">
          <p class="text-xl">
            👏 {{ $t("theme_level.you_completed_level") }} {{ activeLevelRef.id }}! 🎉
          </p>
          <div class="h-10"></div>
          <p class="text-xl">
            {{ activeLevelRef.title }}: {{ activeLevelRef.title_post }} <small>✅</small>
          </p>
          <div class="h-10"></div>
          <div class="space-y-4">
            <template v-for="message in activeLevelRef.messages" :key="message">
              <p class="text-lg text-green-950">✔️ {{ message }}</p>
            </template>
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
      </private-container>
    </template>

    <!-- COMPLETED: All Levels are completed. Theme is completed. -->
    <template v-else-if="themeStatusRef === 'COMPLETED'">
      <private-container>
        <div class="py-6 px-6 text-center">
          <p class="text-xl">🎉 {{ $t("theme_level.you_completed_all_levels") }} 🏁</p>
          <div class="h-8"></div>
          <ul class="">
            <template v-for="level in theme.levels" :key="level.id">
              <li>✅ {{ level.title }}: {{ level.title_post }}</li>
              <!-- TODO Add image too! -->
            </template>
          </ul>
          <div class="h-10"></div>
          <div class="space-x-2">
            <button
              @click="returnToIndex"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Food Treasure 🗺️
            </button>
          </div>
        </div>
      </private-container>
    </template>

    <template v-else>
      <p>Invalid status: {{ themeStatusRef }}</p>
    </template>
  </div>
</template>

<style scoped></style>
