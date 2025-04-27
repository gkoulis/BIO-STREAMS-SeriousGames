<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import FoodNinjaStoreModeSeriousGameTheme from "./FoodNinjaStoreModeSeriousGameTheme.vue";

const route = useRoute();
const router = useRouter();

const THEME_ID = route.params.themeId;
const THEME_REF = ref(null);

onBeforeMount(() => {
  THEME_REF.value = null;

  const languageCode = localStorage.getItem("languageCode");

  let key = `food-ninja-story-mode-data-THEME_BY_ID_REF-${languageCode}`;
  const jsonString = localStorage.getItem(key);
  if (jsonString === null || jsonString === undefined) {
    console.warn("Could not load Local Storage entry");
    router.push({ name: "food-ninja-story-mode-index" });
    return;
  }

  let themeById = null;
  try {
    themeById = JSON.parse(jsonString);
  } catch (ignored) {
    console.warn("Could not parse jsonString");
    router.push({ name: "food-ninja-story-mode-index" });
    return;
  }

  let themeIdNumber;
  try {
    themeIdNumber = Number(THEME_ID);
  } catch (ignored) {
    console.warn("Could not convert themeId param to number");
    router.push({ name: "food-ninja-story-mode-index" });
    return;
  }

  const theme = themeById[themeIdNumber];
  if (theme === null || theme === undefined) {
    console.warn("Theme does not exist");
    router.push({ name: "food-ninja-story-mode-index" });
    return;
  }

  THEME_REF.value = theme;
});
</script>

<template>
  <div id="FoodNinjaStoryModeSeriousGameGameplayView" v-if="THEME_REF">
    <FoodNinjaStoreModeSeriousGameTheme :theme="THEME_REF" />
    <!--
    <pre>{{ THEME_REF }}</pre>
    -->
  </div>
</template>

<style scoped></style>
