<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { loadJson } from "@/common/load-json.js";
import PrivateContainer from "@/modules/food-quiz-story-mode/views/PrivateContainer.vue";

const router = useRouter();

// const PUBLIC_PATH = import.meta.env.BASE_URL;

const LOADING_REF = ref(true);
const THEME_LIST_REF = ref([]);
const THEME_BY_ID_REF = ref({});

onBeforeMount(async () => {
  const languageCode = localStorage.getItem("languageCode");

  // --------------------------------------------------

  const jsonResponse = await loadJson(
    `/sr-foodquizstorymode/${languageCode}/content-theme-list.json`
  );

  THEME_LIST_REF.value = jsonResponse.themes;

  // Transform Themes.
  // --------------------------------------------------

  for (const theme of THEME_LIST_REF.value) {
    THEME_BY_ID_REF.value[theme.id] = theme;
  }

  // Persist (like state management but using local storage).
  // @future Use state management and pinia.
  // --------------------------------------------------

  let key;

  key = `food-quiz-story-mode-data-THEME_LIST_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(THEME_LIST_REF.value));

  key = `food-quiz-story-mode-data-THEME_BY_ID_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(THEME_BY_ID_REF.value));

  // --------------------------------------------------

  LOADING_REF.value = false;
});

const onThemeClick = (themeId) => {
  router.push({ name: "food-quiz-story-mode-gameplay", params: { themeId: themeId } });
};
</script>

<template>
  <div class="FoodQuizBackground" v-if="!LOADING_REF">
    <PrivateContainer :is-container="false">
      <div
        class="Container1 mb-4"
        v-for="theme in THEME_LIST_REF"
        :key="theme.id"
        @click="onThemeClick(theme.id)"
        style="cursor: pointer"
      >
        <!--
        <img :src="`${videoObj.imageSrc}`" :alt="videoObj.name" class="w-full" />
        -->
        <div class="py-4 px-4 text-left">
          <p class="text-xl">{{ theme.title }}</p>
          <p class="small text-gray-500">{{ theme.description }}</p>
        </div>
      </div>
    </PrivateContainer>
  </div>
</template>

<style scoped></style>
