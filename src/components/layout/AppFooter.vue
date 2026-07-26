<script setup lang="ts">
import CowboyLogo from '../icons/CowboyLogo.vue'
import { siteConfig } from '../../data/content'
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="brand">
        <div class="logo-wrap">
          <CowboyLogo />
        </div>
        <span class="font-display-lg">{{ siteConfig.name }}</span>
      </div>
      <div class="flex flex-col items-center md:items-end gap-4">
        <div class="flex gap-6 mb-2">
          <a :href="`mailto:${siteConfig.email}`" class="social-icon" title="Email">
            <span class="material-symbols-outlined icon">mail</span>
          </a>
          <a :href="siteConfig.instagram" target="_blank" class="social-icon" title="Instagram">
            <span class="material-symbols-outlined icon">photo_camera</span>
          </a>
        </div>
        <p class="font-label-sm copyright">{{ siteConfig.copyright }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-surface-container-lowest);
  width: 100%;
  padding: 48px 0;
  border-top: 1px solid var(--border-light);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    padding: 0 64px;
  }
}
.brand {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.5rem;
  color: var(--color-primary);
}
@media (min-width: 768px) {
  .brand {
    font-size: 1.875rem;
  }
}
.logo-wrap {
  height: 32px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}
.social-icon {
  color: var(--color-on-surface-variant);
  transition: color 0.3s ease;
  text-decoration: none;
}
.social-icon:hover {
  color: var(--color-primary);
}
.icon {
  font-size: 18px;
  font-variation-settings: 'wght' 200;
}
.copyright {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  opacity: 0.4;
}
</style>
