<template>
  <div v-if="isGreeting" class="chat-container">
    <ChatMessage :text="`Привет, ${userData?.name}!`" />
    <ChatMessage
      v-for="(message, index) in displayedMessages"
      :key="index"
      :text="message"
    />
    <SimpleButton
      v-if="showingButtons"
      class="m-t-16"
      text="Погнали!"
      @click="letsGo()"
    />
  </div>
  <div v-else class="chat-container">
    <ChatMessage text="Помоги решить такой пример:" />
    <ChatMessage
      v-for="(message, index) in displayedMessages"
      :key="index"
      :text="message"
    />
    <div v-if="isAnswersVisible" class="answers">
      <SimpleButton
        v-if="examplesList"
        v-for="(answer, i) in examplesList[0].answers"
        :key="i"
        class="m-t-16"
        :text="answer"
        @click="() => giveAnswer(answer)"
      />
    </div>
  </div>
  <SimplePopup v-if="isCorrectAnswer" v-model:state="isCorrectAnswer">
    Правильный ответ!
  </SimplePopup>
  <SimplePopup v-if="isWrongAnswer" v-model:state="isWrongAnswer">
    Попробуй еще разок!
  </SimplePopup>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import ChatMessage from "@/components/ChatMessage.vue";
import { ref, onMounted } from "vue";
import SimpleButton from "@/components/SimpleButton.vue";

import { useExamplesStore } from "@/stores/examples";
import SimplePopup from "@/components/SimplePopup.vue";

const userStore = useUserStore();
const { userData } = storeToRefs(userStore);
const examplesStore = useExamplesStore();
const { fetchExamples } = examplesStore;

const messages = ref<string[]>([
  "Помоги мне решить некоторые примеры",
  "За правильные ответы ты будешь получать очки и новые уровни",
  "Начнем?",
]);

// const examples = ref<string[]>(["25 + 30"]);
const isShowingMessages = ref(false);
const examplesList = ref<any[] | undefined>([]);
const displayedMessages = ref<string[]>([]);
const showingButtons = ref<boolean>(false);
const isGreeting = ref<boolean>(true);
const isAnswersVisible = ref<boolean>(false);
const isCorrectAnswer = ref<boolean>(false);
const isWrongAnswer = ref<boolean>(false);

const showMessages = () => {
  if (isShowingMessages.value) return;
  isShowingMessages.value = true;
  if (isGreeting.value) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.value.length) {
        displayedMessages.value.push(messages.value[index]);
        index++;
      } else {
        clearInterval(interval);
        showingButtons.value = true;
        isShowingMessages.value = false;
      }
    }, 2000);
  } else {
    displayedMessages.value = [];
    setTimeout(() => {
      if (examplesList.value) {
        displayedMessages.value.push(examplesList.value[0].example);
        setTimeout(() => {
          isAnswersVisible.value = true;
        }, 2000);
        isShowingMessages.value = false;
      } else {
        isShowingMessages.value = false;
      }
    }, 2000);
  }
};

onMounted(async () => {
  examplesList.value = await fetchExamples("1");
  showMessages();
});

const letsGo = () => {
  isGreeting.value = false;
  showMessages();
};

const giveAnswer = (answer: number) => {
  if (examplesList.value && examplesList.value[0].rightAnswer == answer) {
    userStore.addScores(5);
    isCorrectAnswer.value = true;
    setTimeout(() => {
      isCorrectAnswer.value = false;
      isAnswersVisible.value = false;
      showMessages();
    }, 2000);
  } else {
    userStore.addScores(-5);
    isWrongAnswer.value = true;
  }
};
</script>

<style scoped>
.answers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 16px;
}
</style>
