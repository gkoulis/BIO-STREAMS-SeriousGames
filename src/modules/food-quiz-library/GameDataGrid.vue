<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  gameData: Object,
});

const { gameData } = toRefs(props);
</script>

<template>
  <template v-if="gameData">
    <div class="mx-auto">
      <div class="grid grid-cols-2 gap-px bg-red/5">
        <div class="bg-white p-4 text-center flex flex-col justify-center items-center">
          <p class="text-sm font-medium">{{ $t("foodquiz.Questions") }}</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-4xl font-semibold tracking-tight text-blue-500 NumFont1">
              {{ gameData.answersCount }} / {{ gameData.numberOfQuestions }}
            </span>
          </p>
        </div>
        <div class="bg-white p-4 text-center flex flex-col justify-center items-center">
          <p class="text-sm font-medium">{{ $t("foodquiz.Helps Used") }}</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-4xl font-semibold tracking-tight text-orange-500 NumFont1">
              {{ gameData.helpsUsedCount }} / {{ gameData.helpsTotalCount }}
            </span>
          </p>
        </div>

        <div class="bg-white p-4 text-center flex flex-col justify-center items-center">
          <p class="text-sm font-medium">{{ $t("foodquiz.Correct") }} ✅</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-4xl font-semibold tracking-tight text-green-500 NumFont1">
              {{ gameData.correctAnswerCount }}
            </span>
          </p>
        </div>
        <div class="bg-white p-4 text-center flex flex-col justify-center items-center">
          <p class="text-sm font-medium">{{ $t("foodquiz.Wrong") }} ❌</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-4xl font-semibold tracking-tight text-red-500 NumFont1">
              {{ gameData.wrongAnswerCount }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped></style>
