<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>

    <select
      v-if="type === 'select'"
      :id="id"
      v-model="inputValue"
      class="select-field"
      @change="$emit('update:modelValue', inputValue)"
    >
      <option v-for="(option, index) in options" :key="index" :value="option">
        {{ option }}
      </option>
    </select>

    <input
      v-else
      :type="type"
      :id="id"
      :placeholder="placeholder"
      v-model="inputValue"
      class="input-field"
      @input="$emit('update:modelValue', inputValue)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  options: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emits = defineEmits(["update:modelValue"]);
const inputValue = ref(props.modelValue);
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

.input-label {
  margin-bottom: 0.5em;
  font-weight: bold;
}

.input-field,
.select-field {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.select-field {
  background-color: white;
}
</style>
