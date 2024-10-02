<template>
  <div class="card" :style="`width: ${width}`">
    <h2 v-if="title" class="title">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  width: String,
  title: String,
});
</script>

<style scoped>
.card {
  background: rgb(242, 250, 255);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -7px black;
}
.title {
  margin: 0 0 20px;
}
</style>
