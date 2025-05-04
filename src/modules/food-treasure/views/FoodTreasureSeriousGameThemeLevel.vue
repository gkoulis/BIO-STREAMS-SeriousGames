<script setup>
import { defineEmits, defineProps, toRefs } from "vue";
import cloneDeep from "lodash/cloneDeep";
import PrivateContainer from "@/components/PrivateContainer.vue";
import QrScanner from "./QrScanner.vue";

const emit = defineEmits(["onCompleted"]);

const props = defineProps({
  level: Object,
});

const { level } = toRefs(props);
const LEVEL = cloneDeep(level.value);
const QR_TARGET = {
  hints: LEVEL.hints,
  secret_code: LEVEL.secret_code,
  image_url: LEVEL.image_url,
};

const handleOnReturn = ($event) => {};

const handleOnCompleted = ($event) => {
  emit("onCompleted", $event);
};
</script>

<template>
  <div class="FoodTreasureBackground">
    <private-container :is-container="true">
      <div>
        <QrScanner :qr-target="QR_TARGET" v-on:on-completed="handleOnCompleted" />
      </div>
    </private-container>
  </div>
</template>

<style scoped></style>
