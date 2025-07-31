<script setup>
const PUBLIC_PATH = import.meta.env.BASE_URL;
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
          <router-link to="/">back to Home</router-link>
          <router-link to="/food-ninja-free-mode">Food Ninja (free mode)</router-link>
          <router-link to="/food-quiz-free-mode">Food Quiz (free mode)</router-link>

          <div class="flex items-center justify-center">
            <img class="h-16 w-auto" :src="`${PUBLIC_PATH}logo/HUA-Logo-Blue-RGB.png`" alt="" />
          </div>

          <div class="text-red-400">
            <small
            >Food Ninja (free mode) and Food Quiz (free mode) are no longer supported. They remain
              available for historical and documentation purposes, but no further development is
              planned.</small
            >
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
