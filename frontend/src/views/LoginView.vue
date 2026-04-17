<template>
  <v-container fluid class="fill-height login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8">
          <v-card-title class="text-h5 text-center mb-4">
            <v-icon size="32" color="primary" class="mr-2">mdi-chart-line</v-icon>
            SPI Monitoring
          </v-card-title>
          
          <v-card-subtitle class="text-center mb-4">
            {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
          </v-card-subtitle>
          
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-if="!isLogin"
              v-model="displayName"
              label="Display Name"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.minLength]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-if="!isLogin"
              v-model="confirmPassword"
              label="Confirm Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check"
              :rules="[rules.required, rules.passwordMatch]"
              class="mb-4"
            ></v-text-field>
            
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ authStore.error }}
            </v-alert>
            
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="authStore.loading"
            >
              {{ isLogin ? 'Sign In' : 'Register' }}
            </v-btn>
          </v-form>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="text-center">
            <span class="text-grey">
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
            </span>
            <v-btn
              variant="text"
              color="primary"
              @click="toggleMode"
            >
              {{ isLogin ? 'Register' : 'Sign In' }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref(null);
const valid = ref(false);
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const displayName = ref('');
const showPassword = ref(false);

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Invalid email address',
  minLength: v => v.length >= 6 || 'Password must be at least 6 characters',
  passwordMatch: v => v === password.value || 'Passwords do not match'
};

async function submit() {
  const { valid: isValid } = await form.value.validate();
  
  if (!isValid) return;
  
  let success;
  
  if (isLogin.value) {
    success = await authStore.login(email.value, password.value);
  } else {
    success = await authStore.register(email.value, password.value, displayName.value);
  }
  
  if (success) {
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value;
  authStore.error = null;
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
}
</style>