<script setup>
import { ref, defineProps, toRefs, defineEmits } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";

const emit = defineEmits(["onCompleted"]);

const props = defineProps({
  qrTarget: Object,
});

const { qrTarget } = toRefs(props); // I do not listen for changes. Parent changes do not have an effect in here.

const HINTS = qrTarget.value.hints;
const SECRET_CODE = qrTarget.value.secret_code;
const IMAGE_URL = qrTarget.value.image_url;
const foundRef = ref(false);
const showInvalidQrRef = ref(false);
const scannedRef = ref(null);
let errorTimeout = null;

function onError($event) {
  console.warn($event);
}

function onDetect($event) {
  if (foundRef.value) {
    return;
  }
  if ($event === null || $event === undefined) {
    return;
  }
  if ($event.length <= 0) {
    return;
  }
  const firstDetection = $event[0];
  if (firstDetection.format !== "qr_code") {
    return;
  }
  const scanned = firstDetection.rawValue;
  scannedRef.value = scanned;

  if (scanned === SECRET_CODE) {
    foundRef.value = true;
    showInvalidQrRef.value = false;
    clearTimeout(errorTimeout);
  } else {
    foundRef.value = false;
    showInvalidQrRef.value = true;

    // Clear previous timeout if exists.
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    errorTimeout = setTimeout(() => {
      showInvalidQrRef.value = false;
    }, 3000);
  }
}

function onCompleted() {
  emit("onCompleted");
}
</script>

<template>
  <div class="relative w-full h-[80vh] bg-black overflow-hidden">
    <!-- CAMERA + QR CODE SCANNER -->
    <!-- :paused="foundRef === true" -->
    <qrcode-stream v-on:detect="onDetect" v-on:error="onError" class="z-0" />

    <div
      v-if="!foundRef"
      class="absolute inset-0 flex flex-col items-center justify-top z-30 bg-black bg-opacity-60"
    >
      <div class="p-4 text-center space-y-4">
        <p class="text-xl">🔍</p>
        <template v-for="hint in HINTS" :key="hint">
          <p class="text-white mt-4 camera-text">{{ hint }}</p>
        </template>
      </div>
    </div>

    <!-- OVERLAY -->
    <div v-if="foundRef" class="absolute inset-0 flex flex-col items-center justify-center z-50">
      <img :src="IMAGE_URL" alt="" class="animate-bounce" style="width: 50%" />
      <p class="text-white text-xl mt-4 camera-text">
        🌟 {{ $t("foodtreasure.Treasure Revealed") }} 💎
      </p>
      <button @click="onCompleted" class="mt-4 bg-white text-black px-4 py-2 rounded">
        {{ $t("foodtreasure.Learn More") }}
      </button>
    </div>

    <!-- OVERLAY 2 -->
    <div
      v-if="showInvalidQrRef"
      class="absolute inset-0 flex flex-col items-center justify-center z-40"
    >
      <p class="text-red-600 text-xl mt-4 camera-text text-center">
        🔍 {{ $t("foodtreasure.InvalidQRScan") }}
      </p>
    </div>

    <!-- OVERLAY 3 -->
    <div v-if="scannedRef" class="absolute inset-0 flex flex-col items-center justify-end z-10">
      <div class="p-2">
        <small class="text-blue-200 camera-text text-center" style="font-size: 10px">
          scanned content: {{ scannedRef }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
.camera-text {
  font-size: 1.25rem;
  margin-top: 1rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
}
</style>
