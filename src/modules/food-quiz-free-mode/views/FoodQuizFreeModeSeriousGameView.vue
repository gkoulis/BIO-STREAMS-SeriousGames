<script setup>
import { ref } from "vue";
import Game from "./Game.vue";

const PUBLIC_PATH = import.meta.env.BASE_URL;

const dataRef = ref({
  state: "CONFIG", // CONFIG, GAME
});

const gameConfigRef = ref({
  numberOfQuestions: 4,
});

// const availableHelps = [
//   {
//     id: 1,
//     text: "50-50",
//   },
//   {
//     id: 2,
//     text: "Hint",
//   },
//   {
//     id: 3,
//     text: "Skip"
//   }
// ];
</script>

<template>
  <div class="FoodQuizSeriousGameView p-4 space-y-4">
    <header class="CommonContainerForSeriousGames--White flex items-center justify-center">
      <img
        class="h-14 w-auto"
        :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-colour-NOSPACE.png`"
        alt=""
      />
    </header>

    <template v-if="dataRef.state === 'CONFIG'">
      <div class="CommonContainerForSeriousGames--White">
        <h3 class="text-base font-semibold text-gray-900">
          {{ $t("foodquiz.Food Quiz configuration") }}
        </h3>
        <!--
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>Change the email address you want associated with your account.</p>
        </div>
        -->
        <form class="mt-5 max-w-xs space-y-2">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">{{
              $t("foodquiz.Number of Questions")
            }}</label>
            <div class="mt-2">
              <input
                v-model="gameConfigRef.numberOfQuestions"
                type="number"
                name="numberOfQuestions"
                id="numberOfQuestions"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder=""
              />
            </div>
          </div>
          <!--
          <div class="bg-yellow-100 p-2">
            <p>More config to be added soon! (plus UI/UX improvements)</p>
          </div>
          -->
          <div>
            <button
              @click="dataRef.state = 'GAME'"
              type="button"
              class="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {{ $t("foodquiz.Go!") }}
            </button>
          </div>
        </form>
      </div>
    </template>

    <template v-else-if="dataRef.state === 'GAME'">
      <Game :game-config="gameConfigRef" v-on:on-return="dataRef.state = 'CONFIG'" />
    </template>

    <template v-else>
      <p>{{ $t("common.Something went wrong") }}</p>
    </template>
  </div>
</template>

<style scoped>
.FoodQuizSeriousGameView {
  min-height: 100vh;
  background-color: #f7b618;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23983aa0' fill-opacity='1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
}
</style>
