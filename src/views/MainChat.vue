<template>
  <div v-if="isGreeting" class="chat-container">
    <ChatMessage :text="`Привет, ${userData?.name}!`" />
    <ChatMessage v-for="(message, index) in displayedMessages" :key="index" :text="message" />
    <SimpleButton v-if="showingButtons" class="m-t-16" @click="letsGo()">Погнали!</SimpleButton>
  </div>
  <div v-else class="chat-container">
    <ChatMessage text="Помоги решить такой пример:" />
    <ChatMessage v-for="(message, index) in displayedMessages" :key="index" :text="message" />
    <div v-if="isAnswersVisible" class="answers">
      <SimpleButton v-if="unsolvedExamples" v-for="(answer, i) in unsolvedExamples[0].answers" :key="i" class="m-t-16"
        @click="() => giveAnswer(answer)">{{ answer }}</SimpleButton>
    </div>
  </div>
  <SimplePopup v-if="isCorrectAnswer" v-model:state="isCorrectAnswer" overlayRgba="rgb(72 237 69 / 37%)">
    Правильный ответ!
  </SimplePopup>
  <SimplePopup v-if="isWrongAnswer" v-model:state="isWrongAnswer" overlayRgba="rgb(231 99 99 / 37%)">
    Попробуй еще разок!
  </SimplePopup>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

import ChatMessage from "@/components/ChatMessage.vue";
import { ref, onMounted, computed } from "vue";
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

type Example = {
  id: string;
  example: string;
  answers: number[];
  rightAnswer: number;
};

const examplesList = ref<Example[] | undefined>([]);

const isShowingMessages = ref(false);
const displayedMessages = ref<string[]>([]);
const showingButtons = ref<boolean>(false);
const isGreeting = ref<boolean>(true);
const isAnswersVisible = ref<boolean>(false);
const isCorrectAnswer = ref<boolean>(false);
const isWrongAnswer = ref<boolean>(false);

const unsolvedExamples = computed(() => {
  return examplesList.value?.filter(
    (example) => !userData.value?.solved_examples.includes(example.id)
  );
});

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
      if (unsolvedExamples.value && unsolvedExamples.value.length > 0) {
        displayedMessages.value.push(unsolvedExamples.value[0].example);
        setTimeout(() => {
          isAnswersVisible.value = true;
        }, 2000);
        isShowingMessages.value = false;
      } else {
        displayedMessages.value.push("Все примеры решены!");
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
  if (unsolvedExamples.value && unsolvedExamples.value[0].rightAnswer == answer) {
    userStore.addScores(5);
    isCorrectAnswer.value = true;
    setTimeout(() => {
      isCorrectAnswer.value = false;
      isAnswersVisible.value = false;
      solveExample();
      showMessages();
    }, 2000);
  } else {
    userStore.addScores(-5);
    isWrongAnswer.value = true;
  }
};

const solveExample = async () => {
  try {
    if (!userData.value) {
      throw new Error("User is not logged in");
    }

    const currentExampleId = unsolvedExamples.value?.[0].id;
    if (!currentExampleId) return;

    const userDocRef = doc(db, "users", auth.currentUser?.uid as string);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const solvedExamples = currentData.solved_examples || [];

      if (!solvedExamples.includes(currentExampleId)) {
        solvedExamples.push(currentExampleId);
        await setDoc(userDocRef, { solved_examples: solvedExamples }, { merge: true });

        console.log(`Example ${currentExampleId} added to solved_examples.`);

        userData.value = { ...userData.value, solved_examples: solvedExamples };
        examplesList.value = examplesList.value?.filter(
          (example) => example.id !== currentExampleId
        );
        showMessages();
      } else {
        console.log(`Example ${currentExampleId} has already been solved.`);
      }
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error solving example:", error);
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
