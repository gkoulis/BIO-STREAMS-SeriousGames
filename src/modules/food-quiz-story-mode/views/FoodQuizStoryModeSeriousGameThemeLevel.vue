<script setup>
import { defineEmits, defineProps, toRefs } from "vue";
import cloneDeep from "lodash/cloneDeep";
import Game from "@/modules/food-quiz-library/Game.vue";
import PrivateContainer from "./PrivateContainer.vue";

const emit = defineEmits(["onCompleted"]);

const props = defineProps({
  level: Object,
});

const { level } = toRefs(props);
const LEVEL = cloneDeep(level.value);

const handleOnReturn = ($event) => {};

const handleOnCompleted = ($event) => {
  emit("onCompleted", $event);
};
</script>

<template>
  <div class="FoodQuizBackground">
    <private-container :is-container="false">
      <div class="space-y-6">
        <Game
          :questions="LEVEL.questions"
          :show-after-game-actions="false"
          v-on:on-return="handleOnReturn"
          v-on:on-completed="handleOnCompleted"
        />
      </div>
    </private-container>
  </div>
</template>

<style scoped></style>
