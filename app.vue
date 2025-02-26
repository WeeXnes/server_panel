<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="navbar bg-base-100 shadow-lg px-4">
      <div class="flex-1">
        <NuxtLink to="/" class="btn btn-ghost text-xl">Server Panel</NuxtLink>
      </div>
      <div class="hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><NuxtLink to="/">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
        </ul>
      </div>
      <div class="lg:hidden">
        <button @click="toggleMenu" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div v-if="menuOpen" class="absolute top-16 left-0 w-full bg-base-100 shadow-lg lg:hidden z-50">
        <ul class="menu menu-vertical p-4">
          <li><NuxtLink to="/" @click="toggleMenu">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/settings" @click="toggleMenu">Settings</NuxtLink></li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="footer p-4 bg-neutral text-neutral-content text-center">
      <a href="https://github.com/WeeXnes"> ServerPanel by WeeXnes</a>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>
