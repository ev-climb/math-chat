<template>
  <button type="button" @click.prevent="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

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
