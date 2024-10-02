<template>
  <div class="overlay" @click.self="closePopup">
    <SimpleCard>
      <slot></slot>
    </SimpleCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

import SimpleCard from "./SimpleCard.vue";

const props = defineProps({
  state: Boolean,
});

const emit = defineEmits(["update:state"]);

const closePopup = () => {
  emit("update:state", false);
  console.log("Popup closed");
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closePopup();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.363);
}
</style>
