<template>
  <div id="app">
    <Navbar v-if="authStore.isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { onSessionChange } from './auth/session.js'
import Navbar from './components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()

// 多标签页：一处登录 / 退出 / 过期，其他标签页的界面（store 内已同步）与路由随之对齐
const unsubscribe = onSessionChange((session, source) => {
  if (source !== 'external') return
  const route = router.currentRoute.value
  if (!session.token && route.meta.requiresAuth) {
    router.push('/login')
  } else if (session.token && route.meta.guest) {
    router.push('/')
  }
})

onUnmounted(unsubscribe)
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
