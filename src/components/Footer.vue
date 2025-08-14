<template>
  <footer class="footer">
    &copy; {{ new Date().getFullYear() }} Inventory Manager. All rights reserved.
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  background: var(--primary-bg);
  color: var(--primary-text);
  border-top: 1px solid var(--border-color);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  font-size: 1rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>