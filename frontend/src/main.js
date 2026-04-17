import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import firebase from './config/firebase';
import { useAuthStore } from './store/auth';
import './assets/styles/main.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

firebase.initFirebase();

const authStore = useAuthStore();
authStore.initialize();

app.mount('#app');