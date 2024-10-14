<template>
  <!-- Используем v-if для управления видимостью попапа -->
  <transition name="fade">
    <div
      v-if="state"
      class="overlay"
      :style="{ background: `${background}` }"
      @click.self="closePopup"
    >
      <SimpleCard>
        <slot></slot>
      </SimpleCard>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import SimpleCard from "./SimpleCard.vue";

const props = defineProps({
  state: Boolean, // состояние видимости попапа
  overlayRgba: {
    type: String,
    default: "rgba(0, 0, 0, 0.363)", // цвет фона
  },
});

const emit = defineEmits(["update:state"]);
const background = ref("rgba(0, 0, 0, 0)");

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

  setTimeout(() => {
    background.value = props.overlayRgba; // Плавное изменение цвета фона
  }, 10); // Задержка для анимации
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
  background: rgba(0, 0, 0, 0);
  transition: background 1s ease-in;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
  /* Плавное изменение прозрачности */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  /* Начальная и конечная прозрачность */
}
</style>
