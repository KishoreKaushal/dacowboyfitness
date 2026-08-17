<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollPercent = ref(0)

function onScroll() {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollPercent.value = height > 0 ? (winScroll / height) * 100 : 0
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="progress-bar" :style="{ width: scrollPercent + '%' }"></div>
</template>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background-color: var(--progress-bar-bg);
  width: 0%;
  z-index: 100;
  transition: width 0.1s ease-out;
}
</style>
