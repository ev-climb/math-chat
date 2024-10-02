import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { firebaseApp } from "@/firebaseConfig";
import { VueFire, VueFireAuth } from "vuefire";

const app = createApp(App)

app.use(createPinia())
app.use(router).use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
})

app.mount('#app')
