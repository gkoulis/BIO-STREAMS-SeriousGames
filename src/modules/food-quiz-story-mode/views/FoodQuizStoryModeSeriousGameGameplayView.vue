<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import FoodQuizStoryModeSeriousGameTheme from "./FoodQuizStoryModeSeriousGameTheme.vue";

const route = useRoute();
const router = useRouter();

const THEME_ID = route.params.themeId;
const THEME_REF = ref(null);

onBeforeMount(() => {
  THEME_REF.value = null;

  const languageCode = localStorage.getItem("languageCode");

  let key = `food-quiz-story-mode-data-THEME_BY_ID_REF-${languageCode}`;
  const jsonString = localStorage.getItem(key);
  if (jsonString === null || jsonString === undefined) {
    console.warn("Could not load Local Storage entry");
    router.push({ name: "food-quiz-story-mode-index" });
    return;
  }

  let themeById = null;
  try {
    themeById = JSON.parse(jsonString);
  } catch (ignored) {
    console.warn("Could not parse jsonString");
    router.push({ name: "food-quiz-story-mode-index" });
    return;
  }

  let themeIdNumber;
  try {
    themeIdNumber = Number(THEME_ID);
  } catch (ignored) {
    console.warn("Could not convert themeId param to number");
    router.push({ name: "food-quiz-story-mode-index" });
    return;
  }

  const theme = themeById[themeIdNumber];
  if (theme === null || theme === undefined) {
    console.warn("Theme does not exist");
    router.push({ name: "food-quiz-story-mode-index" });
    return;
  }

  THEME_REF.value = theme;
});
</script>

<template>
  <template v-if="THEME_REF">
    <FoodQuizStoryModeSeriousGameTheme :theme="THEME_REF" />
  </template>
</template>

<style scoped></style>
