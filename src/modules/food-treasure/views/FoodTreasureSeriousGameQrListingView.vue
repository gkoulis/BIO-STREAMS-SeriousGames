<script setup>
import { ref, onBeforeMount } from "vue";
import { loadJson } from "@/common/load-json.js";
import PrivateContainer from "@/modules/food-quiz-story-mode/views/PrivateContainer.vue";
import QrcodeVue from "qrcode.vue";

const LOADING_REF = ref(true);
const THEME_LIST_REF = ref([]);

onBeforeMount(async () => {
  const languageCode = localStorage.getItem("languageCode");

  const jsonResponse = await loadJson(`/sr-foodtreasure/${languageCode}/content-theme-list.json`);

  THEME_LIST_REF.value = jsonResponse.themes;

  LOADING_REF.value = false;
});
</script>

<template>
  <div class="FoodTreasureBackground" v-if="!LOADING_REF">
    <PrivateContainer :is-container="false">
      <div class="space-y-4">
        <template v-for="theme in THEME_LIST_REF" :key="theme.id">
          <div class="Container1">
            <div class="py-4 px-4 text-center">
              <p class="text-xl">
                Theme: {{ theme.title }} <small>({{ theme.id }})</small>
              </p>
            </div>
          </div>

          <template v-for="level in theme.levels" :key="`${theme.id}-${level.id}`">
            <div class="Container1">
              <div class="py-4 px-4 text-center space-y-2" style="width: 100%">
                <p class="text-xl">
                  Theme: {{ theme.title }} <small>({{ theme.id }})</small>
                </p>
                <p class="text-xl">
                  Level: {{ level.title }} / {{ level.title_post }} <small>({{ level.id }})</small>
                </p>
                <qrcode-vue
                  :value="level.secret_code"
                  :size="400"
                  style="margin-left: auto; margin-right: auto"
                />
                <pre>{{ level.secret_code }}</pre>
              </div>
            </div>
          </template>
        </template>
      </div>
    </PrivateContainer>
  </div>
</template>

<style scoped></style>
