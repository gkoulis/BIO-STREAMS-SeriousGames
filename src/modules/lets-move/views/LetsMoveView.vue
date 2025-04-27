<script setup>
import { ref, onBeforeMount } from "vue";
import { loadJson } from "@/common/load-json.js";

const PUBLIC_PATH = import.meta.env.BASE_URL;

const videoListRef = ref([]);

const selectedVideoRef = ref(null);
const selectVideo = (videoObject) => {
  selectedVideoRef.value = videoObject;
};

const selectRandomVideo = () => {
  const randomIndex = Math.floor(Math.random() * videoListRef.value.length);
  selectedVideoRef.value = videoListRef.value[randomIndex];
};

// 🧠 Run before mount
onBeforeMount(async () => {
  const languageCode = localStorage.getItem("languageCode");
  const responseJson = await loadJson(`/sr-letsmove/${languageCode}/content.json`);
  videoListRef.value = responseJson.videoList;
});
</script>

<template>
  <div class="LetsMoveSeriousGameView">
    <div class="mx-auto max-w-2xl">
      <div class="p-4 space-y-4">
        <!-- #505050 #484848-->
        <div
          class="CommonContainerForSeriousGames--White flex items-center justify-center"
          style="background: #fff"
        >
          <img class="h-14 w-auto" :src="`${PUBLIC_PATH}logo/lets-move-logo-0001.png`" alt="" />
        </div>
        <template v-if="selectedVideoRef">
          <div class="LetsMoveVideoObjectContainer1">
            <div class="video-container">
              <video
                :src="`${selectedVideoRef.videoSrc}`"
                controls
                autoplay
                class="video-player"
                style="width: 100%"
              >
                {{ $t("letsmove.browser_video_tag_warning") }}
              </video>
            </div>
            <div class="py-2 px-4 text-center">
              <p class="text-xl">{{ selectedVideoRef.name }}</p>
            </div>
            <div class="p-2 flex items-center justify-center">
              <button
                class="px-4 py-1 text-center bg-gray-600 text-white rounded"
                @click="selectVideo(null)"
              >
                {{ $t("letsmove.Return to start page") }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="CommonContainerForSeriousGames--White flex items-center justify-center"
            style="background: #ff718d"
            @click="selectRandomVideo"
          >
            <button
              class="flex items-center justify-between space-x-2"
              style="color: white; font-weight: bold"
            >
              <span>{{ $t("letsmove.random exercise") }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </button>
          </div>

          <div
            class="LetsMoveVideoObjectContainer1"
            v-for="videoObj in videoListRef"
            :key="videoObj.name"
            @click="selectVideo(videoObj)"
          >
            <!--
            <img :src="`${PUBLIC_PATH}lets-move-thumbnails/${videoObj.imageSrc}`" :alt="videoObj.name" class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
            -->
            <img :src="`${videoObj.imageSrc}`" :alt="videoObj.name" class="w-full" />
            <div class="py-2 px-4 text-center">
              <p class="text-xl">{{ videoObj.name }}</p>
            </div>
            <!--
            <div class="py-2 px-4 flex items-center justify-between">
              <p class="text-xl">{{ videoObj.name }}</p>
              <button class="p-1 rounded" style="background: white; border: 1px solid #fe2c55; font-weight: bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fe2c55" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </button>
            </div>
            -->
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.LetsMoveSeriousGameView {
  min-height: 100vh;

  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23ff718d' fill-opacity='0.31'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.LetsMoveVideoObjectContainer1 {
  padding: 0;
  border-radius: 20px;
  background: white;
  /* background-color: pink; */
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.LetsMoveVideoObjectContainer1 img {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
</style>
