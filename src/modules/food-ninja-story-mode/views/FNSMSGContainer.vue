<script setup>
const PUBLIC_PATH = import.meta.env.BASE_URL;
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="p-4 space-y-4">
      <div
        class="CommonContainerForSeriousGames--White CommonContainerForSeriousGames--White-1 flex items-center justify-center"
      >
        <img class="h-14 w-auto" :src="`${PUBLIC_PATH}logo/ninja-logo-0001.png`" alt="" />
      </div>

      <!-- TODO Optional container. Check in the food-ninja-story-mode -->
      <div class="Container1">
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
.CommonContainerForSeriousGames--White-1 {
  background: #983aa0;
  background: linear-gradient(135deg, #009999, #92278f, #f5a623);
}
.CommonContainerForSeriousGames--White-2 {
  background: #983aa0;
  background: linear-gradient(135deg, #f5a623, #92278f, #009999);
}
</style>
