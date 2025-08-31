<script setup>
import { ref, onBeforeMount } from "vue";
import { LANGUAGES } from "@/locales/languages.js";
const PUBLIC_PATH = import.meta.env.BASE_URL;
import { useAuth } from "@/composables/useAuth.js";

const { isAuthenticated, login, logout, username, userId } = useAuth();

const selectedLanguageCodeRef = ref("en");

onBeforeMount(() => {
  const localStorageLanguageCode = localStorage.getItem("languageCode") || "en";
  selectedLanguageCodeRef.value = localStorageLanguageCode;
});

const onLanguageSelection = (event) => {
  const languageCode = event.target.value;
  selectedLanguageCodeRef.value = languageCode;
  localStorage.setItem("languageCode", languageCode);
  window.location.reload();
};
</script>

<template>
  <!-- TODO Improve me! Logos, names, description (repository - HUA's contribution) -->
  <main>
    <div class="h-24"></div>
    <div id="IntroBox" class="overflow-hidden bg-gray-50">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex flex-col text-center space-y-6">
          <div class="flex items-center justify-center">
            <img
              class="h-14 w-auto"
              :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-colour-NOSPACE.png`"
              alt=""
            />
          </div>
          <div>
            <button v-if="!isAuthenticated" @click="login" type="button" class="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Sign in</button>
            <div v-else>
              <p class="mb-2">Hi, <span class="font-bold">{{ username }}</span></p>
              <button @click="logout" type="button" class="flex w-full justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm/6 font-semibold text-gray-700 hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500">Sign out</button>
            </div>
          </div>
          <router-link to="/marketplace">Marketplace</router-link>
          <router-link to="/food-ninja-story-mode-index">Food Ninja</router-link>
          <router-link to="/food-quiz-story-mode-index">Food Quiz</router-link>
          <router-link to="/lets-move">Let's Move</router-link>
          <router-link to="/food-treasure-index">Food Treasure</router-link>
          <router-link to="/food-treasure-qr-listing">Food Treasure (QR Listing)</router-link>

          <router-link to="/home-legacy" class="text-sm text-gray-400">Legacy</router-link>

          <select v-model="selectedLanguageCodeRef" @change="onLanguageSelection">
            <option v-for="language in LANGUAGES" :key="language.code" :value="language.code">
              {{ language.name }} ({{ language.nameEnglish }})
            </option>
          </select>
          <!--
          <router-link to="/lets-move">Let's Move</router-link>
          -->
          <div class="flex items-center justify-center">
            <img class="h-16 w-auto" :src="`${PUBLIC_PATH}logo/HUA-Logo-Blue-RGB.png`" alt="" />
          </div>

          <div class="text-blue-400">
            <small><pre>V20250901</pre></small>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
#IntroBox {
  max-width: 300px;
  margin: 0 auto;

  box-shadow:
    rgb(0, 0, 0) 0px 0px 0px 2px inset,
    rgb(255, 255, 255) 10px -10px 0px -3px,
    rgb(0, 0, 0) 10px -10px,
    rgb(255, 255, 255) 20px -20px 0px -3px,
    rgb(0, 0, 0) 20px -20px,
    rgb(255, 255, 255) 30px -30px 0px -3px,
    rgb(0, 0, 0) 30px -30px,
    rgb(255, 255, 255) 40px -40px 0px -3px,
    rgb(0, 0, 0) 40px -40px;
}
</style>
