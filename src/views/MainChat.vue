<template>
  <div v-if="isGreeting" class="chat-container">
    <ChatMessage :text="`Привет, ${userData?.name}!`" />
    <ChatMessage
      v-for="(message, index) in displayedMessages"
      :key="index"
      :text="message"
    />
    <SimpleButton v-if="showingButtons" class="m-t-16" @click="letsGo()"
      >Погнали!</SimpleButton
    >
  </div>
  <div
    v-else
    :class="[
      'chat-container',
      { 'chat-container__width-answers': isAnswersVisible && !isInputPanelClosing },
    ]"
  >
    <ChatMessage text="Помоги решить такой пример:" @click="closeInputPanel()" />
    <ChatMessage
      v-for="(message, index) in displayedMessages"
      :key="index"
      :text="message"
    />
  </div>
  <div
    v-if="isAnswersVisible && !isShowingMessages"
    :class="isInputPanelClosing ? 'input-panel input-panel__vanish' : 'input-panel'"
  >
    <div class="answers">
      <SimpleButton
        v-for="(answer, i) in answersList"
        :key="i"
        class="m-t-16"
        :class="{
          'red-btn': isWrongAnswer && selectedAnswer === answer,
          'green-btn': isCorrectAnswer && selectedAnswer === answer,
        }"
        @click="() => giveAnswer(answer)"
        >{{ answer }}</SimpleButton
      >
    </div>
  </div>
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

const greetingMessages = ref<string[]>([
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
const answersList = ref<number[]>([]);

const isShowingMessages = ref(false);
const displayedMessages = ref<string[]>([]);
const showingButtons = ref<boolean>(false);
const isGreeting = ref<boolean>(true);
const isAnswersVisible = ref<boolean>(false);
const isCorrectAnswer = ref<boolean>(false);
const isWrongAnswer = ref<boolean>(false);
const isInputPanelClosing = ref<boolean>(false);
const currentExampleIndex = ref<number>(0);
const selectedAnswer = ref<number | null>(null);

const unsolvedExamples = computed(() => {
  return examplesList.value?.filter(
    (example) => !userData.value?.solved_examples.includes(example.id)
  );
});

const showMessages = () => {
  if (isShowingMessages.value) return;
  isShowingMessages.value = true;

  if (isGreeting.value) {
    showGreeting();
  } else {
    displayedMessages.value = [];
    setTimeout(() => {
      showRandomExample();
    }, 2000);
  }
};

const showGreeting = () => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < greetingMessages.value.length) {
      displayedMessages.value.push(greetingMessages.value[index]);
      index++;
    } else {
      clearInterval(interval);
      showingButtons.value = true;
      isShowingMessages.value = false;
    }
  }, 2000);
};

const showRandomExample = () => {
  if (unsolvedExamples.value && unsolvedExamples.value.length) {
    currentExampleIndex.value = Math.floor(Math.random() * unsolvedExamples.value.length);

    displayedMessages.value.push(
      unsolvedExamples.value[currentExampleIndex.value].example
    );
    setTimeout(() => {
      showAnswers();
    }, 2000);
    setTimeout(() => {
      isShowingMessages.value = false;
    }, 2000);
  } else {
    showMessage(["Все примеры решены!"]);
    isShowingMessages.value = false;
  }
};

const showMessage = async (textList: string[]) => {
  for (const [index, text] of textList.entries()) {
    setTimeout(() => {
      displayedMessages.value.push(text);
    }, index * 2000);
  }
};

const showAnswers = () => {
  if (unsolvedExamples.value) {
    answersList.value = unsolvedExamples.value[currentExampleIndex.value].answers;
  }
  isAnswersVisible.value = true;
};

onMounted(async () => {
  examplesList.value = await fetchExamples("1");
  showMessages();
});

const letsGo = () => {
  isGreeting.value = false;
  showMessages();
};

const closeInputPanel = () => {
  isInputPanelClosing.value = true;
  setTimeout(() => {
    isInputPanelClosing.value = false;
  }, 6000);
};

const rightAnswer = async () => {
  if (!isInputPanelClosing.value) {
    isCorrectAnswer.value = true;
    userStore.addScores(1);
    solveExample();
    await showMessage(["Отличный ответ!", "Продолжай в том же духе!:)"]);
    setTimeout(() => {
      isCorrectAnswer.value = false;
      showMessages();
    }, 6000);
  }
};

const wrongAnswer = async () => {
  if (!isInputPanelClosing.value) {
    isWrongAnswer.value = true;
    userStore.addScores(-1);
    await showMessage(["Это было близко!", "Попробуй другой пример:)"]);
    setTimeout(() => {
      isWrongAnswer.value = false;
      showMessages();
    }, 6000);
  }
};

const giveAnswer = (answer: number) => {
  selectedAnswer.value = answer;
  if (
    unsolvedExamples.value &&
    unsolvedExamples.value[currentExampleIndex.value].rightAnswer === answer
  ) {
    rightAnswer();
  } else {
    wrongAnswer();
  }
  closeInputPanel();
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
      let solvedExamples = currentData.solved_examples || [];

      if (unsolvedExamples.value?.length <= 1) solvedExamples = [];

      if (!solvedExamples.includes(currentExampleId)) {
        solvedExamples.push(currentExampleId);
        await setDoc(userDocRef, { solved_examples: solvedExamples }, { merge: true });

        console.log(`Example ${currentExampleId} added to solved_examples.`);

        userData.value = { ...userData.value, solved_examples: solvedExamples };
        examplesList.value = examplesList.value?.filter(
          (example) => example.id !== currentExampleId
        );
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
.chat-container {
  transition: height ease 0.6s;
}
.chat-container__width-answers {
  height: 50dvh;
}

.input-panel {
  position: fixed;
  width: 100vw;
  background: #ffffff;
  bottom: 0;
  left: 0;
  padding: 10px 20px 50px;
  box-sizing: border-box;
  transform: translateY(100%);
  animation: rise 0.6s forwards;
}
.input-panel__vanish {
  transform: translateY(0);
  animation: vanish 0.6s forwards;
}

.answers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 16px;
}

.red-btn {
  background-color: red;
}

.green-btn {
  background-color: green;
}

@keyframes rise {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes vanish {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>
