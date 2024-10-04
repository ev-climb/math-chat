<template>
  <div
    class="progress"
    :style="{
      height: `${barHeight}px`,
    }"
  >
    <div
      class="bar shadow bubbles"
      :style="{
        width: `${calculatedWidth}%`,
        backgroundColor: barColor,
        height: `${barHeight}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userData } = storeToRefs(userStore);

const max = ref(1000);
const currentScores = computed(() => userData.value?.scores || 0);
const calculatedWidth = computed(() => (currentScores.value / max.value) * 100);

const barColor = ref("#bee1ff");

const defaultBarHeight = 30;
const barHeight = ref(defaultBarHeight);

const updateProgressBar = (isCorrect: boolean) => {
  if (isCorrect) {
    barColor.value = "#4caf50";

    barColor.value = "#f44336";
  }

  barHeight.value = defaultBarHeight * 1.3;

  // Через 1 секунду вернем цвет и высоту по умолчанию
  setTimeout(() => {
    barColor.value = "#bee1ff";
    barHeight.value = defaultBarHeight;
  }, 1000);
};

watch(currentScores, (newScore, oldScore) => {
  const isCorrect = newScore > oldScore;
  updateProgressBar(isCorrect);
});
</script>

<style scoped>
.progress {
  display: inline-block;
  width: 50%;
  height: 30px;
  border-radius: 20px;
  background: #f9f9f970;
  transition: height 0.8s ease-in-out;
}

.bar {
  border-radius: 20px;
  width: 0%;
  height: 100%;
  transition: width 1s ease-in-out, background-color 0.6s ease-in-out,
    height 0.8s ease-in-out;
}

.shadow {
  box-shadow: 0px 45px 50px rgba(0, 0, 0, 0.25);
}

.bubbles {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e6afff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
