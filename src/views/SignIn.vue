<template>
  <div v-if="loading">Загрузка...</div>

  <SimpleCard v-else title="Вход">
    <SimpleInput v-model="email" type="email" placeholder="Почта" id="email" />
    <SimpleInput v-model="password" type="password" placeholder="Пароль" id="password" />
    <SimpleButton text="Войти" @click="handleSignIn" />
    <router-link to="/sign-up" style="margin-left: 20px">Регистрация</router-link>
  </SimpleCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

import SimpleCard from "@/components/SimpleCard.vue";
import SimpleInput from "@/components/SimpleInput.vue";
import SimpleButton from "@/components/SimpleButton.vue";

const email = ref("");
const password = ref("");
const userStore = useUserStore();
const { loading } = storeToRefs(userStore);

const handleSignIn = async () => {
  await userStore.signIn(email.value, password.value);
};
</script>
