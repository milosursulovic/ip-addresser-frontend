<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
    <h1 class="text-5xl font-bold text-red-600 mb-4">404</h1>
    <p class="text-xl text-gray-700">Stranica nije pronađena</p>
    <router-link to="/" class="mt-6 text-blue-500 hover:underline">Vrati se na početnu</router-link>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = `Stranica nije pronađena - IP Adresar`
})
</script>