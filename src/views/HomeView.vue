<template>
  <MainHeader />
  <div class="w100">
    <div v-if="loading">Загрузка...</div>
    <MainChat v-else-if="userData?.name" />
    <Greeting v-else />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import Greeting from "@/views/Greeting.vue";
import MainHeader from "@/views/MainHeader.vue";
import MainChat from "./MainChat.vue";

const userStore = useUserStore();
const { userData, loading } = storeToRefs(userStore);
</script>

<style scoped></style>
