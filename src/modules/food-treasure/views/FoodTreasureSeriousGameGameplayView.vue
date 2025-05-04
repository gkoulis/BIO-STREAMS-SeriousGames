<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import FoodTreasureSeriousGameTheme from "./FoodTreasureSeriousGameTheme.vue";

const route = useRoute();
const router = useRouter();

const THEME_ID = route.params.themeId;
const THEME_REF = ref(null);

const LOCAL_DATA_SUFFIX = "food-treasure-data-THEME_BY_ID_REF-";
const RETURN_VIEW_NAME = "food-treasure-index";

onBeforeMount(() => {
  THEME_REF.value = null;

  const languageCode = localStorage.getItem("languageCode");

  let key = `${LOCAL_DATA_SUFFIX}${languageCode}`;
  const jsonString = localStorage.getItem(key);
  if (jsonString === null || jsonString === undefined) {
    console.warn("Could not load Local Storage entry");
    router.push({ name: RETURN_VIEW_NAME });
    return;
  }

  let themeById = null;
  try {
    themeById = JSON.parse(jsonString);
  } catch (ignored) {
    console.warn("Could not parse jsonString");
    router.push({ name: RETURN_VIEW_NAME });
    return;
  }

  let themeIdNumber;
  try {
    themeIdNumber = Number(THEME_ID);
  } catch (ignored) {
    console.warn("Could not convert themeId param to number");
    router.push({ name: RETURN_VIEW_NAME });
    return;
  }

  const theme = themeById[themeIdNumber];
  if (theme === null || theme === undefined) {
    console.warn("Theme does not exist");
    router.push({ name: RETURN_VIEW_NAME });
    return;
  }

  THEME_REF.value = theme;
});
</script>

<template>
  <template v-if="THEME_REF">
    <FoodTreasureSeriousGameTheme :theme="THEME_REF" />
  </template>
</template>

<style scoped></style>
