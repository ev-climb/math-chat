<template>
  <div class="header">
    <img src="@/assets/images/icons/logo.png" alt="logo" class="logo" />
    <ProgressBar />
    <div v-if="userData?.name" class="avatar" @click="settingsOpened = true">
      <img src="@/assets/images/avatars/avatar-standart.svg" alt="avatar" />
    </div>
    <router-link v-else to="/sign-in">
      <div class="avatar">
        <img src="@/assets/images/avatars/avatar-empty.svg" alt="avatar" />
      </div>
    </router-link>
    <SimplePopup v-if="settingsOpened" v-model:state="settingsOpened">
      <div v-if="exampleOpened" class="flex column gap-16">
        <SimpleInput
          label="Уровень"
          type="select"
          v-model="selectedLevel"
          :options="['1', '2', '3', '4', '5']"
        />
        <SimpleInput label="Пример" placeholder="35 + 43" v-model="example" />
        <SimpleInput
          label="Варианты ответов"
          placeholder="25,78,65,70,44,79"
          v-model="answers"
        />
        <SimpleInput label="Правильный ответ" placeholder="78" v-model="rightAnswer" />
        <SimpleButton text="Добавить" @click="addExample" />
      </div>
      <div v-else class="flex column gap-16">
        <SimpleButton text="Добавить примеры" @click="addingExamplesOpen" />
        <SimpleButton text="Выход" @click="logOut" />
      </div>
    </SimplePopup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { useUserStore } from "@/stores/user";
import { useExamplesStore } from "@/stores/examples";
import { storeToRefs } from "pinia";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

import SimplePopup from "@/components/SimplePopup.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import SimpleButton from "@/components/SimpleButton.vue";
import SimpleInput from "@/components/SimpleInput.vue";

const userStore = useUserStore();
const examplesStore = useExamplesStore();
const { userData } = storeToRefs(userStore);
const logOut = userStore.logOut;
const db = getFirestore();

const settingsOpened = ref<boolean>(false);
const exampleOpened = ref<boolean>(false);
const selectedLevel = ref<string>("1");
const example = ref<string>("");
const answers = ref<string>("");
const rightAnswer = ref<string>("");

const addingExamplesOpen = () => {
  exampleOpened.value = true;
};

const addExample = async () => {
  if (!example.value || !answers.value || !rightAnswer.value) {
    alert("Все поля должны быть заполнены");
    return;
  }

  try {
    const answersArray = answers.value.split(",").map((ans) => ans.trim());
    const level = selectedLevel.value;
    const exampleData = {
      example: example.value,
      answers: answersArray,
      rightAnswer: rightAnswer.value,
    };
    const exampleRef = doc(collection(db, "examples", level, "problems"));

    await setDoc(exampleRef, exampleData);

    alert("Пример успешно добавлен!");

    example.value = "";
    answers.value = "";
    rightAnswer.value = "";
  } catch (error) {
    console.error("Ошибка при добавлении примера:", error);
    alert("Ошибка при добавлении примера.");
  }
};

// Для добавления примеров
// const examples = reactive([
//   {
//     example: "5 + 3",
//     answers: [6, 7, 8, 9, 10, 5],
//     rightAnswer: 8,
//   },

// ]);
// const addExamples = async () => {
//   try {
//     await examplesStore.uploadExamples(examples, 1);
//     alert("Примеры успешно добавлены!");
//   } catch (error) {
//     console.error("Ошибка при добавлении примеров:", error);
//     alert("Ошибка при добавлении примеров.");
//   }
// };
// addExamples();
</script>

<style scoped>
.header {
  padding: 10px;
  width: 100%;
  background: #3498db;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transform: translateY(-100%);
  animation: appearance 1s forwards;
  box-shadow: 0 0 8px -3px black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.logo {
  width: 50px;
  height: 50px;
}

.avatar {
  width: 40px;
  height: 40px;
  /* border: 1px solid grey; */
  box-shadow: 0 0 5px -2px white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 30px;
  }
}

@keyframes appearance {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
