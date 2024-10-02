<template>
  <div class="chat-container">
    <ChatMessage
      v-for="(message, index) in displayedMessages"
      :key="index"
      :text="message"
    />

    <div v-if="showButtons" class="flex column aic gap-16 m-t-16">
      <router-link to="/sign-in">
        <SimpleButton text="Войти" />
      </router-link>
      <p>или</p>
      <router-link to="/sign-up">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SimpleButton from "@/components/SimpleButton.vue";
import ChatMessage from "@/components/ChatMessage.vue";

const showButtons = ref(false);
const messages = ref<string[]>(["Добро пожаловать в МатЧат!", "Ну что, начнем?"]);
const displayedMessages = ref<string[]>([]);

onMounted(() => {
  showMessages();
});

const showMessages = () => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < messages.value.length) {
      displayedMessages.value.push(messages.value[index]);
      index++;
    } else {
      clearInterval(interval);
      showButtons.value = true;
    }
  }, 2000);
};
</script>

<style scoped></style>
