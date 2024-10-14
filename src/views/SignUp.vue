<template>
  <div v-if="loading">Загрузка...</div>

  <SimpleCard v-else title="Регистрация">
    <SimpleInput v-model="name" type="text" placeholder="Имя" id="name" />
    <SimpleInput v-model="email" type="email" placeholder="Почта" id="email" />
    <SimpleInput v-model="password" type="password" placeholder="Пароль" id="password" />
    <SimpleButton @click="handleSignUp">Зарегистрироваться</SimpleButton>
    <p class="m-t-32 text-center"><router-link to="/sign-in">Вход</router-link></p>
  </SimpleCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import SimpleCard from "@/components/SimpleCard.vue";
import SimpleInput from "@/components/SimpleInput.vue";
import SimpleButton from "@/components/SimpleButton.vue";

const name = ref("");
const email = ref("");
const scores = ref(0);
const password = ref("");
const solved_examples = ref([]);
const userStore = useUserStore();
const { loading } = storeToRefs(userStore);

const handleSignUp = async () => {
  await userStore.signUp(
    name.value,
    email.value,
    password.value,
    scores.value,
    solved_examples.value
  );
};
</script>
