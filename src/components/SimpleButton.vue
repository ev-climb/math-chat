<template>
  <button type="button" @click.prevent="$emit('click')">{{ text }}</button>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: [String, Number],
    default: "",
  },
});
</script>

<style scoped>
button {
  font-size: 1.5em;
  padding: 0.5em 1em;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
