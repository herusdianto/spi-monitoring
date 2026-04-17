<template>
  <v-app>
    <v-app-bar v-if="authStore.isAuthenticated" :color="isDark ? 'surface' : 'primary'" flat>
      <v-app-bar-title class="font-weight-bold">
        SPI
      </v-app-bar-title>
      
      <v-btn variant="text" to="/">Dashboard</v-btn>
      <v-btn variant="text" to="/monitoring">List</v-btn>
      <v-btn variant="text" to="/monitoring/new">New</v-btn>
      
      <v-spacer></v-spacer>
      
      <v-btn variant="text" @click="toggleTheme" class="mr-2">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text">
            <v-avatar size="32" color="primary">
              <span class="text-white">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.user?.email }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user?.displayName || 'User' }}</v-list-item-subtitle>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon start>mdi-logout</v-icon>
              Sign Out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    
    <v-main>
      <v-container fluid class="pa-4">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
}

const userInitials = computed(() => {
  const email = authStore.user?.email || '';
  return email.charAt(0).toUpperCase();
});

async function logout() {
  await authStore.logout();
  router.push('/login');
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif !important;
}
</style>