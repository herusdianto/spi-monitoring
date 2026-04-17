<template>
  <v-app>
    <v-app-bar v-if="authStore.isAuthenticated" color="primary" elevation="2">
      <v-app-bar-title class="font-weight-bold">
        <v-icon class="mr-2">mdi-chart-line</v-icon>
        SPI Monitoring
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn variant="text" to="/">
        <v-icon start>mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      
      <v-btn variant="text" to="/monitoring">
        <v-icon start>mdi-list-box</v-icon>
        Data List
      </v-btn>
      
      <v-btn variant="text" to="/monitoring/new">
        <v-icon start>mdi-plus</v-icon>
        New Entry
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text">
            <v-avatar size="32" color="secondary">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

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