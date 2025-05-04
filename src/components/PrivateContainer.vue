<script setup>
import { defineProps, toRefs } from "vue";
const PUBLIC_PATH = import.meta.env.BASE_URL;

const props = defineProps({
  isContainer: {
    type: Boolean,
    default: true,
  },
});

const { isContainer } = toRefs(props);
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="p-4 space-y-4">
      <div class="CommonContainerForSeriousGames--White flex items-center justify-center">
        <img
          class="h-14 w-auto"
          :src="`${PUBLIC_PATH}logo/BIO-STREAMS-logo-RGB_BIOSTREAMS-Full-logo-colour-NOSPACE.png`"
          alt=""
        />
      </div>

      <div
        :class="{
          Container1: isContainer,
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.Container1 {
  padding: 0;
  border-radius: 20px;
  background: white;
  /* background-color: pink; */
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.15);
}
</style>
