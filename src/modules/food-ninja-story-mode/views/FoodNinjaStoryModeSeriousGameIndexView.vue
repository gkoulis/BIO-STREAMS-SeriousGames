<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import { loadJson } from "@/common/load-json.js";

const router = useRouter();

const PUBLIC_PATH = import.meta.env.BASE_URL;

const LOADING_REF = ref(true);
const ITEM_LIST_REF = ref([]);
const ITEM_BY_ID_REF = ref({});
const THEME_LIST_REF = ref([]);
const THEME_BY_ID_REF = ref({});

onBeforeMount(async () => {
  // TODO Important validation for Food Ninja and Food Quiz. Themes and Levels must have incremental integer ID.
  // TODO ENSURE IT OTHERWISE THE GAME BREAKS!

  const languageCode = localStorage.getItem("languageCode");

  const jsonResponse1 = await loadJson(
    `/sr-foodninjastorymode/${languageCode}/content-item-list.json`
  );
  const jsonResponse2 = await loadJson(
    `/sr-foodninjastorymode/${languageCode}/content-theme-list.json`
  );

  ITEM_LIST_REF.value = jsonResponse1.items;
  THEME_LIST_REF.value = jsonResponse2.themes;

  // Transform Items.
  // --------------------------------------------------

  for (let i = 0; i < ITEM_LIST_REF.value.length; i++) {
    const item = ITEM_LIST_REF.value[i];
    ITEM_LIST_REF.value[i].imageURL =
      `/sr-foodninjastorymode/images/${item.subDirectory}/${item.texture}`;
  }

  for (const item of ITEM_LIST_REF.value) {
    ITEM_BY_ID_REF.value[item.id] = item;
  }

  // Transform Themes.
  // --------------------------------------------------

  for (let i = 0; i < THEME_LIST_REF.value.length; i++) {
    for (let j = 0; j < THEME_LIST_REF.value[i].levels.length; j++) {
      const level = THEME_LIST_REF.value[i].levels[j];

      const itemListNew = [];
      const itemList = level.items;

      for (const temp of itemList) {
        const item = ITEM_BY_ID_REF.value[temp.id];
        if (item === null || item === undefined) {
          console.warn(temp.id + " does not exit in ITEM_LIST_BY_ID");
          continue;
        }

        const clonedItem = cloneDeep(item);
        clonedItem.target = temp.target;

        itemListNew.push(clonedItem);
      }

      THEME_LIST_REF.value[i].levels[j].items = itemListNew;
    }
  }

  for (const theme of THEME_LIST_REF.value) {
    THEME_BY_ID_REF.value[theme.id] = theme;
  }

  // Persist (like state management but using local storage).
  // @future Use state management and pinia.
  // --------------------------------------------------

  let key;

  key = `food-ninja-story-mode-data-ITEM_LIST_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(ITEM_LIST_REF.value));

  key = `food-ninja-story-mode-data-ITEM_BY_ID_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(ITEM_BY_ID_REF.value));

  key = `food-ninja-story-mode-data-THEME_LIST_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(THEME_LIST_REF.value));

  key = `food-ninja-story-mode-data-THEME_BY_ID_REF-${languageCode}`;
  localStorage.setItem(key, JSON.stringify(THEME_BY_ID_REF.value));

  // --------------------------------------------------

  LOADING_REF.value = false;
});

const onThemeClick = (themeId) => {
  router.push({ name: "food-ninja-story-mode-gameplay", params: { themeId: themeId } });
};
</script>

<template>
  <div class="FoodNinjaStoryModeSeriousGameView" v-if="!LOADING_REF">
    <div class="mx-auto max-w-2xl">
      <div class="p-4 space-y-4">
        <div
          class="CommonContainerForSeriousGames--White CommonContainerForSeriousGames--White-1 flex items-center justify-center"
        >
          <img class="h-14 w-auto" :src="`${PUBLIC_PATH}logo/ninja-logo-0001.png`" alt="" />
        </div>
        <div
          class="Container1"
          v-for="theme in THEME_LIST_REF"
          :key="theme.id"
          @click="onThemeClick(theme.id)"
        >
          <!--
          <img :src="`${videoObj.imageSrc}`" :alt="videoObj.name" class="w-full" />
          -->
          <div class="py-4 px-4 text-left">
            <p class="text-xl">{{ theme.title }}</p>
            <p class="small text-gray-500">{{ theme.description }}</p>
          </div>
        </div>
        <div
          class="CommonContainerForSeriousGames--White CommonContainerForSeriousGames--White-2 flex items-center justify-center"
        >
          <img
            class="h-20 w-auto"
            :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-white.png`"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.FoodNinjaStoryModeSeriousGameView {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf5f5 0%, #fdfaf7 100%);
}
.Container1 {
  padding: 0;
  border-radius: 20px;
  background: white;
  /* background-color: pink; */
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.CommonContainerForSeriousGames--White-1 {
  background: #983aa0;
  background: linear-gradient(135deg, #009999, #92278f, #f5a623);
}
.CommonContainerForSeriousGames--White-2 {
  background: #983aa0;
  background: linear-gradient(135deg, #f5a623, #92278f, #009999);
}
</style>
