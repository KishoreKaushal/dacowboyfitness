<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="markdown-content" v-html="content"></div>
</template>
