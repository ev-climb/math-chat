<template>
  <div :class="`message ${fromUser && 'user-message'}`">
    <div class="avatar">
      <img :src="`src/assets/images/icons/${avatar}`" alt="avatar" />
    </div>
    <div class="text-box">
      <div v-if="typing" class="typing">
        <div class="point"></div>
        <div class="point"></div>
        <div class="point"></div>
      </div>
      <p v-else class="text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  fromUser: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "robo.png",
  },
});

const typing = ref<boolean>(true);

onMounted(() => {
  if (props.fromUser) {
    typing.value = false;
  } else {
    setTimeout(() => {
      typing.value = false;
    }, 1000);
  }
});
</script>

<style scoped>
.message {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px -7px black;
  background: rgba(255, 255, 255, 0.5);
}
.text-box {
  padding: 1em;
  border-radius: 20px 20px 20px 0;
  background: rgba(255, 255, 255, 0.5);
  background: white;
}
.text {
  margin: 0;
  line-height: 1.5em;
  font-weight: 700;
}
.name {
  margin: 0;
}

.typing {
  height: 36px;
  width: 64px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.point {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3498db;
  animation: bounce 700ms infinite;
}

.point:nth-of-type(2) {
  animation-delay: 50ms;
}

.point:nth-of-type(3) {
  animation-delay: 100ms;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-5px);
  }
  40% {
    transform: translateY(0);
  }
}
</style>
