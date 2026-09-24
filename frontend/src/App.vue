<template>
  <div id="app">
    <Navbar v-if="authStore.isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth.js'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>
